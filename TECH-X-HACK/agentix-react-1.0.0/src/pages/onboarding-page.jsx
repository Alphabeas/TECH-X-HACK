import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { saveUserProfile } from "../services/profile";

const JOB_OPTIONS = [
    "Product Analyst",
    "Data Analyst",
    "Frontend Engineer",
    "Backend Engineer",
    "Full Stack Developer",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        dreamRole: "",
        experienceLevel: "",
        timePerWeek: "",
        learningStyle: "",
    });

    const withTimeout = (promise, ms) => (
        new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Save timed out.")), ms);
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            setError("Session expired. Please log in again.");
            return;
        }
        setIsSaving(true);
        setError("");
        try {
            await withTimeout(saveUserProfile(user.uid, {
                onboardingComplete: true,
                dreamRole: formData.dreamRole,
                experienceLevel: formData.experienceLevel,
                timePerWeek: formData.timePerWeek,
                learningStyle: formData.learningStyle,
            }), 3500);
            navigate("/dashboard");
        } catch (saveError) {
            setError(saveError?.message || "Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="px-6 md:px-16 lg:px-24 xl:px-32">
            <section className="flex flex-col items-center py-20">
                <motion.div
                    className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 40, mass: 1 }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Welcome setup</p>
                    <h1 className="font-display text-3xl text-slate-900 mt-3">Tell us about your goal</h1>
                    <p className="text-sm text-slate-600 mt-2">
                        Answer a few questions so we can build your first 30-day plan.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                        <label className="grid gap-2 text-sm text-slate-700">
                            Dream role
                            <select
                                name="dreamRole"
                                value={formData.dreamRole}
                                onChange={handleChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            >
                                <option value="">Select your target job</option>
                                {JOB_OPTIONS.map((job) => (
                                    <option key={job} value={job}>{job}</option>
                                ))}
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm text-slate-700">
                            Current experience level
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            >
                                <option value="">Select one</option>
                                <option value="student">Student</option>
                                <option value="career-switcher">Career switcher</option>
                                <option value="early-career">0-2 years experience</option>
                                <option value="mid-level">3-5 years experience</option>
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm text-slate-700">
                            Time per week
                            <input
                                name="timePerWeek"
                                value={formData.timePerWeek}
                                onChange={handleChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                type="text"
                                placeholder="e.g. 6-8 hours"
                                required
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-slate-700">
                            Learning style
                            <select
                                name="learningStyle"
                                value={formData.learningStyle}
                                onChange={handleChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            >
                                <option value="">Select one</option>
                                <option value="projects">Project-based</option>
                                <option value="courses">Courses + reading</option>
                                <option value="mixed">Mixed</option>
                            </select>
                        </label>
                        <button
                            type="submit"
                            className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Continue to dashboard"}
                        </button>
                    </form>
                    {error && (
                        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                            {error}
                        </p>
                    )}
                </motion.div>
            </section>
        </main>
    );
}
