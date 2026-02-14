import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import IntegrationsSection from "../sections/integrations-section";

export default function DashboardPage() {
    const [displayName, setDisplayName] = useState("there");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.displayName) {
                setDisplayName(user.displayName.split(" ")[0]);
            } else if (user?.email) {
                setDisplayName(user.email.split("@")[0]);
            } else {
                setDisplayName("there");
            }
        });

        return () => unsubscribe();
    }, []);

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
        </main>
    );
}
