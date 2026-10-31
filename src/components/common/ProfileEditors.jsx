import { useState } from "react";
import "./ProfileEditors.css";

/* =========================================================
   SUGGESTION LISTS  (Company Profile ke chips ke liye)
========================================================= */

export const PERK_SUGGESTIONS = [
    "Health insurance", "Flexible hours", "Work from home", "Paid leaves",
    "Learning budget", "Free meals", "Gym membership", "Stock options (ESOPs)",
    "Performance bonus", "Team outings", "Relocation support", "Sponsored certifications",
    "5-day week", "Casual dress code", "Mentorship", "Annual retreat",
];

export const TECH_SUGGESTIONS = [
    "React", "Node.js", "TypeScript", "Next.js", "Python", "Django", "Laravel", "PHP",
    "MySQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Figma", "Git",
    "Firebase", "Tailwind CSS", "Flutter", "React Native", "Java", "Spring Boot", "GraphQL", "Redis",
];

export const HIRING_SUGGESTIONS = [
    "Resume screening", "Online assessment", "Technical interview", "Machine coding round",
    "Assignment / task", "HR interview", "Culture fit round", "Final offer",
];

/* =========================================================
   LINK PLATFORMS
========================================================= */

export const PLATFORMS = [
    { id: "linkedin", label: "LinkedIn", host: "linkedin.com", mark: "in", color: "#0a66c2", ph: "linkedin.com/company/your-company" },
    { id: "website", label: "Website", host: "", mark: null, color: "#4f46e5", ph: "www.yourcompany.com" },
    { id: "instagram", label: "Instagram", host: "instagram.com", mark: "ig", color: "#d62976", ph: "instagram.com/yourcompany" },
    { id: "twitter", label: "X (Twitter)", host: "twitter.com|x.com", mark: "X", color: "#111827", ph: "x.com/yourcompany" },
    { id: "youtube", label: "YouTube", host: "youtube.com|youtu.be", mark: "yt", color: "#e11d48", ph: "youtube.com/@yourcompany" },
    { id: "facebook", label: "Facebook", host: "facebook.com|fb.com", mark: "f", color: "#1877f2", ph: "facebook.com/yourcompany" },
    { id: "github", label: "GitHub", host: "github.com", mark: "gh", color: "#24292f", ph: "github.com/your-org" },
    { id: "behance", label: "Behance", host: "behance.net", mark: "Be", color: "#1769ff", ph: "behance.net/yourcompany" },
    { id: "dribbble", label: "Dribbble", host: "dribbble.com", mark: "dr", color: "#ea4c89", ph: "dribbble.com/yourcompany" },
    { id: "glassdoor", label: "Glassdoor", host: "glassdoor.co.in|glassdoor.com", mark: "gd", color: "#0caa41", ph: "glassdoor.co.in/Overview/..." },
    { id: "other", label: "Other link", host: "", mark: null, color: "#6b7596", ph: "https://" },
];

const platformOf = (id) => PLATFORMS.find((p) => p.id === id) || PLATFORMS[PLATFORMS.length - 1];

/* =========================================================
   HELPERS
========================================================= */

const uid = () => Math.random().toString(36).slice(2, 9);

export const emptyContact = { email: "", phone: "", links: [] };

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

export const isPhone = (v) => {
    const d = String(v).replace(/\D/g, "");
    return d.length >= 10 && d.length <= 13;
};

export const normalizeUrl = (v) => {
    const s = String(v || "").trim();
    if (!s) return "";
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};

const validUrl = (v) => {
    try {
        return new URL(normalizeUrl(v)).hostname.includes(".");
    } catch {
        return false;
    }
};

/* link paste karte hi platform auto-detect (linkedin.com -> LinkedIn) */
export const detectPlatform = (url) => {
    try {
        const h = new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
        for (const p of PLATFORMS) {
            if (p.host && p.host.split("|").some((x) => h === x || h.endsWith(`.${x}`))) return p.id;
        }
    } catch {
        /* ignore */
    }
    return null;
};

/* DB / API se aaya data -> editor ke format me (har link ko id do) */
export const toContact = (raw) => ({
    email: raw?.email || "",
    phone: raw?.phone || "",
    links: (raw?.links || []).map((l) => ({
        id: l.id || uid(),
        type: l.type || "website",
        url: l.url || "",
    })),
});

export function validateContact(c = {}) {
    const errors = { email: "", phone: "", links: {}, any: false };
    const email = String(c.email || "").trim();
    const phone = String(c.phone || "").trim();

    if (email && !isEmail(email)) errors.email = "Enter a valid email address";
    if (phone && !isPhone(phone)) errors.phone = "Enter a valid phone number (10-13 digits)";

    const seen = new Set();
    (c.links || []).forEach((l) => {
        const u = String(l.url || "").trim();
        if (!u) return; // khaali row save me skip hoti hai
        if (!validUrl(u)) {
            errors.links[l.id] = "Enter a valid link";
            return;
        }
        const key = normalizeUrl(u).toLowerCase().replace(/\/$/, "");
        if (seen.has(key)) errors.links[l.id] = "This link is already added";
        seen.add(key);
    });

    errors.any = !!(errors.email || errors.phone || Object.keys(errors.links).length);
    return errors;
}

