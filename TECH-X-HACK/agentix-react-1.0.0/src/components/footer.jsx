import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 mt-40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                <div className="sm:col-span-2 lg:col-span-1">
                    <a href="#!" className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white text-sm font-semibold">AI</span>
                        <div className="leading-tight">
                            <p className="font-display text-base font-semibold text-slate-900">Career Co-Pilot</p>
                            <p className="text-[11px] text-slate-500">Personal Career Navigator</p>
                        </div>
                    </a>
                    <p className="text-sm/7 mt-6">An agentic career platform that turns profiles into adaptive plans, with weekly checkpoints and real portfolio proof.</p>
                </div>
                <div className="flex flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-slate-900">Platform</h2>
                        <a className="hover:text-slate-800 transition" href="#workflow">Workflow</a>
                        <a className="hover:text-slate-800 transition" href="#integrations">Integrations</a>
                        <a className="hover:text-slate-800 transition" href="#architecture">Architecture</a>
                        <a className="hover:text-slate-800 transition" href="#roadmap">Roadmap</a>
                        <a className="hover:text-slate-800 transition" href="#vibe-check">Vibe-Check</a>
                        <a className="hover:text-slate-800 transition" href="#contact">Request access</a>
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold text-slate-900 mb-5">Launch checklist</h2>
                    <div className="text-sm space-y-6 max-w-sm">
                        <p>Get the roadmap template and the 7-day validation checklist.</p>
                        <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-white border border-slate-200">
                            <input className="outline-none w-full max-w-64 py-2 rounded px-2 bg-transparent" type="email" placeholder="Enter your email" />
                            <button className="bg-slate-900 px-4 py-2 text-white rounded">Send me it</button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center border-t mt-6 border-slate-200">
                Copyright 2026 © Career Co-Pilot • Built for TECH-X-HACK
            </p>
        </motion.footer>
    );
};