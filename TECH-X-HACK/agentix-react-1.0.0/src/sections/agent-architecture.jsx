import { motion } from "framer-motion";
import SectionTitle from "../components/section-title";

const architectureNodes = [
    {
        title: "Signal intake",
        description: "GitHub, resumes, and goal inputs.",
        tag: "Inputs",
    },
    {
        title: "Skill graph",
        description: "Normalize skills, projects, and evidence.",
        tag: "Extraction",
    },
    {
        title: "Role matcher",
        description: "Align against dream role requirements.",
        tag: "Market",
    },
    {
        title: "Planner agent",
        description: "Generate roadmap, checkpoints, and actions.",
        tag: "Planning",
    },
    {
        title: "Progress evaluator",
        description: "Weekly review + adaptive re-plans.",
        tag: "Adapt",
    },
];

export default function AgentArchitecture() {
    return (
        <section className="flex flex-col items-center" id="architecture">
            <SectionTitle
                title="Agent architecture"
                description="A multi-step workflow that reasons, plans, and adapts with every signal."
            />
            <div className="relative mt-16 w-full max-w-5xl">
                <div className="absolute left-6 top-8 h-[calc(100%-3rem)] w-px bg-slate-200 md:left-1/2 md:top-1/2 md:h-px md:w-[calc(100%-3rem)]" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                    {architectureNodes.map((node, index) => (
                        <motion.div
                            key={node.title}
                            className="relative rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm"
                            initial={{ y: 120, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                        >
                            <span className="text-xs uppercase tracking-[0.25em] text-emerald-600">{node.tag}</span>
                            <h3 className="font-display text-lg text-slate-900 mt-2">{node.title}</h3>
                            <p className="text-sm text-slate-600 mt-2">{node.description}</p>
                            <span className="absolute -left-3 top-6 h-3 w-3 rounded-full border border-slate-300 bg-white md:left-1/2 md:top-auto md:-bottom-3" />
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Reasoning loop</p>
                    <h3 className="font-display text-2xl text-slate-900 mt-3">Think → Plan → Act → Evaluate</h3>
                    <p className="text-sm text-slate-600 mt-3">
                        The planner agent runs weekly check-ins, re-scores gaps, and re-orders tasks based on progress.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {[
                            "Gap score",
                            "Role fit",
                            "Momentum",
                            "Portfolio impact",
                        ].map((chip) => (
                            <span key={chip} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                                {chip}
                            </span>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    className="relative flex items-center justify-center rounded-3xl border border-slate-200 bg-white/80 p-8"
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <div className="relative h-56 w-56 rounded-full border border-dashed border-slate-300">
                        <motion.div
                            className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-emerald-500 shadow"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                            style={{ transformOrigin: "50% 116px" }}
                        />
                        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-slate-50" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Loop</p>
                            <p className="font-display text-lg text-slate-900">Adaptive</p>
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-6 rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
                        7-day refresh
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
