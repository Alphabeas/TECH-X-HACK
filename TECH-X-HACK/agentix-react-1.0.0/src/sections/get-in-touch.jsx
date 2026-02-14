import SectionTitle from "../components/section-title";
import { ArrowUpRight, SendIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function GetInTouch() {
    return (
        <section className="flex flex-col items-center" id="contact">
            <SectionTitle title="Request access" description="Tell the co-pilot your goal and get a personalized 30-day Vibe-Check plan." />
            <form onSubmit={(e) => e.preventDefault()} className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-3xl mx-auto text-slate-600 mt-16 w-full' >
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-slate-800'>Full name</label>
                    <input name='name' type="text" placeholder='Enter your name' className='w-full mt-2 p-3 outline-none border border-slate-200 rounded-lg focus-within:ring-1 transition focus:ring-emerald-500 bg-white/90' />
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-slate-800'>Email</label>
                    <input name='email' type="email" placeholder='Enter your email' className='w-full mt-2 p-3 outline-none border border-slate-200 rounded-lg focus-within:ring-1 transition focus:ring-emerald-500 bg-white/90' />
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-slate-800'>Dream role</label>
                    <input name='role' type="text" placeholder='e.g. Data Analyst at Spotify' className='w-full mt-2 p-3 outline-none border border-slate-200 rounded-lg focus-within:ring-1 transition focus:ring-emerald-500 bg-white/90' />
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-slate-800'>Time per week</label>
                    <input name='time' type="text" placeholder='e.g. 6-8 hours' className='w-full mt-2 p-3 outline-none border border-slate-200 rounded-lg focus-within:ring-1 transition focus:ring-emerald-500 bg-white/90' />
                </motion.div>

                <motion.div className='sm:col-span-2'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-slate-800'>What should the agent focus on?</label>
                    <textarea name='message' rows={6} placeholder='Projects, interview prep, or a specific skill gap.' className='resize-none w-full mt-2 p-3 outline-none rounded-lg focus-within:ring-1 transition focus:ring-emerald-500 border border-slate-200 bg-white/90' />
                </motion.div>

                <motion.button type='submit' className='w-max flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    Get my Vibe-Check
                    <ArrowUpRight className="size-4.5" />
                </motion.button>
            </form>
        </section>
    );
}