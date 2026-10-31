import { API_PHP } from "../../config/env";

export const API_BASE = API_PHP;

export const API_ROOT = API_BASE.replace(/\/routes$/, "");

// Create form (localStorage) aur backend, dono ke data ko ek shape mein lao
export const fromProp = (c) =>
    c
        ? {
            id: c.id || "",
            name: c.name || "",
            tagline: c.tagline || "",
            industry: c.industry || "",
            size: c.size || c.company_size || "",
            type: c.type || c.company_type || "",
            founded: c.founded || "",
            website: c.website || "",
            city: c.city || "",
            state: c.state || "",
            location: c.location || [c.city, c.state].filter(Boolean).join(", "),
            description: c.about || c.description || "",
            logo_url: c.logo_url || "",
        }
        : null;

export const resolveLogo = (url) =>
    !url ? null : /^(data:|https?:)/.test(url) ? url : `${API_ROOT}/${url}`;

export const toLines = (arr = []) => arr.map((x) => `${x.title} | ${x.text}`).join("\n");

export const fromLines = (s = "") =>
    s.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const [t, ...r] = l.split("|");
        return { title: t.trim(), text: r.join("|").trim() };
    });
