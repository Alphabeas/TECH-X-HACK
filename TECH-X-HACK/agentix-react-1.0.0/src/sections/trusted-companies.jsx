import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function TrustedCompanies() {
    return (
        <section className="flex flex-col items-center" id="vibe-check">
            <SectionTitle title="30-day Vibe-Check" description="A personalized learning tree with weekly checkpoints, portfolio proof, and adaptive feedback loops." />
            <motion.div className="relative max-w-5xl py-20 md:py-26 mt-18 md:w-full overflow-hidden mx-2 md:mx-auto border border-slate-200 flex flex-col md:flex-row items-center justify-between bg-white/80 rounded-3xl p-4 md:p-10"
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-emerald-200 to-orange-200 blur-[180px]"></div>
                <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-sky-200 to-teal-200 blur-[180px]"></div>
                <div className="flex flex-col items-center md:items-start max-md:text-center">
                    <a href="#!" className="group flex items-center gap-2 rounded-full text-sm p-1 pr-3 text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <span className="bg-emerald-600 text-white text-xs px-3.5 py-1 rounded-full">
                            NEW
                        </span>
                        <p className="flex items-center gap-1">
                            <span>Launch your first 30-day sprint</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right group-hover:translate-x-0.5 transition duration-300"><path d="m9 18 6-6-6-6" /></svg>
                        </p>
                    </a>
                    <h1 className="font-display text-3xl font-medium max-w-xl mt-5 text-slate-900">Your learning tree, laid out by week.</h1>
                    <p className="text-base text-slate-600 max-w-lg mt-4">
                        Each week ships a project, a skill target, and a checkpoint. The agent re-plans after every review.
                    </p>
                    <button className="flex items-center gap-1 text-sm px-6 py-2.5 border border-slate-300 hover:bg-slate-100 active:scale-95 transition rounded-full mt-6">
                        See a sample roadmap
                        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.4243 5.42426C12.6586 5.18995 12.6586 4.81005 12.4243 4.57574L8.60589 0.757359C8.37157 0.523045 7.99167 0.523045 7.75736 0.757359C7.52304 0.991674 7.52304 1.37157 7.75736 1.60589L11.1515 5L7.75736 8.39411C7.52304 8.62843 7.52304 9.00833 7.75736 9.24264C7.99167 9.47696 8.37157 9.47696 8.60589 9.24264L12.4243 5.42426ZM0 5L0 5.6L12 5.6V5V4.4L0 4.4L0 5Z" fill="#0f172a" />
                        </svg>
                    </button>
                </div>
                <div className="md:-mr-16 max-md:mt-10">
                    <img className="max-w-xs md:max-w-sm rounded-2xl border border-slate-200 shadow-lg" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop" alt="roadmap preview" />
                </div>
            </motion.div>
        </section>
    );
}