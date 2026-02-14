import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import IntegrationsSection from "../sections/integrations-section";
import { getUserProfile, saveUserProfile } from "../services/profile";
import { JOB_OPTIONS } from "../constants/job-options";

export default function DashboardPage() {
    const [displayName, setDisplayName] = useState("there");
    const [currentUid, setCurrentUid] = useState("");
    const [settingsStatus, setSettingsStatus] = useState("");
    const [settings, setSettings] = useState({
        fullName: "",
        email: "",
        dreamRole: "",
        location: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const uid = user?.uid || "";
            setCurrentUid(uid);

            if (user?.displayName) {
                setDisplayName(user.displayName.split(" ")[0]);
            } else if (user?.email) {
                setDisplayName(user.email.split("@")[0]);
            } else {
                setDisplayName("there");
            }

            if (!uid) {
                setSettings({ fullName: "", email: "", dreamRole: "", location: "" });
                return;
            }

            try {
                const profile = await getUserProfile(uid);
                const profileRole = profile?.dreamRole || "";
                const normalizedRole = JOB_OPTIONS.includes(profileRole) ? profileRole : "";
                setSettings({
                    fullName: user?.displayName || profile?.fullName || "",
                    email: user?.email || "",
                    dreamRole: normalizedRole,
                    location: profile?.location || "",
                });
            } catch {
                setSettings({
                    fullName: user?.displayName || "",
                    email: user?.email || "",
                    dreamRole: "",
                    location: "",
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const updateField = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveSettings = async () => {
        if (!currentUid) {
            setSettingsStatus("Please log in again.");
            return;
        }

        if (!JOB_OPTIONS.includes(settings.dreamRole)) {
            setSettingsStatus("Please select a role from the predefined list.");
            return;
        }

        setSettingsStatus("Saving...");
        try {
            await saveUserProfile(currentUid, {
                fullName: settings.fullName?.trim() || "",
                dreamRole: settings.dreamRole?.trim() || "",
                location: settings.location?.trim() || "",
            });

            if (auth.currentUser && settings.fullName?.trim()) {
                await updateProfile(auth.currentUser, { displayName: settings.fullName.trim() });
                setDisplayName(settings.fullName.trim().split(" ")[0]);
            }

            setSettingsStatus("Profile saved.");
        } catch (error) {
            setSettingsStatus(error.message || "Failed to save profile.");
        }
    };

    return (
        <main className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 pb-24">
            <section className="flex flex-col items-center" id="dashboard">
                <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step 1 · Upload your data</p>
                            <h1 className="font-display text-3xl text-slate-900 mt-3">Welcome, {displayName}</h1>
                            <p className="text-sm text-slate-600 mt-2 max-w-lg">
                                Add your GitHub username and/or upload your resume. Once analysis completes, you’ll
                                automatically move to your evaluations page.
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/dashboard/results"
                                    className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                >
                                    Open evaluations
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 max-w-xs">
                            After upload/import, we auto-open Step 2: Evaluations & Metrics.
                        </div>
                    </div>
                </div>
            </section>

            <div className="mt-12">
                <IntegrationsSection />
            </div>

            <section className="flex flex-col items-center mt-12" id="settings">
                <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Settings</p>
                    <h2 className="font-display text-2xl text-slate-900 mt-3">Basic profile info</h2>
                    <p className="text-sm text-slate-600 mt-2">Update your display details used across your dashboard.</p>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">Full name</span>
                            <input
                                value={settings.fullName}
                                onChange={(event) => updateField("fullName", event.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="Your full name"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">Email</span>
                            <input
                                value={settings.email}
                                readOnly
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">Dream role</span>
                            <select
                                value={settings.dreamRole}
                                onChange={(event) => updateField("dreamRole", event.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            >
                                <option value="">Select your target role</option>
                                {JOB_OPTIONS.map((job) => (
                                    <option key={job} value={job}>{job}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">Location</span>
                            <input
                                value={settings.location}
                                onChange={(event) => updateField("location", event.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="City, Country"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            onClick={handleSaveSettings}
                            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                            Save settings
                        </button>
                        {settingsStatus && <span className="text-xs text-slate-600">{settingsStatus}</span>}
                    </div>
                </div>
            </section>
        </main>
    );
}
