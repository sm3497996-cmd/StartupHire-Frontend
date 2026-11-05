import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import App from "./App.jsx";
import { PHP_TOKEN_KEY } from "./config/storageKeys";
import { API_LARAVEL } from "./config/env";

const originalFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : (input.url ?? String(input));
    const token = localStorage.getItem(PHP_TOKEN_KEY);
    const isPhp = url.includes("startup-hire-api");
    const isLaravel =
        !!API_LARAVEL &&
        url.startsWith(API_LARAVEL) &&
        !url.startsWith(`${API_LARAVEL}/login`);

    if (token && (isPhp || isLaravel)) {
        const headers = new Headers(
            init.headers || (typeof input !== "string" ? input.headers : undefined)
        );
        // Laravel par agar kisi service ne apna token pehle se lagaya hai to use mat chhedo
        if (isPhp || !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        init = { ...init, headers };
    }
    return originalFetch(input, init);
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);