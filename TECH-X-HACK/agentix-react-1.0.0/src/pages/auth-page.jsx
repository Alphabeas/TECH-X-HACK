import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { getUserProfile } from "../services/profile";

export default function AuthPage({ mode = "login", onAuth }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const isLogin = mode === "login";

    const withTimeout = (promise, ms) => (
        new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Profile check timed out.")), ms);
            promise
                .then((value) => {
                    clearTimeout(timer);
                    resolve(value);
                })
                .catch((err) => {
                    clearTimeout(timer);
                    reject(err);
                });
        })
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            let user = null;
            if (isLogin) {
                const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                user = result.user;
            } else {
                const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                user = result.user;
                if (formData.name) {
                    await updateProfile(result.user, { displayName: formData.name });
                }
            }
            onAuth();
            let profile = null;
            try {
                profile = await withTimeout(getUserProfile(user.uid), 3500);
            } catch (profileError) {
                profile = null;
            }
            if (!profile?.onboardingComplete) {
                navigate("/onboarding");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            const message = err?.message || "Authentication failed. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProviderLogin = async (provider) => {
        setError("");
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            onAuth();
            let profile = null;
            try {
                profile = await withTimeout(getUserProfile(result.user.uid), 3500);
            } catch (profileError) {
                profile = null;
            }
            if (!profile?.onboardingComplete) {
                navigate("/onboarding");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            const message = err?.message || "Authentication failed. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <main className="px-6 md:px-16 lg:px-24 xl:px-32">
            <section className="flex flex-col items-center py-24">
                <motion.div
                    className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 40, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {isLogin ? "Welcome back" : "Start here"}
                    </p>
                    <h1 className="font-display text-3xl text-slate-900 mt-3">
                        {isLogin ? "Log in" : "Create your account"}
                    </h1>
                    <p className="text-sm text-slate-600 mt-2">
                        {isLogin
                            ? "Pick up where your Vibe-Check left off."
                            : "Create your account to start onboarding and build your first roadmap."}
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                        {!isLogin && (
                            <label className="grid gap-2 text-sm text-slate-700">
                                Full name
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                    type="text"
                                    placeholder="Your name"
                                    required
                                />
                            </label>
                        )}
                        <label className="grid gap-2 text-sm text-slate-700">
                            Email address
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                type="email"
                                placeholder="you@email.com"
                                required
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-slate-700">
                            Password
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                type="password"
                                placeholder="Minimum 8 characters"
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            disabled={isLoading}
                        >
                            {isLoading ? "Preparing your dashboard..." : isLogin ? "Log in" : "Create account"}
                        </button>
                    </form>
                    {error && (
                        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                            {error}
                        </p>
                    )}
                    <div className="mt-6 grid gap-3">
                        <button
                            type="button"
                            onClick={() => handleProviderLogin(googleProvider)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                            disabled={isLoading}
                        >
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleProviderLogin(githubProvider)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                            disabled={isLoading}
                        >
                            Continue with GitHub
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(isLogin ? "/signup" : "/login")}
                        className="mt-4 w-full text-center text-sm text-slate-600 hover:text-slate-900"
                    >
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </motion.div>
            </section>
        </main>
    );
}
