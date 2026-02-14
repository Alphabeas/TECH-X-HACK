import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "../sections/hero-section";
import SectionTitle from "../components/section-title";

export default function HomePage() {
    const roles = [
        {
            label: "Product Analyst",
            focus: "SQL + metrics storytelling",
            gap: "Analytics case study",
        },
        {
            label: "Frontend Engineer",
            focus: "React + UI systems",
            gap: "Production-grade project",
        },
        {
            label: "Data Scientist",
            focus: "Python + modeling",
            gap: "End-to-end notebook",
        },
    ];
    const [activeRole, setActiveRole] = useState(roles[0]);
    const [hours, setHours] = useState(6);

    const weeklyPlan = useMemo(() => {
        if (hours <= 4) {
            return ["One micro-project", "Two skill drills", "One checkpoint review"];
        }
        if (hours <= 8) {
            return ["One portfolio sprint", "Two targeted skills", "One mock review"];
        }
        return ["Two project sprints", "Three targeted skills", "Role-fit deep dive"];
    }, [hours]);

    return (
        <main className="px-6 md:px-16 lg:px-24 xl:px-32">
            <HeroSection />
            <section className="flex flex-col items-center" id="home-about">
                <SectionTitle
                    title="What this is"
                    description="A personal career navigator that turns your profile into an adaptive 30-day plan with proof, projects, and checkpoints."
                />
                <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        {
                            title: "Evidence-first",
                            copy: "Starts from GitHub or a resume so it understands what you can already do.",
                        },
                        {
                            title: "Goal-aware",
                            copy: "Maps your dream role to real job requirements and tracks the gap as you improve.",
                        },
                        {
                            title: "Actionable",
                            copy: "Delivers weekly tasks, projects, and checkpoints so you always know the next move.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                        >
                            <h3 className="font-display text-xl text-slate-900">{item.title}</h3>
                            <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col items-center" id="home-how">
                <SectionTitle
                    title="How it works"
                    description="Three steps from profile to plan. No generic roadmaps, no fluff."
                />
                <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        {
                            step: "01",
                            title: "Connect",
                            copy: "Bring in GitHub and your resume to build the skill graph.",
                        },
                        {
                            step: "02",
                            title: "Align",
                            copy: "Pick a dream role. The agent maps real job requirements to your gaps.",
                        },
                        {
                            step: "03",
                            title: "Ship",
                            copy: "Get a weekly plan with checkpoints, then adapt based on progress.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                        >
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">{item.step}</p>
                            <h3 className="font-display text-xl text-slate-900 mt-3">{item.title}</h3>
                            <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col items-center" id="home-interactive">
                <SectionTitle
                    title="Try the co-pilot"
                    description="Pick a role and time budget to preview your weekly plan."
                />
                <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
                    <motion.div
                        className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                    >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Choose a role</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <button
                                    key={role.label}
                                    onClick={() => setActiveRole(role)}
                                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                        activeRole.label === role.label
                                            ? "border-slate-900 bg-slate-900 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                                    }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Time per week</p>
                            <div className="mt-4 flex items-center gap-4">
                                <input
                                    type="range"
                                    min="2"
                                    max="12"
                                    value={hours}
                                    onChange={(event) => setHours(Number(event.target.value))}
                                    className="w-full accent-emerald-500"
                                />
                                <span className="text-sm text-slate-700">{hours} hrs</span>
                            </div>
                        </div>
                        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Focus</p>
                            <p className="font-display text-lg text-slate-900 mt-2">{activeRole.focus}</p>
                            <p className="text-sm text-slate-600 mt-2">Gap to close: {activeRole.gap}</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 60, mass: 1 }}
                    >
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Weekly output</p>
                        <h3 className="font-display text-2xl mt-3">Your next 7 days</h3>
                        <ul className="mt-6 space-y-3 text-sm text-white/80">
                            {weeklyPlan.map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/signup"
                                className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-slate-900"
                            >
                                Build my roadmap
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white"
                            >
                                I already have an account
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
