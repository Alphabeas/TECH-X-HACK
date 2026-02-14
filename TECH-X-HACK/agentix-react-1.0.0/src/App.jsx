import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/footer";
import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import ChatbotDrawer from "./components/chatbot-drawer";
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import DashboardResultsPage from "./pages/dashboard-results-page";
import DashboardVisualizationPage from "./pages/dashboard-visualization-page";
import DashboardSettingsPage from "./pages/dashboard-settings-page";
import OnboardingPage from "./pages/onboarding-page";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function RequireAuth({ isAuthed, isReady, children }) {
    if (!isReady) {
        return (
            <main className="px-6 md:px-16 lg:px-24 xl:px-32">
                <section className="flex items-center justify-center py-24 text-sm text-slate-500">
                    Checking your session...
                </section>
            </main>
        );
    }
    if (!isAuthed) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default function Page() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthed(Boolean(user));
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <>
            <LenisScroll />
            <Navbar isAuthed={isAuthed} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage mode="login" onAuth={() => setIsAuthed(true)} />} />
                <Route path="/signup" element={<AuthPage mode="signup" onAuth={() => setIsAuthed(true)} />} />
                <Route
                    path="/onboarding"
                    element={(
                        <RequireAuth isAuthed={isAuthed} isReady={isAuthReady}>
                            <OnboardingPage />
                        </RequireAuth>
                    )}
                />
                <Route
                    path="/dashboard"
                    element={(
                        <RequireAuth isAuthed={isAuthed} isReady={isAuthReady}>
                            <DashboardPage />
                        </RequireAuth>
                    )}
                />
                <Route
                    path="/dashboard/results"
                    element={(
                        <RequireAuth isAuthed={isAuthed} isReady={isAuthReady}>
                            <DashboardResultsPage />
                        </RequireAuth>
                    )}
                />
                <Route
                    path="/dashboard/visualizations"
                    element={(
                        <RequireAuth isAuthed={isAuthed} isReady={isAuthReady}>
                            <DashboardVisualizationPage />
                        </RequireAuth>
                    )}
                />
                <Route
                    path="/dashboard/settings"
                    element={(
                        <RequireAuth isAuthed={isAuthed} isReady={isAuthReady}>
                            <DashboardSettingsPage />
                        </RequireAuth>
                    )}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ChatbotDrawer isAuthed={isAuthed} />
            <Footer />
        </>
    );
}