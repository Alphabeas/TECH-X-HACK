import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserLatestAnalysis } from "../services/profile";

function StatCard({ label, value, tone = "slate" }) {
    const toneClass = {
        slate: "border-slate-200 bg-white text-slate-900",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
        amber: "border-amber-200 bg-amber-50 text-amber-900",
    }[tone];

    return (
        <div className={`rounded-2xl border px-4 py-4 ${toneClass}`}>
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">{label}</p>
            <p className="font-display text-2xl mt-2">{value}</p>
        </div>
    );
}

function BarRow({ label, value, max }) {
    const safeMax = Math.max(max || 1, 1);
    const width = Math.min(100, Math.round((value / safeMax) * 100));

    return (
        <div>
            <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-slate-900" style={{ width: `${width}%` }} />
            </div>
        </div>
    );
}

function DonutRing({ label, value, total, tone = "slate" }) {
    const safeTotal = Math.max(total || 1, 1);
    const safeValue = Math.max(0, Math.min(value || 0, safeTotal));
    const percent = Math.round((safeValue / safeTotal) * 100);
    const degree = Math.round((safeValue / safeTotal) * 360);

    const ringTone = {
        slate: "#0f172a",
        emerald: "#059669",
        amber: "#d97706",
    }[tone] || "#0f172a";

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <div className="mt-5 flex items-center justify-center">
                <div
                    className="relative h-28 w-28 rounded-full"
                    style={{ background: `conic-gradient(${ringTone} ${degree}deg, #e2e8f0 ${degree}deg)` }}
                >
                    <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                        <span className="font-display text-lg text-slate-900">{percent}%</span>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-600">{safeValue} of {safeTotal}</p>
        </div>
    );
}

