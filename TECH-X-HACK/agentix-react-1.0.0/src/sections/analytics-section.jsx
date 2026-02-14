import { motion } from "framer-motion";
import SectionTitle from "../components/section-title";

const metrics = [
    { label: "Role fit score", value: "74%", trend: "+8%" },
    { label: "Skill gap delta", value: "-22%", trend: "4 gaps closed" },
    { label: "Momentum", value: "High", trend: "3 wins" },
];

const weekly = [
    { week: "W1", value: 40 },
    { week: "W2", value: 68 },
    { week: "W3", value: 52 },
    { week: "W4", value: 82 },
];

export default function AnalyticsSection() {
    return (
        <section className="flex flex-col items-center" id="analytics">
            <SectionTitle
                title="Progress analytics"
                description="Track your role fit, momentum, and evidence strength as the agent adapts each week."
            />
            <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Key metrics</p>
                    <div className="mt-6 grid gap-4">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                                <div>
                                    <p className="text-sm text-slate-600">{metric.label}</p>
                                    <p className="font-display text-xl text-slate-900 mt-1">{metric.value}</p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                                    {metric.trend}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Weekly effort</p>
                    <h3 className="font-display text-2xl mt-3">Momentum over 30 days</h3>
                    <div className="mt-6 flex items-end gap-3">
                        {weekly.map((item) => (
                            <div key={item.week} className="flex flex-col items-center gap-2">
                                <div className="w-10 rounded-full bg-emerald-400/80" style={{ height: `${item.value}%` }} />
                                <span className="text-xs text-white/80">{item.week}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-white/80">
                        The planner reweights tasks when momentum dips, so the roadmap stays realistic.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
