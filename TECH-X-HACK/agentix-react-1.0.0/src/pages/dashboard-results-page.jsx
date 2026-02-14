import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUserLatestAnalysis } from "../services/profile";

export default function DashboardResultsPage() {
    const [displayName, setDisplayName] = useState("there");
    const [currentUid, setCurrentUid] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [saveStatus, setSaveStatus] = useState("");
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUid(user?.uid || "");
            if (user?.displayName) {
                setDisplayName(user.displayName.split(" ")[0]);
            } else if (user?.email) {
                setDisplayName(user.email.split("@")[0]);
            } else {
                setDisplayName("there");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUid) {
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
                setAnalysis(null);
            }
        } else {
            setAnalysis(null);
        }

        getUserLatestAnalysis(currentUid)
            .then((latest) => {
                if (latest) {
                    setAnalysis(latest);
                    localStorage.setItem(storageKey, JSON.stringify(latest));
                }
            })
            .catch(() => {});
    }, [currentUid]);

    useEffect(() => {
        const handleAnalysisUpdated = (event) => {
            const payload = event?.detail;
            const eventUid = payload?.uid;
            const eventAnalysis = payload?.analysis;
            if (!eventUid || !eventAnalysis) return;
            if (eventUid !== currentUid) return;
            setAnalysis(eventAnalysis);
        };

        window.addEventListener("analysis-updated", handleAnalysisUpdated);
        return () => window.removeEventListener("analysis-updated", handleAnalysisUpdated);
    }, [currentUid]);

    useEffect(() => {
        if (!auth.currentUser) return undefined;
        const tasksQuery = query(
            collection(db, "users", auth.currentUser.uid, "tasks"),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
            const nextTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTasks(nextTasks);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    const handleSaveProject = async (project) => {
        if (!auth.currentUser) return;
        setSaveStatus("");
        try {
            await addDoc(collection(db, "users", auth.currentUser.uid, "tasks"), {
                title: project,
                status: "todo",
                createdAt: serverTimestamp(),
            });
            setSaveStatus("Saved to tasks.");
        } catch (error) {
            setSaveStatus(error.message || "Failed to save task.");
        }
    };

    const roadmapItems = analysis?.roadmap || [];
    const skillChips = [
        ...(analysis?.user_skills?.technical || []),
        ...(analysis?.user_skills?.tools || []),
        ...(analysis?.user_skills?.soft || []),
    ];
    const gapChips = [
        ...(analysis?.missing_skills?.missing_technical || []),
        ...(analysis?.missing_skills?.missing_tools || []),
        ...(analysis?.missing_skills?.missing_soft || []),
    ];
    const projects = analysis?.projects || [];

    const resources = analysis?.resources || [];
    const checkpoints = analysis?.checkpoints || [];
    const warnings = analysis?.warnings || [];

    return (
        <main className="dashboard-page px-6 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 pb-24">
            <section className="flex flex-col items-center" id="dashboard-results">
                <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step 2 · Evaluations & metrics</p>
                            <h1 className="font-display text-3xl text-slate-900 mt-3">Your progress, {displayName}</h1>
                            <p className="text-sm text-slate-600 mt-2">Real metrics generated from your uploaded/imported profile data.</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link to="/dashboard" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                                    Back to upload
                                </Link>
                                <Link to="/dashboard/visualizations" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                    Open visualizations
                                </Link>
                                <Link to="/dashboard#settings" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                    Open settings
                                </Link>
                            </div>
                        </div>
                        {analysis && !analysis.error && (
                            <div className="flex flex-wrap gap-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                    Alignment score
                                    <span className="block font-display text-lg text-slate-900 mt-1">{analysis.alignment_score ?? 0}%</span>
                                </div>
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    Readiness
                                    <span className="block font-display text-lg text-emerald-800 mt-1">{analysis.readiness || "N/A"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {!analysis && (
                        <p className="mt-4 text-sm text-slate-500">No analysis found yet. Complete Step 1 on the dashboard upload page.</p>
                    )}
                    {analysis?.error && <p className="mt-4 text-sm text-rose-600">{analysis.error}</p>}
                </div>
            </section>

            {analysis && !analysis.error && (
                <section className="flex flex-col items-center">
                    <div className="mt-10 w-full max-w-5xl grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Skills detected</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {skillChips.length ? (
                                    skillChips.map((skill) => (
                                        <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-500">No skills detected yet.</span>
                                )}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Skill gaps</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {gapChips.length ? (
                                    gapChips.map((gap) => (
                                        <span key={gap} className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs text-amber-800">
                                            {gap}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-amber-700">No gaps found.</span>
                                )}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Next checkpoint</p>
                            <p className="font-display text-xl text-emerald-900 mt-3">
                                {roadmapItems[0]?.checkpoint || "Upload data to generate checkpoints"}
                            </p>
                            <p className="text-sm text-emerald-700 mt-2">Based on your current signals.</p>
                        </div>
                    </div>

                    {warnings.length > 0 && (
                        <div className="mt-6 w-full max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            {warnings.join(" ")}
                        </div>
                    )}

                    <div className="mt-6 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">30-day roadmap</p>
                        {roadmapItems.length ? (
                            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
                                <div className="space-y-3">
                                    {roadmapItems.map((item, index) => (
                                        <button
                                            key={item.week}
                                            onClick={() => setActiveStep(index)}
                                            className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                                                activeStep === index
                                                    ? "border-slate-900 bg-slate-900 text-white"
                                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"
                                            }`}
                                        >
                                            <span className={`mt-1 h-3 w-3 rounded-full ${activeStep === index ? "bg-emerald-300" : "bg-emerald-400"}`} />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] opacity-70">{item.week}</p>
                                                <p className="font-display text-base mt-2">{item.focus}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected step</p>
                                    <h3 className="font-display text-2xl text-slate-900 mt-3">{roadmapItems[activeStep]?.week}</h3>
                                    <p className="text-sm text-slate-600 mt-2">{roadmapItems[activeStep]?.focus}</p>
                                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tasks</p>
                                        <ul className="text-sm text-slate-700 mt-2 space-y-1">
                                            {(roadmapItems[activeStep]?.tasks || []).map((task) => (
                                                <li key={task} className="flex items-start gap-2">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                                                    <span>{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Checkpoint</p>
                                        <p className="text-sm text-slate-700 mt-2">{roadmapItems[activeStep]?.checkpoint}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">Run the analysis to generate your roadmap.</p>
                        )}
                    </div>

                    <div className="mt-6 w-full max-w-5xl grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Project ideas</p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {projects.length ? (
                                    projects.map((item) => (
                                        <li key={item} className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-2">
                                                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                                                <span>{item}</span>
                                            </div>
                                            <button
                                                onClick={() => handleSaveProject(item)}
                                                className="text-xs text-emerald-700 hover:text-emerald-900"
                                            >
                                                Save
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-500">Run analysis to get projects.</li>
                                )}
                            </ul>
                            {saveStatus && <p className="mt-3 text-xs text-slate-500">{saveStatus}</p>}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Resource picks</p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {resources.length ? (
                                    resources.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                                            {item.startsWith("http") ? (
                                                <a className="text-sky-700 hover:text-sky-900" href={item} target="_blank" rel="noreferrer">
                                                    {item}
                                                </a>
                                            ) : (
                                                <span>{item}</span>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-500">Run analysis to get resources.</li>
                                )}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Checkpoints</p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {checkpoints.length ? (
                                    checkpoints.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-500">Run analysis to get checkpoints.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            <section className="flex flex-col items-center" id="tasks">
                <div className="mt-10 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tasks</p>
                            <h2 className="font-display text-2xl text-slate-900 mt-2">Your saved action list</h2>
                            <p className="text-sm text-slate-600 mt-2">Tasks you saved from project ideas show up here.</p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                            {tasks.length} task{tasks.length === 1 ? "" : "s"}
                        </span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {tasks.length ? (
                            tasks.map((task) => (
                                <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                    <p className="text-sm text-slate-800">{task.title}</p>
                                    <p className="text-xs text-slate-500 mt-2">Status: {task.status || "todo"}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No saved tasks yet. Save a project idea to get started.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
