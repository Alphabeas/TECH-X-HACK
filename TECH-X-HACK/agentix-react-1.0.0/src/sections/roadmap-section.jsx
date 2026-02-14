import { motion } from "framer-motion";
import SectionTitle from "../components/section-title";

const roadmap = [
    {
        week: "Week 1",
        focus: "Baseline + gap audit",
        outputs: "Skill graph, dream role profile, 3 proof gaps",
        checkpoint: "Run initial Vibe-Check review",
    },
    {
        week: "Week 2",
        focus: "Portfolio project sprint",
        outputs: "One shippable project + GitHub README",
        checkpoint: "Demo + commit history review",
    },
    {
        week: "Week 3",
        focus: "Role alignment",
        outputs: "Targeted skills + interview stories",
        checkpoint: "Mock role fit score update",
    },
    {
        week: "Week 4",
        focus: "Signal amplification",
        outputs: "Portfolio refresh + resume bullets",
        checkpoint: "Final Vibe-Check + next sprint",
    },
];

export default function RoadmapSection() {
    return (
        <section className="flex flex-col items-center" id="roadmap">
            <SectionTitle
                title="30-day roadmap"
                description="A concrete learning tree with weekly outputs, checkpoints, and adaptive reviews."
            />
            <div className="mt-12 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90">
                <div className="grid grid-cols-1 border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-[0.2em] text-slate-500 md:grid-cols-4">
                    {[
                        "Week",
                        "Focus",
                        "Outputs",
                        "Checkpoint",
                    ].map((title) => (
                        <div key={title} className="px-6 py-4">
                            {title}
                        </div>
                    ))}
                </div>
                {roadmap.map((row, index) => (
                    <motion.div
                        key={row.week}
                        className="grid grid-cols-1 border-b border-slate-200 text-sm text-slate-700 md:grid-cols-4"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.12, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                    >
                        <div className="px-6 py-4 font-display text-slate-900">{row.week}</div>
                        <div className="px-6 py-4">{row.focus}</div>
                        <div className="px-6 py-4">{row.outputs}</div>
                        <div className="px-6 py-4">{row.checkpoint}</div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sample roadmap</p>
                    <h3 className="font-display text-2xl text-slate-900 mt-3">Data Analyst · 6 hrs/week</h3>
                    <p className="text-sm text-slate-600 mt-3">Balanced for a full-time student with two project sprints.</p>
                    <div className="mt-6 space-y-3 text-sm text-slate-700">
                        <div className="flex items-center justify-between">
                            <span>Portfolio pieces</span>
                            <span className="font-semibold text-slate-900">2 shipped</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Interview stories</span>
                            <span className="font-semibold text-slate-900">4 drafted</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Skill gap delta</span>
                            <span className="font-semibold text-emerald-600">-18%</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Week 2 detail</p>
                        <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">In progress</span>
                    </div>
                    <h4 className="font-display text-xl mt-4">Customer churn dashboard</h4>
                    <ul className="mt-4 space-y-3 text-sm text-white/80">
                        <li>Build SQL query set for churn cohorting</li>
                        <li>Publish a Tableau dashboard with 3 insights</li>
                        <li>Write a 200-word case study for your portfolio</li>
                    </ul>
                    <div className="mt-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Checkpoint</p>
                        <p className="text-sm text-white mt-2">Peer review + role fit score update</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
