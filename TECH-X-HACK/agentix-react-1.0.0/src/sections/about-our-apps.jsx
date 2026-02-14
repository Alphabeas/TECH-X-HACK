import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function AboutOurApps() {
    const sectionData = [
        {
            title: "Skill Extraction & Mapping",
            description: "Parse GitHub and resumes into a structured skill graph with proof points.",
            emoji: "🧭",
            className: "py-10 border-b border-slate-200 md:py-0 md:border-r md:border-b-0 md:px-10"
        },
        {
            title: "Market Alignment",
            description: "Map dream roles to real job requirements and quantify missing competencies.",
            emoji: "📈",
            className: "py-10 border-b border-slate-200 md:py-0 lg:border-r md:border-b-0 md:px-10"
        },
        {
            title: "Agentic Planning",
            description: "Generate adaptive 30-day roadmaps that evolve with progress and new signals.",
            emoji: "🧠",
            className: "py-10 border-b border-slate-200 md:py-0 md:border-b-0 md:px-10"
        },
    ];
    return (
        <section className="flex flex-col items-center" id="core-tasks">
            <SectionTitle title="Core tasks" description="The system is built to reason, adapt, and ship actions instead of static advice." />
            <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-0 mt-18">
                {sectionData.map((data, index) => (
                    <motion.div key={data.title} className={data.className}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <div className="size-10 flex items-center justify-center bg-emerald-100 border border-emerald-200 rounded">
                            <span className="text-lg" aria-hidden="true">{data.emoji}</span>
                        </div>
                        <div className="mt-5 space-y-2">
                            <h3 className="text-base font-medium text-slate-900">{data.title}</h3>
                            <p className="text-sm text-slate-600">{data.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}