/* Save karne se pehle: trim + https:// + duplicate/khaali hatao */
export function sanitizeContact(c = {}) {
    const seen = new Set();
    const links = [];
    (c.links || []).forEach((l) => {
        const url = normalizeUrl(l.url);
        const key = url.toLowerCase().replace(/\/$/, "");
        if (!url || !validUrl(url) || seen.has(key)) return;
        seen.add(key);
        links.push({ type: l.type || "website", url });
    });
    return { email: String(c.email || "").trim(), phone: String(c.phone || "").trim(), links };
}

/* =========================================================
   ICONS
========================================================= */

const PATHS = {
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </>
    ),
    phone: (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
    ),
    link: (
        <>
            <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
            <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </>
    ),
    search: (
        <>
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
};

const Ic = ({ n, s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {PATHS[n]}
    </svg>
);

function Badge({ type, size = 32 }) {
    const p = platformOf(type);
    return (
        <span className="pe-badge" style={{ background: p.color, width: size, height: size, fontSize: size * 0.38 }}>
            {p.mark ? p.mark : <Ic n={type === "other" ? "link" : "globe"} s={size * 0.52} />}
        </span>
    );
}

/* =========================================================
   1) CHIP PICKER  (Internshala style: search + selected chips + suggestions)
   Perks, Tech stack, How we hire sabme use hota hai
========================================================= */

export function ChipPicker({
    label,
    value = [],
    onChange,
    suggestions = [],
    placeholder = "Search or type and press Enter",
    max = 30,
    allowCustom = true,
}) {
    const [q, setQ] = useState("");
    const lower = (s) => String(s).toLowerCase();
    const has = (t) => value.some((v) => lower(v) === lower(t));

    const add = (text) => {
        const t = String(text || "").trim();
        if (!t || t.length > 40 || has(t) || value.length >= max) return;
        onChange([...value, t]);
        setQ("");
    };

    const remove = (t) => onChange(value.filter((v) => v !== t));

    const onKey = (e) => {
        if ((e.key === "Enter" || e.key === ",") && q.trim()) {
            e.preventDefault();
            if (allowCustom) add(q);
        } else if (e.key === "Backspace" && !q && value.length) {
            remove(value[value.length - 1]);
        }
    };

    const pool = suggestions
        .filter((s) => !has(s) && lower(s).includes(lower(q.trim())))
        .slice(0, 18);

    const canAddCustom = allowCustom && q.trim() && !has(q) && !suggestions.some((s) => lower(s) === lower(q.trim()));

    return (
        <div className="pe-field">
            {label && <p className="pe-label">{label}</p>}

            <div className="pe-search">
                <Ic n="search" s={18} />
                <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={placeholder} />
                {canAddCustom && (
                    <button type="button" className="pe-addtxt" onClick={() => add(q)}>
                        <Ic n="plus" s={14} /> Add "{q.trim()}"
                    </button>
                )}
            </div>

            {value.length > 0 && (
                <div className="pe-chips">
                    {value.map((t) => (
                        <span key={t} className="pe-chip on">
                            {t}
                            <button type="button" aria-label={`Remove ${t}`} onClick={() => remove(t)}>
                                <Ic n="close" s={13} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {pool.length > 0 && (
                <>
                    <p className="pe-sub">{value.length ? "Also select the following" : "Popular picks"}</p>
                    <div className="pe-chips">
                        {pool.map((s) => (
                            <button type="button" key={s} className="pe-chip off" onClick={() => add(s)} disabled={value.length >= max}>
                                {s}
                                <Ic n="plus" s={14} />
                            </button>
                        ))}
                    </div>
                </>
            )}

            <p className="pe-count">
                {value.length} selected{max ? ` · max ${max}` : ""}
            </p>
        </div>
    );
}

/* =========================================================
   2) CONTACT + MULTIPLE LINKS EDITOR
   value = { email, phone, links: [{ id, type, url }] }
========================================================= */

export function ContactLinksEditor({ value, onChange, compact = false }) {
    const v = toContactSafe(value);
    const errs = validateContact(v);

    const set = (patch) => onChange({ ...v, ...patch });
    const setLink = (id, patch) => set({ links: v.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
    const addLink = (type = "website") => v.links.length < 10 && set({ links: [...v.links, { id: uid(), type, url: "" }] });
    const removeLink = (id) => set({ links: v.links.filter((l) => l.id !== id) });

    const onUrl = (l, url) => {
        const d = detectPlatform(url);
        setLink(l.id, { url, ...(d ? { type: d } : {}) });
    };

    const quick = PLATFORMS.filter((p) => p.id !== "other" && !v.links.some((l) => l.type === p.id)).slice(0, 6);

    return (
        <div className={`pe-contact ${compact ? "compact" : ""}`}>
            <div className="pe-grid2">
                <div className="pe-field">
                    <p className="pe-label">Contact email</p>
                    <div className={`pe-wrap ${errs.email ? "err" : ""}`}>
                        <Ic n="mail" />
                        <input type="email" value={v.email} onChange={(e) => set({ email: e.target.value })} placeholder="hr@yourcompany.com" />
                    </div>
                    {errs.email && <em className="pe-err">{errs.email}</em>}
                </div>

                <div className="pe-field">
                    <p className="pe-label">Contact phone</p>
                    <div className={`pe-wrap ${errs.phone ? "err" : ""}`}>
                        <Ic n="phone" />
                        <input type="tel" value={v.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                    {errs.phone && <em className="pe-err">{errs.phone}</em>}
                </div>
            </div>

            <p className="pe-label pe-gap">Links (LinkedIn, website, social...)</p>

            <div className="pe-links">
                {v.links.map((l) => (
                    <div className="pe-link" key={l.id}>
                        <Badge type={l.type} />
                        <select value={l.type} onChange={(e) => setLink(l.id, { type: e.target.value })}>
                            {PLATFORMS.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.label}
                                </option>
                            ))}
                        </select>

                        <div className={`pe-wrap grow ${errs.links[l.id] ? "err" : ""}`}>
                            <Ic n="link" />
                            <input value={l.url} onChange={(e) => onUrl(l, e.target.value)} placeholder={platformOf(l.type).ph} />
                        </div>

                        <button type="button" className="pe-del" aria-label="Remove link" onClick={() => removeLink(l.id)}>
                            <Ic n="close" s={15} />
                        </button>

                        {errs.links[l.id] && <em className="pe-err full">{errs.links[l.id]}</em>}
                    </div>
                ))}
            </div>

            <div className="pe-quick">
                {quick.map((p) => (
                    <button type="button" key={p.id} className="pe-add" onClick={() => addLink(p.id)}>
                        <Ic n="plus" s={14} /> {p.label}
                    </button>
                ))}
                <button type="button" className="pe-add ghost" onClick={() => addLink("other")}>
                    <Ic n="plus" s={14} /> Another link
                </button>
            </div>
        </div>
    );
}

const toContactSafe = (value) => ({
    email: value?.email || "",
    phone: value?.phone || "",
    links: (value?.links || []).map((l) => (l.id ? l : { ...l, id: uid() })),
});

/* =========================================================
   3) VIEW COMPONENTS  (card ke andar dikhane ke liye)
========================================================= */

export function ChipList({ items = [], empty = "Not added yet. Click Edit to add." }) {
    if (!items.length) return <p className="pe-empty">{empty}</p>;
    return (
        <div className="pe-chips">
            {items.map((t, i) => (
                <span key={`${t}-${i}`} className={`pe-chip tone${i % 4}`}>
                    {t}
                </span>
            ))}
        </div>
    );
}

export function ContactLinksView({ contact, empty = "Not added yet. Click Edit to add." }) {
    const c = toContact(contact);
    if (!c.email && !c.phone && !c.links.length) return <p className="pe-empty">{empty}</p>;

    return (
        <div className="pe-view">
            {(c.email || c.phone) && (
                <div className="pe-rows">
                    {c.email && (
                        <a className="pe-row" href={`mailto:${c.email}`}>
                            <span className="pe-ico"><Ic n="mail" /></span>
                            <div>
                                <small>Email</small>
                                <b>{c.email}</b>
                            </div>
                        </a>
                    )}
                    {c.phone && (
                        <a className="pe-row" href={`tel:${c.phone}`}>
                            <span className="pe-ico"><Ic n="phone" /></span>
                            <div>
                                <small>Phone</small>
                                <b>{c.phone}</b>
                            </div>
                        </a>
                    )}
                </div>
            )}

            {c.links.length > 0 && (
                <div className="pe-lchips">
                    {c.links.map((l) => (
                        <a key={l.id} className="pe-lchip" href={normalizeUrl(l.url)} target="_blank" rel="noreferrer noopener">
                            <Badge type={l.type} size={26} />
                            <span>{platformOf(l.type).label}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

/* =========================================================
   ADAPTERS  -  Companyprofile.jsx ke existing format ke liye
   extra.socials  = [{ title: "LinkedIn", text: "linkedin.com/..." }]
   extra.benefits = [{ title, text }]   extra.steps = [{ title, text }]
========================================================= */

export const socialsToLinks = (socials = []) =>
    socials.map((s) => {
        const url = s.text || s.url || "";
        const t = String(s.title || "").toLowerCase();
        const byLabel = PLATFORMS.find((p) => p.id === t || p.label.toLowerCase() === t);
        return { id: uid(), type: detectPlatform(url) || byLabel?.id || "other", url };
    });

export const linksToSocials = (links = []) =>
    links.map((l) => ({ title: platformOf(l.type).label, text: l.url }));

/* chips (strings) -> [{title, text}] ; purana text bacha ke rakhta hai */
export const chipsToItems = (chips = [], old = []) =>
    chips.map((t) => old.find((o) => o.title === t) || { title: t, text: "" });