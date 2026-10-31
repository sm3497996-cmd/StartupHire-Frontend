import { API_LARAVEL } from "../config/env";
import { TOKEN_KEY } from "../config/storageKeys";

// Laravel server (php artisan serve) ka address
export const API_BASE = API_LARAVEL;

export async function api(path, { method = "GET", body } = {}) {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        return { success: false, message: "Please login again" }; // bina token ke request hi mat bhejo
    }

    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await res.json().catch(() => ({}));

        if (res.status === 401) {
            return { success: false, message: "Please login again" };
        }
        if (!res.ok) {
            return { success: false, message: data.message || "Request failed" };
        }
        return data;
    } catch {
        return { success: false, message: "Server se connect nahi ho paya" };
    }
}
