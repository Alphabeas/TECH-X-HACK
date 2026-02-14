import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
export default function SubscribeNewsletter() {
    return (
        <section className="flex flex-col items-center">
            <SectionTitle title="Weekly Vibe-Check" description="Short, practical prompts for career growth, shipped every Friday." />
            <motion.div className="flex items-center justify-center mt-10 border border-slate-200 focus-within:outline focus-within:outline-emerald-500 text-sm rounded-full h-14 max-w-xl w-full bg-white/90"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
                <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-slate-400" placeholder="Enter your email" />
                <button className="bg-slate-900 text-white rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition">
                    Join the list
                </button>
            </motion.div>
        </section>
    );
}