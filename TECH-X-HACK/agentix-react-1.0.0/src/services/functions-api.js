import { auth } from "../firebase";

const baseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_FUNCTIONS_BASE_URL || "http://127.0.0.1:8000/api";

export async function callFunction(path, options = {}) {
    const token = await auth.currentUser?.getIdToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    let response;
    try {
        response = await fetch(`${baseUrl}${path}`, {
            ...options,
            headers,
        });
    } catch (error) {
        throw new Error("Cannot reach backend at http://127.0.0.1:8000. Start Django with: python career_navigator/manage.py runserver 8000");
    }

    if (!response.ok) {
        const errorText = await response.text();
        try {
            const parsed = JSON.parse(errorText);
            throw new Error(parsed.error || parsed.message || "Request failed");
        } catch {
            throw new Error(errorText || "Request failed");
        }
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();
}
