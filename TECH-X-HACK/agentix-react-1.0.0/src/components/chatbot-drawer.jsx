import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserLatestAnalysis } from "../services/profile";

const QUICK_PROMPTS = [
    "Give me my profile summary",
    "What are my top skill gaps?",
    "What should I do this week?",
    "Show recommended projects",
    "Show recommended resources",
];

function detectIntent(message) {
    const text = String(message || "").toLowerCase();
    if (text.includes("summary") || text.includes("profile")) return "summary";
    if (text.includes("gap") || text.includes("missing")) return "gaps";
    if (text.includes("week") || text.includes("roadmap") || text.includes("plan")) return "week";
    if (text.includes("project")) return "projects";
    if (text.includes("resource")) return "resources";
    if (text.includes("score") || text.includes("alignment") || text.includes("readiness")) return "score";
    return "help";
}

function buildReply(intent, analysis) {
    if (!analysis) {
        return "I don’t have analysis data yet. Please upload your resume or import GitHub first.";
    }

    const technical = analysis?.user_skills?.technical || [];
    const tools = analysis?.user_skills?.tools || [];
    const soft = analysis?.user_skills?.soft || [];

    const missingTechnical = analysis?.missing_skills?.missing_technical || [];
    const missingTools = analysis?.missing_skills?.missing_tools || [];
    const missingSoft = analysis?.missing_skills?.missing_soft || [];

    const allGaps = [...missingTechnical, ...missingTools, ...missingSoft];
    const roadmap = analysis?.roadmap || [];
    const firstWeek = roadmap[0] || null;
    const projects = analysis?.projects || [];
    const resources = analysis?.resources || [];

    switch (intent) {
        case "summary":
            return `Alignment: ${analysis.alignment_score ?? 0}% | Readiness: ${analysis.readiness || "N/A"}. Skills found: ${technical.length + tools.length + soft.length}. Gaps found: ${allGaps.length}.`;
        case "gaps":
            return allGaps.length
                ? `Top gaps: ${allGaps.slice(0, 6).join(", ")}.`
                : "Great news — no major skill gaps were detected.";
        case "week":
            return firstWeek
                ? `${firstWeek.week}: ${firstWeek.focus}. Tasks: ${(firstWeek.tasks || []).slice(0, 4).join(" | ")}.`
                : "No roadmap yet. Run analysis to generate your weekly plan.";
        case "projects":
            return projects.length
                ? `Recommended projects: ${projects.slice(0, 5).join(" | ")}.`
                : "No project recommendations yet. Run analysis first.";
        case "resources":
            return resources.length
                ? `Recommended resources: ${resources.slice(0, 4).join(" | ")}.`
                : "No resources found yet. Run analysis first.";
        case "score":
            return `Your alignment score is ${analysis.alignment_score ?? 0}% and readiness is ${analysis.readiness || "N/A"}.`;
        default:
            return "Try asking about summary, skill gaps, weekly plan, projects, or resources.";
    }
}

export default function ChatbotDrawer({ isAuthed }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUid, setCurrentUid] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(QUICK_PROMPTS[0]);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hi! I’m your assistant. Pick a prompt below or ask a custom question.",
        },
    ]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUid(user?.uid || "");
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isAuthed || !currentUid) {
            setAnalysis(null);
            return;
        }

        const storageKey = `latest_analysis_${currentUid}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setAnalysis(JSON.parse(stored));
            } catch {
                localStorage.removeItem(storageKey);
            }
        }

        getUserLatestAnalysis(currentUid)
            .then((latest) => {
                if (latest) {
                    setAnalysis(latest);
                    localStorage.setItem(storageKey, JSON.stringify(latest));
                }
            })
            .catch(() => {});
    }, [isAuthed, currentUid]);

    useEffect(() => {
        const handleAnalysisUpdated = (event) => {
            const payload = event?.detail;
            if (!payload?.uid || payload.uid !== currentUid) return;
            setAnalysis(payload.analysis || null);
        };
        window.addEventListener("analysis-updated", handleAnalysisUpdated);
        return () => window.removeEventListener("analysis-updated", handleAnalysisUpdated);
    }, [currentUid]);

    const disabled = !isAuthed;

    const messageCountLabel = useMemo(() => {
        const count = messages.length;
        return `${count} ${count === 1 ? "message" : "messages"}`;
    }, [messages.length]);

    const ask = (text) => {
        if (!text?.trim()) return;
        const userText = text.trim();
        const intent = detectIntent(userText);
        const reply = buildReply(intent, analysis);

        setMessages((prev) => [
            ...prev,
            { role: "user", text: userText },
            { role: "bot", text: reply },
        ]);
    };

    const onAskPrompt = () => ask(selectedPrompt);

    const onSend = () => {
        ask(input);
        setInput("");
    };

    return (
        <div className="fixed bottom-4 right-4 z-[120]">
            {isOpen && (
                <div className="mb-3 w-[min(92vw,24rem)] rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Career assistant</p>
                            <p className="text-xs text-slate-400 mt-1">{messageCountLabel}</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>

                    <div className="max-h-72 overflow-auto px-4 py-3 space-y-2">
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`rounded-2xl px-3 py-2 text-xs ${
                                    message.role === "user"
                                        ? "ml-8 bg-slate-900 text-white"
                                        : "mr-8 bg-slate-100 text-slate-700"
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 px-4 py-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedPrompt}
                                onChange={(event) => setSelectedPrompt(event.target.value)}
                                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
                                disabled={disabled}
                            >
                                {QUICK_PROMPTS.map((prompt) => (
                                    <option key={prompt} value={prompt}>{prompt}</option>
                                ))}
                            </select>
                            <button
                                onClick={onAskPrompt}
                                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                disabled={disabled}
                            >
                                Ask
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder={disabled ? "Log in to use assistant" : "Ask anything about your analysis"}
                                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
                                disabled={disabled}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") onSend();
                                }}
                            />
                            <button
                                onClick={onSend}
                                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                disabled={disabled || !input.trim()}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-lg hover:bg-slate-800"
            >
                {isOpen ? "Hide chat" : "Open chat"}
            </button>
        </div>
    );
}
