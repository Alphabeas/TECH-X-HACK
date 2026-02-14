import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../components/section-title";

export default function OurLatestCreation() {
    const [isHovered, setIsHovered] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [className, setClassName] = useState("");

    const sectionData = [
        {
            title: "Profile ingest",
            description: "Connect GitHub or a resume to extract signals, projects, and proof of work.",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&h=400&auto=format&fit=crop",
            align: "object-center",
        },
        {
            title: "Market scan",
            description: "Analyze target roles, map real job requirements, and surface missing competencies.",
            image: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=800&h=400&auto=format&fit=crop",
            align: "object-right",
        },
        {
            title: "Vibe-Check plan",
            description: "Generate a 30-day roadmap with projects, resources, and checkpoints that adapt weekly.",
            image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&h=400&auto=format&fit=crop",
            align: "object-center",
        },
    ];

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % sectionData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isHovered, sectionData.length]);

    return (
        <section className="flex flex-col items-center" id="workflow">
            <SectionTitle
                title="Agent workflow"
                description="A continuous loop that analyzes, plans, and adapts based on your progress and the market."
            />

            <div className="flex items-center gap-4 h-100 w-full max-w-5xl mt-18 mx-auto" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} >
                {sectionData.map((data, index) => (
                    <motion.div key={data.title} className={`relative group flex-grow h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-white ${isHovered && className ? "hover:w-full w-56" : index === activeIndex ? "w-full" : "w-56"} ${className} ${!className ? "pointer-events-none" : ""}`}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        onAnimationComplete={() => setClassName("transition-all duration-500")}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <img className={`h-full w-full object-cover ${data.align}`} src={data.image} alt={data.title} />
                        <div className={`absolute inset-0 flex flex-col justify-end p-10 text-slate-900 bg-gradient-to-t from-white/95 via-white/70 to-white/10 transition-all duration-300 ${isHovered && className ? "opacity-0 group-hover:opacity-100" : index === activeIndex ? "opacity-100" : "opacity-0"}`}>
                            <h1 className="font-display text-3xl font-semibold">{data.title}</h1>
                            <p className="text-sm mt-2 text-slate-600">{data.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
