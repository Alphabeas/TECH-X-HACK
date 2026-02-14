import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TiltedImage from "../components/tilt-image";

export default function HeroSection() {
    return (
        <section className="flex flex-col items-center -mt-18">
            <motion.svg className="absolute -z-10 w-full -mt-40 md:mt-0" width="1440" height="676" viewBox="0 0 1440 676" fill="none" xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5}}
            >
                <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#a)" />
                <defs>
                    <radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
                        <stop offset=".6" stopColor="#22c55e" stopOpacity="0" />
                        <stop offset="1" stopColor="#f97316" stopOpacity="0.45" />
                    </radialGradient>
                </defs>
            </motion.svg>
            <motion.a className="flex items-center mt-48 gap-2 border border-slate-300 text-slate-700 rounded-full px-4 py-2 bg-white/80 shadow-sm"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="size-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm">Live demo slots open this week</span>
            </motion.a>
            <motion.h1 className="font-display text-center text-5xl leading-[60px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                The Personal Career Navigator that plans, reasons, and ships actions
            </motion.h1>
            <motion.p className="text-center text-base max-w-2xl mt-3 text-slate-600"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                A career co-pilot that continuously audits your profile, tracks market demand, and generates a 30-day Vibe-Check roadmap with projects, resources, and checkpoints.
            </motion.p>
            <motion.div className="flex items-center gap-4 mt-8"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <Link className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 transition text-white active:scale-95 rounded-lg px-7 h-11" to="/signup">
                    Generate my roadmap
                    <ArrowRight className="size-5" />
                </Link>
                <Link className="border border-slate-300 active:scale-95 hover:bg-white/70 transition rounded-lg px-8 h-11 text-slate-700" to="/login">
                    See how it works
                </Link>
            </motion.div>
            <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                {[
                    { label: "Profiles analyzed", value: "12k+" },
                    { label: "Skill gaps mapped", value: "480k" },
                    { label: "Roadmaps shipped", value: "30-day" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                        <p className="font-display text-2xl font-semibold mt-2 text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </motion.div>
            <motion.div className="mt-10 flex items-center gap-2 text-xs text-slate-500"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                <Sparkles className="size-4 text-emerald-500" />
                <span>Not a chatbot. A planning system that adapts as you grow.</span>
            </motion.div>
            <TiltedImage />
        </section>
    );
}