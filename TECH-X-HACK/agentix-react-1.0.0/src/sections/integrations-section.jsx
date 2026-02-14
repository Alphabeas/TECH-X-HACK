import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import SectionTitle from "../components/section-title";
import { callFunction } from "../services/functions-api";
import { getUserProfile, saveUserLatestAnalysis } from "../services/profile";

export default function IntegrationsSection() {
    const navigate = useNavigate();
    const resumeInputRef = useRef(null);
    const [currentUid, setCurrentUid] = useState("");
    const [dreamRole, setDreamRole] = useState("");
    const [githubUsername, setGithubUsername] = useState("");
    const [resumeName, setResumeName] = useState("");
    const [status, setStatus] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [latestAnalysis, setLatestAnalysis] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const uid = user?.uid || "";
            setCurrentUid(uid);

            if (!uid) {
                setDreamRole("");
                setLatestAnalysis(null);
                return;
            }

            const storageKey = `latest_analysis_${uid}`;
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                try {
                    setLatestAnalysis(JSON.parse(stored));
                } catch {
                    localStorage.removeItem(storageKey);
                    setLatestAnalysis(null);
                }
            } else {
                setLatestAnalysis(null);
            }

            try {
                const profile = await getUserProfile(uid);
                setDreamRole(profile?.dreamRole || "");
                if (profile?.latestAnalysis) {
                    setLatestAnalysis(profile.latestAnalysis);
                    localStorage.setItem(storageKey, JSON.stringify(profile.latestAnalysis));
                }
            } catch {
                setDreamRole("");
            }
        });

        return () => unsubscribe();
    }, []);

    const persistAnalysis = (response) => {
        if (!currentUid) return;
        const storageKey = `latest_analysis_${currentUid}`;
        localStorage.setItem(storageKey, JSON.stringify(response));
        setLatestAnalysis(response);
        saveUserLatestAnalysis(currentUid, response).catch(() => {});
        window.dispatchEvent(new CustomEvent("analysis-updated", { detail: { uid: currentUid, analysis: response } }));
    };

    const persistAndOpenResults = (response) => {
        persistAnalysis(response);
        setTimeout(() => {
            navigate("/dashboard/results");
        }, 180);
    };

    const handleGitHubPublicImport = async () => {
        if (!githubUsername.trim()) return;
        setIsBusy(true);
        try {
            const response = await callFunction("/analyze-profile/", {
                method: "POST",
                body: JSON.stringify({ github_username: githubUsername.trim(), ...(dreamRole ? { dream_role: dreamRole } : {}) }),
            });
            persistAndOpenResults(response);
            setStatus("GitHub public data imported and analyzed.");
        } catch (error) {
            setStatus(error.message);
        } finally {
            setIsBusy(false);
        }
    };

    const handleResumeUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setStatus("Please select a PDF file.");
            return;
        }
        setResumeName(file.name || "resume.pdf");
        if (!auth.currentUser) {
            setStatus("Please log in again to upload a resume.");
            return;
        }
        setIsBusy(true);
        try {
            const reader = new FileReader();
            const fileData = await new Promise((resolve, reject) => {
                reader.onload = () => {
                    const base64 = reader.result?.toString().split(",")[1];
                    resolve(base64);
                };
                reader.onerror = () => reject(new Error("Failed to read file."));
                reader.readAsDataURL(file);
            });
            const response = await callFunction("/analyze-profile/", {
                method: "POST",
                body: JSON.stringify({ resume_file_base64: fileData, ...(dreamRole ? { dream_role: dreamRole } : {}) }),
            });
            persistAndOpenResults(response);
            setStatus("Resume uploaded, parsed, and analyzed.");
        } catch (error) {
            setStatus(error.message);
        } finally {
            setIsBusy(false);
        }
    };

    const triggerResumeUpload = () => {
        resumeInputRef.current?.click();
    };

    return (
        <section className="flex flex-col items-center" id="integrations">
            {status && (
                <div className="w-full max-w-5xl mb-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-xs text-slate-600">
                    {status}
                </div>
            )}
            <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleResumeUpload}
            />
            <SectionTitle
                title="Profile integrations"
                description="Connect your existing proof of work so the agent understands your current level."
            />
            <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Primary source</p>
                    <h3 className="font-display text-xl text-slate-900 mt-3">GitHub username</h3>
                    <p className="text-sm text-slate-600 mt-2">Import public repositories and infer your current technical footprint.</p>
                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
                        <input
                            value={githubUsername}
                            onChange={(event) => setGithubUsername(event.target.value)}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="e.g. octocat"
                        />
                        <button
                            onClick={handleGitHubPublicImport}
                            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                            disabled={isBusy}
                        >
                            {isBusy ? "Importing..." : "Import GitHub"}
                        </button>
                    </div>
                </motion.div>
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Primary source</p>
                    <h3 className="font-display text-xl text-slate-900 mt-3">Resume PDF</h3>
                    <p className="text-sm text-slate-600 mt-2">Upload your latest resume to extract verified skills and project evidence.</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                            onClick={triggerResumeUpload}
                            className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white"
                            disabled={isBusy}
                        >
                            {isBusy ? "Uploading..." : "Upload Resume"}
                        </button>
                        {resumeName && <span className="text-xs text-slate-600">Selected: {resumeName}</span>}
                    </div>
                </motion.div>
            </div>
            <div className="mt-6 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs text-slate-600">
                {dreamRole ? `Target role: ${dreamRole}.` : "Set your target role in onboarding."} Imported data is analyzed and saved to your personal dashboard only.
            </div>
            {latestAnalysis && !latestAnalysis.error && (
                <div className="mt-6 w-full max-w-5xl rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Analysis ready</p>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900">
                            Alignment
                            <span className="block font-display text-xl mt-1">{latestAnalysis.alignment_score ?? 0}%</span>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900">
                            Gaps
                            <span className="block font-display text-xl mt-1">
                                {[
                                    ...(latestAnalysis?.missing_skills?.missing_technical || []),
                                    ...(latestAnalysis?.missing_skills?.missing_tools || []),
                                    ...(latestAnalysis?.missing_skills?.missing_soft || []),
                                ].length}
                            </span>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900">
                            Roadmap
                            <span className="block font-display text-xl mt-1">{(latestAnalysis.roadmap || []).length} weeks</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard/results")}
                            className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
                        >
                            Open evaluations
                        </button>
                        <span className="text-xs text-emerald-700">Takes you to your metrics and roadmap page.</span>
                    </div>
                </div>
            )}
        </section>
    );
}
