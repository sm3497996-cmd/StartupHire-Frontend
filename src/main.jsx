import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import App from "./App.jsx";
import { PHP_TOKEN_KEY } from "./config/storageKeys";

const originalFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : (input.url ?? String(input));
    const token = localStorage.getItem(PHP_TOKEN_KEY);
    if (token && url.includes("startup-hire-api")) {
        const headers = new Headers(
            init.headers || (typeof input !== "string" ? input.headers : undefined)
        );
        headers.set("Authorization", `Bearer ${token}`);
        init = { ...init, headers };
    }
    return originalFetch(input, init);
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);