export default function DashboardVisualizationPage() {
    const [currentUid, setCurrentUid] = useState("");
    const [displayName, setDisplayName] = useState("there");
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const uid = user?.uid || "";
            setCurrentUid(uid);
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
            if (!payload?.uid || payload.uid !== currentUid) return;
            setAnalysis(payload.analysis || null);
        };

        window.addEventListener("analysis-updated", handleAnalysisUpdated);
        return () => window.removeEventListener("analysis-updated", handleAnalysisUpdated);
    }, [currentUid]);

    const skillBreakdown = useMemo(() => {
        const technical = (analysis?.user_skills?.technical || []).length;
        const tools = (analysis?.user_skills?.tools || []).length;
        const soft = (analysis?.user_skills?.soft || []).length;
        return [
            { label: "Technical", value: technical },
            { label: "Tools", value: tools },
            { label: "Soft", value: soft },
        ];
    }, [analysis]);

    const gapBreakdown = useMemo(() => {
        const technical = (analysis?.missing_skills?.missing_technical || []).length;
        const tools = (analysis?.missing_skills?.missing_tools || []).length;
        const soft = (analysis?.missing_skills?.missing_soft || []).length;
        return [
            { label: "Technical gaps", value: technical },
            { label: "Tool gaps", value: tools },
            { label: "Soft-skill gaps", value: soft },
        ];
    }, [analysis]);

    const roadmapBreakdown = useMemo(() => {
        return (analysis?.roadmap || []).map((week) => ({
            label: week.week || "Week",
            value: (week.tasks || []).length,
            checkpoint: week.checkpoint || "",
        }));
    }, [analysis]);

    const totals = useMemo(() => {
        const totalSkills = skillBreakdown.reduce((sum, item) => sum + item.value, 0);
        const totalGaps = gapBreakdown.reduce((sum, item) => sum + item.value, 0);
        const generatedWeeks = roadmapBreakdown.length;

        return {
            totalSkills,
            totalGaps,
            generatedWeeks,
            totalSignals: totalSkills + totalGaps,
        };
    }, [skillBreakdown, gapBreakdown, roadmapBreakdown]);

    const coverageBreakdown = useMemo(() => {
        const technicalHave = (analysis?.user_skills?.technical || []).length;
        const technicalGap = (analysis?.missing_skills?.missing_technical || []).length;
        const toolsHave = (analysis?.user_skills?.tools || []).length;
        const toolsGap = (analysis?.missing_skills?.missing_tools || []).length;
        const softHave = (analysis?.user_skills?.soft || []).length;
        const softGap = (analysis?.missing_skills?.missing_soft || []).length;

        return [
            { label: "Technical", have: technicalHave, gap: technicalGap },
            { label: "Tools", have: toolsHave, gap: toolsGap },
            { label: "Soft", have: softHave, gap: softGap },
        ];
    }, [analysis]);

    const topMissingSkills = useMemo(() => {
        const allMissing = [
            ...(analysis?.missing_skills?.missing_technical || []),
            ...(analysis?.missing_skills?.missing_tools || []),
            ...(analysis?.missing_skills?.missing_soft || []),
        ];

        const frequency = allMissing.reduce((acc, skill) => {
            const key = String(skill || "").trim();
            if (!key) return acc;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(frequency)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
            .slice(0, 10);
    }, [analysis]);

    const resourceMix = useMemo(() => {
        const resources = analysis?.resources || [];
        const buckets = {
            docs: 0,
            video: 0,
            course: 0,
            other: 0,
        };

        resources.forEach((item) => {
            const value = String(item || "").toLowerCase();
            if (value.includes("youtube") || value.includes("video")) {
                buckets.video += 1;
                return;
            }
            if (value.includes("course") || value.includes("udemy") || value.includes("coursera") || value.includes("edx")) {
                buckets.course += 1;
                return;
            }
            if (value.startsWith("http") || value.includes("docs") || value.includes("guide") || value.includes("read")) {
                buckets.docs += 1;
                return;
            }
            buckets.other += 1;
        });

        return [
            { label: "Docs/Guides", value: buckets.docs },
            { label: "Video", value: buckets.video },
            { label: "Courses", value: buckets.course },
            { label: "Other", value: buckets.other },
        ];
    }, [analysis]);

    const maxSkill = Math.max(...skillBreakdown.map((item) => item.value), 1);
    const maxGap = Math.max(...gapBreakdown.map((item) => item.value), 1);
    const maxRoadmap = Math.max(...roadmapBreakdown.map((item) => item.value), 1);

    return (
        <main className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 pb-24">
            <section className="flex flex-col items-center" id="visualizations">
                <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Visualizations</p>
                            <h1 className="font-display text-3xl text-slate-900 mt-2">Data view for {displayName}</h1>
                            <p className="text-sm text-slate-600 mt-2">Charts generated from your latest analysis data.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link to="/dashboard" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Upload</Link>
                            <Link to="/dashboard/results" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">Evaluations</Link>
                        </div>
                    </div>
                </div>
            </section>

            {!analysis && (
                <section className="flex flex-col items-center mt-8">
                    <div className="w-full max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        No analysis available yet. Upload your resume or import GitHub data first.
                    </div>
                </section>
            )}

            {analysis && (
                <>
                    <section className="flex flex-col items-center mt-8">
                        <div className="w-full max-w-5xl grid grid-cols-1 gap-4 md:grid-cols-4">
                            <StatCard label="Alignment" value={`${analysis.alignment_score ?? 0}%`} tone="slate" />
                            <StatCard label="Readiness" value={analysis.readiness || "N/A"} tone="emerald" />
                            <StatCard label="Resources" value={(analysis.resources || []).length} tone="slate" />
                            <StatCard label="Projects" value={(analysis.projects || []).length} tone="amber" />
                        </div>
                    </section>

                    <section className="flex flex-col items-center mt-6">
                        <div className="w-full max-w-5xl grid grid-cols-1 gap-6 md:grid-cols-3">
                            <DonutRing
                                label="Role readiness"
                                value={Number(analysis.alignment_score || 0)}
                                total={100}
                                tone="emerald"
                            />
                            <DonutRing
                                label="Skill coverage"
                                value={totals.totalSkills}
                                total={Math.max(totals.totalSignals, 1)}
                                tone="slate"
                            />
                            <DonutRing
                                label="Roadmap generated"
                                value={totals.generatedWeeks}
                                total={4}
                                tone="amber"
                            />
                        </div>
                    </section>

                    <section className="flex flex-col items-center mt-6">
                        <div className="w-full max-w-5xl grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Detected skills</p>
                                <div className="mt-5 space-y-4">
                                    {skillBreakdown.map((item) => (
                                        <BarRow key={item.label} label={item.label} value={item.value} max={maxSkill} />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gap breakdown</p>
                                <div className="mt-5 space-y-4">
                                    {gapBreakdown.map((item) => (
                                        <BarRow key={item.label} label={item.label} value={item.value} max={maxGap} />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Roadmap workload</p>
                                <div className="mt-5 space-y-4">
                                    {roadmapBreakdown.length ? roadmapBreakdown.map((item) => (
                                        <BarRow key={item.label} label={item.label} value={item.value} max={maxRoadmap} />
                                    )) : (
                                        <p className="text-sm text-slate-500">No roadmap data found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col items-center mt-6">
                        <div className="w-full max-w-5xl grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Skills vs gaps by category</p>
                                <div className="mt-5 space-y-5">
                                    {coverageBreakdown.map((row) => {
                                        const total = Math.max(row.have + row.gap, 1);
                                        const havePercent = Math.round((row.have / total) * 100);
                                        const gapPercent = 100 - havePercent;

                                        return (
                                            <div key={row.label}>
                                                <div className="flex items-center justify-between text-xs text-slate-600">
                                                    <span>{row.label}</span>
                                                    <span>{row.have} have · {row.gap} gaps</span>
                                                </div>
                                                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 flex">
                                                    <div className="h-2 bg-emerald-500" style={{ width: `${havePercent}%` }} />
                                                    <div className="h-2 bg-amber-500" style={{ width: `${gapPercent}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Top missing skills</p>
                                <div className="mt-5 space-y-4">
                                    {topMissingSkills.length ? topMissingSkills.map((item) => (
                                        <BarRow key={item.label} label={item.label} value={item.value} max={Math.max(...topMissingSkills.map((entry) => entry.value), 1)} />
                                    )) : (
                                        <p className="text-sm text-slate-500">No missing-skill data found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col items-center mt-6">
                        <div className="w-full max-w-5xl grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Resource mix</p>
                                <div className="mt-5 space-y-4">
                                    {resourceMix.map((item) => (
                                        <BarRow key={item.label} label={item.label} value={item.value} max={Math.max(...resourceMix.map((entry) => entry.value), 1)} />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Weekly timeline</p>
                                <div className="mt-5 space-y-4">
                                    {roadmapBreakdown.length ? roadmapBreakdown.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="flex items-center justify-between text-xs text-slate-600">
                                                <span className="font-semibold text-slate-800">{item.label}</span>
                                                <span>{item.value} tasks</span>
                                            </div>
                                            {item.checkpoint && <p className="mt-2 text-xs text-slate-500">Checkpoint: {item.checkpoint}</p>}
                                        </div>
                                    )) : (
                                        <p className="text-sm text-slate-500">No roadmap timeline found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
