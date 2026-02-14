import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar({ isAuthed, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navlinks = [
        { href: "#workflow", text: "Workflow" },
        { href: "#integrations", text: "Integrations" },
        { href: "#analytics", text: "Analytics" },
        { href: "#roadmap", text: "Roadmap" },
    ];
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 md:px-10 lg:px-14 xl:px-20 backdrop-blur bg-[#f7f4ef]/80"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to="/" className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white text-sm font-semibold">AI</span>
                    <div className="leading-tight">
                        <p className="font-display text-base font-semibold">Career Co-Pilot</p>
                        <p className="text-[11px] text-slate-500">Personal Career Navigator</p>
                    </div>
                </Link>

                {isAuthed && (
                    <div className="hidden lg:flex items-center gap-4 text-[13px] text-slate-600 transition duration-500">
                        {navlinks.map((link) => (
                            <a key={link.href} href={link.href} className="hover:text-slate-900 transition">
                                {link.text}
                            </a>
                        ))}
                    </div>
                )}

                <div className="hidden lg:flex items-center gap-2">
                    {isAuthed ? (
                        <>
                            <Link className="px-4 py-2 bg-slate-900 hover:bg-slate-800 transition text-white rounded-md active:scale-95 text-xs" to="/dashboard">
                                Dashboard
                            </Link>
                            <button onClick={onLogout} className="hover:bg-slate-200 transition px-4 py-2 border border-slate-300 rounded-md active:scale-95 text-xs">
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="px-4 py-2 bg-slate-900 hover:bg-slate-800 transition text-white rounded-md active:scale-95 text-xs" to="/login">
                                Log in
                            </Link>
                            <Link className="hover:bg-slate-200 transition px-4 py-2 border border-slate-300 rounded-md active:scale-95 text-xs" to="/signup">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>
            <div className={`fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {isAuthed && navlinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-white">
                        {link.text}
                    </a>
                ))}
                {!isAuthed && (
                    <>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white">
                            Log in
                        </Link>
                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-white">
                            Sign up
                        </Link>
                    </>
                )}
                {isAuthed && (
                    <button onClick={() => { setIsMenuOpen(false); onLogout(); }} className="text-white">
                        Log out
                    </button>
                )}
                <button onClick={() => setIsMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-white hover:bg-slate-200 transition text-black rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}