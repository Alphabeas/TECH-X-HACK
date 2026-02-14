const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pdfParse = require("pdf-parse");
const { skillKeywords, roleRequirements, buildRoadmap } = require("./skills");

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;
    if (!token) {
        return res.status(401).send("Missing auth token");
    }
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).send("Invalid auth token");
    }
}

app.post("/github/start", verifyToken, async (req, res) => {
    const { redirectBase } = req.body;
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
        return res.status(500).send("Missing GitHub client ID");
    }
    const state = Buffer.from(JSON.stringify({ uid: req.user.uid, redirectBase }), "utf8").toString("base64");
    const callbackUrl = `${process.env.APP_BASE_URL || "http://localhost:5173"}/oauth/github`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}&scope=read:user%20repo`;
    return res.json({ authUrl });
});

app.get("/oauth/github", async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) {
        return res.status(400).send("Missing code or state");
    }
    const { uid, redirectBase } = JSON.parse(Buffer.from(state, "base64").toString("utf8"));
    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );
        const accessToken = response.data.access_token;
        await db.collection("users").doc(uid).collection("connections").doc("github").set({
            accessToken,
            connectedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return res.redirect(`${redirectBase || process.env.APP_BASE_URL || "http://localhost:5173"}/dashboard?github=connected`);
    } catch (error) {
        return res.status(500).send("GitHub auth failed");
    }
});

app.post("/github/sync", verifyToken, async (req, res) => {
    const connection = await db.collection("users").doc(req.user.uid).collection("connections").doc("github").get();
    if (!connection.exists) {
        return res.status(404).send("GitHub not connected");
    }
    const { accessToken } = connection.data();
    const githubClient = axios.create({
        baseURL: "https://api.github.com",
        headers: { Authorization: `token ${accessToken}` },
    });
    const reposResponse = await githubClient.get("/user/repos?per_page=50");
    const repos = reposResponse.data || [];
    const languages = new Set();
    const topics = new Set();

    repos.forEach((repo) => {
        (repo.language ? [repo.language] : []).forEach((lang) => languages.add(lang));
        (repo.topics || []).forEach((topic) => topics.add(topic));
    });

    const summary = {
        repoCount: repos.length,
        languages: Array.from(languages),
        topics: Array.from(topics),
    };

    await db.collection("users").doc(req.user.uid).set(
        {
            githubSummary: summary,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    return res.json(summary);
});

app.post("/github/public", verifyToken, async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).send("Missing GitHub username");
    }
    const githubClient = axios.create({
        baseURL: "https://api.github.com",
    });
    const reposResponse = await githubClient.get(`/users/${username}/repos?per_page=50`);
    const repos = reposResponse.data || [];
    const languages = new Set();
    const topics = new Set();

    repos.forEach((repo) => {
        (repo.language ? [repo.language] : []).forEach((lang) => languages.add(lang));
        (repo.topics || []).forEach((topic) => topics.add(topic));
    });

    const summary = {
        repoCount: repos.length,
        languages: Array.from(languages),
        topics: Array.from(topics),
        username,
    };

    await db.collection("users").doc(req.user.uid).set(
        {
            githubSummary: summary,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    return res.json(summary);
});

app.post("/linkedin/import", verifyToken, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).send("Missing LinkedIn text");
    await db.collection("users").doc(req.user.uid).set(
        {
            linkedinText: text,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );
    return res.json({ status: "ok" });
});

app.post("/resume/parse", verifyToken, async (req, res) => {
    const { filePath, fileData } = req.body;
    let parsed = null;
    if (fileData) {
        const buffer = Buffer.from(fileData, "base64");
        parsed = await pdfParse(buffer);
    } else if (filePath) {
        const bucket = storage.bucket();
        const file = bucket.file(filePath);
        const [buffer] = await file.download();
        parsed = await pdfParse(buffer);
    } else {
        return res.status(400).send("Missing filePath or fileData");
    }
    await db.collection("users").doc(req.user.uid).set(
        {
            resumeText: parsed.text,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );
    return res.json({ text: parsed.text.slice(0, 2000) });
});

app.post("/profile/analyze", verifyToken, async (req, res) => {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const dreamRole = req.body?.dreamRole || userData?.dreamRole || "Product Analyst";
    const linkedinText = userData?.linkedinText || "";
    const resumeText = userData?.resumeText || "";
    const githubSummary = userData?.githubSummary || {};

    const combinedText = `${linkedinText}\n${resumeText}\n${JSON.stringify(githubSummary)}`.toLowerCase();
    const foundSkillsFallback = skillKeywords.filter((skill) => combinedText.includes(skill.toLowerCase()));
    const roleSkills = roleRequirements[dreamRole] || [];
    const gapsFallback = roleSkills.filter((skill) => !foundSkillsFallback.includes(skill));
    let roadmap = buildRoadmap(dreamRole, gapsFallback);
    let foundSkills = foundSkillsFallback;
    let gaps = gapsFallback;
    let projects = null;
    let resources = null;
    let checkpoints = null;

    if (process.env.GROQ_API_KEY) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
                    temperature: 0.3,
                    messages: [
                        {
                            role: "system",
                            content: "You are a career analysis engine. Return JSON only with keys: foundSkills (array of strings), gaps (array of strings), roadmap (array of {week, focus, outputs, checkpoint}).",
                        },
                        {
                            role: "user",
                            content: JSON.stringify({
                                dreamRole,
                                linkedinText,
                                resumeText,
                                githubSummary,
                            }),
                        },
                    ],
                }),
            });

            const payload = await response.json();
            const content = payload?.choices?.[0]?.message?.content;
            const parsed = content ? JSON.parse(content) : null;
            if (parsed?.foundSkills && parsed?.gaps && parsed?.roadmap) {
                foundSkills = parsed.foundSkills;
                gaps = parsed.gaps;
                roadmap = parsed.roadmap;
            }
        } catch (error) {
            // Fall back to keyword analysis
        }
    }

    await db.collection("users").doc(req.user.uid).set(
        {
            analysis: {
                dreamRole,
                foundSkills,
                gaps,
                roadmap,
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    return res.json({ foundSkills, gaps, roadmap });
});

exports.api = functions.https.onRequest(app);
