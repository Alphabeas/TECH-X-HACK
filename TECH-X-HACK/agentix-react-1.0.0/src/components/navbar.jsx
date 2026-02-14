import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ isAuthed, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isHomeRoute = pathname === "/";

    const navlinks = isDashboardRoute
        ? [
            { to: "/dashboard", text: "Upload" },
            { to: "/dashboard/results", text: "Evaluations" },
            { to: "/dashboard/visualizations", text: "Visualizations" },
            { to: "/dashboard/settings", text: "Settings" },
        ]
        : [
            ...(isAuthed ? [{ to: "/dashboard", text: "Dashboard" }] : []),
            { to: "/#home-about", hash: "#home-about", text: "About" },
            { to: "/#home-how", hash: "#home-how", text: "How it works" },
            { to: "/#home-interactive", hash: "#home-interactive", text: "Try it" },
        ];

    const showNavLinks = isDashboardRoute || isHomeRoute;

    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center w-full h-16 px-4 md:px-10 lg:px-14 xl:px-20 backdrop-blur bg-[#f7f4ef]/80 relative"
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

                {showNavLinks && (
                    <div className="hidden lg:flex items-center gap-5 text-[13px] text-slate-600 transition duration-500 absolute left-1/2 -translate-x-1/2">
                        {navlinks.map((link) => (
                            isHomeRoute
                                ? (
                                    <a key={link.to} href={link.hash || undefined} className="hover:text-slate-900 transition font-medium">
                                        {link.text}
                                    </a>
                                )
                                : (
                                    <Link key={link.to} to={link.to} className="hover:text-slate-900 transition font-medium">
                                        {link.text}
                                    </Link>
                                )
                        ))}
                    </div>
                )}

                <div className="hidden lg:flex items-center gap-2 ml-auto">
                    {isAuthed ? (
                        <>
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
                {showNavLinks && navlinks.map((link) => (
                    isHomeRoute
                        ? (
                            <a key={link.to} href={link.hash} onClick={() => setIsMenuOpen(false)} className="text-white">
                                {link.text}
                            </a>
                        )
                        : (
                            <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="text-white">
                                {link.text}
                            </Link>
                        )
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