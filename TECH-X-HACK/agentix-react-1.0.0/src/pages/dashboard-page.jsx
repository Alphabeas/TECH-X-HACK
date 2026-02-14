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
        <main className="dashboard-upload-page">
            <section className="dashboard-upload-top" id="dashboard">
                <h1 className="dashboard-upload-title">Welcome, {displayName}</h1>
            </section>

            <div className="dashboard-upload-content">
                <IntegrationsSection />
            </div>
        </main>
    );
}
