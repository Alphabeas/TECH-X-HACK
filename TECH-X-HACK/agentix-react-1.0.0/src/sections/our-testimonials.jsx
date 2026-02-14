import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function OurTestimonials() {
    const testimonials = [
        { quote: "Went from confused to a shipped roadmap in one session. The plan matched my schedule and current level.", name: "Jada Simmons", role: "CS Student", image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop", },
        { quote: "The gap analysis made my dream role actionable. It prioritized what actually mattered for interviews.", name: "Arjun Mehta", role: "Bootcamp Grad", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop", },
        { quote: "Weekly recalibration is the magic. It adapts as I finish projects instead of giving static advice.", name: "Maria Lopez", role: "Career Switcher", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop", },
        { quote: "The roadmap was clear, but the checkpoints kept me accountable. I shipped two portfolio pieces in 30 days.", name: "Kai Reynolds", role: "Design Student", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", },
        { quote: "Loved how it pulled from my GitHub. It understood what I already knew and skipped the fluff.", name: "Sana Idris", role: "Frontend Developer", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop", },
        { quote: "Feels like a planner, not a chatbot. It tells me what to do next and why it matters.", name: "Elliot Park", role: "Data Intern", image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop", },
    ];

    return (
        <section className="flex flex-col items-center" id="outcomes">
            <SectionTitle title="Real outcomes" description="Students use the co-pilot to turn vague goals into shipped projects and interview-ready proof." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <motion.div key={testimonial.name} className="group border border-slate-200 bg-white/80 p-6 rounded-2xl shadow-sm"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="text-slate-700 text-base">{testimonial.quote}</p>
                        <div className="flex items-center gap-3 mt-8 group-hover:-translate-y-1 duration-300">
                            <img className="size-10 rounded-full" src={testimonial.image} alt="user image" />
                            <div>
                                <h2 className="text-slate-900 font-medium">
                                    {testimonial.name}
                                </h2>
                                <p className="text-emerald-600">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}