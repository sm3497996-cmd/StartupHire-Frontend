import { useState } from "react";
import "./InteractionsPanel.css";

/* ---------- Icons ---------- */
const PATHS = {
    send: <path d="m3 12 18-8-8 18-2-8-8-2Z" />,
    save: (
        <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" />
    ),
    like: (
        <path d="M20.8 8.8c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    ),
    request: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c.6-3.4 3-5 6.5-5s5.9 1.6 6.5 5" />
            <path d="M19 8v6M16 11h6" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
        </>
    ),
};

const Ic = ({ n, s = 12 }) => (
    <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {PATHS[n]}
    </svg>
);

/* ---------- Config ---------- */
const TYPES = {
    apply: { tag: "apply", icon: "send" },
    save: { tag: "save", icon: "save" },
    like: { tag: "like", icon: "like" },
    request: { tag: "new request", icon: "request" },
};

const TABS = [
    ["all", "All"],
    ["apply", "Apply"],
    ["save", "Save"],
    ["like", "Like"],
    ["request", "Request"],
];

/* backend ke alag-alag type names ko panel ke 4 types mein convert karta hai */
const TYPE_ALIASES = {
    apply: "apply",
    applied: "apply",
    application: "apply",
    save: "save",
    saved: "save",
    bookmark: "save",
    like: "like",
    liked: "like",
    request: "request",
    requested: "request",
    accepted: "request",
    referral: "request",
};

const normalizeType = (t) => TYPE_ALIASES[String(t || "").toLowerCase()] || "apply";

const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d); // already formatted string
    return dt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

/* Real API item -> panel item */
const mapItem = (i, idx) => ({
    id: i.id ?? i._id ?? idx,
    type: normalizeType(i.type ?? i.action),
    name: i.name ?? i.userName ?? i.user?.name ?? "User",
    text: i.text ?? i.message ?? "interacted with",
    role: i.role ?? i.jobTitle ?? i.job?.title ?? "",
    at: i.at ?? i.company ?? i.job?.company,
    date: formatDate(i.date ?? i.createdAt),
    unread: i.unread ?? (i.isRead === undefined ? false : !i.isRead),
});

export const interactionsSeed = [
    { id: 1, type: "apply", name: "Somil", text: "applied for", role: "Project Manager Role", at: "HTC Company", date: "24 June 2020", unread: true },
    { id: 2, type: "save", name: "Aditi", text: "saved your", role: "Web Development Role", date: "23 June 2020" },
    { id: 3, type: "like", name: "Mohan", text: "liked your", role: "FRT Role", date: "24 June 2020" },
    { id: 4, type: "request", name: "Sumit", text: "accepted your request to apply for", role: "Analyst Role", date: "24 June 2020", unread: true },
];

/* =========================================================
   INTERACTIONS SIDE PANEL
========================================================= */

export default function InteractionsPanel({ items: rawItems = [], onViewAll, onMarkAllRead }) {
    // Debug: browser console (F12) mein dekho parent se kya aa raha hai
    console.log("INTERACTIONS ITEMS:", rawItems);

    // API kabhi { data: [...] } ya { interactions: [...] } bhi bhejti hai
    const list = Array.isArray(rawItems)
        ? rawItems
        : rawItems?.interactions || rawItems?.data || [];

    const items = list.map(mapItem);

    const [tab, setTab] = useState("all");
    const [read, setRead] = useState([]);

    const isUnread = (i) => i.unread && !read.includes(i.id);
    const unread = items.filter(isUnread).length;

    const count = (t) => (t === "all" ? items.length : items.filter((i) => i.type === t).length);
    const shown = tab === "all" ? items : items.filter((i) => i.type === tab);

    const markAll = () => {
        setRead(items.map((i) => i.id));
        onMarkAllRead?.();
    };

    return (
        <aside className="ip-panel">
            <div className="ip-bar" />

            {/* ---------- Header ---------- */}
            <div className="ip-head">
                <div>
                    <h3 className="ip-title">Interactions</h3>
                    <p className="ip-sub">Latest activity on your roles</p>
                </div>

                {unread > 0 && (
                    <span className="ip-new">
                        <i />
                        {unread} new
                    </span>
                )}
            </div>

            {/* ---------- Tabs ---------- */}
            <div className="ip-tabs">
                {TABS.map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        className={`ip-tab ${tab === key ? "on" : ""}`}
                        onClick={() => setTab(key)}
                    >
                        {label}
                        <b>{count(key)}</b>
                    </button>
                ))}
            </div>

            {/* ---------- List ---------- */}
            <ul className="ip-list">
                {shown.map((i, idx) => {
                    const t = TYPES[i.type] || TYPES.apply;
                    return (
                        <li
                            key={i.id}
                            className={`ip-item t-${i.type} ${isUnread(i) ? "unread" : ""}`}
                            style={{ animationDelay: `${idx * 70}ms` }}
                        >
                            <span className="ip-av">
                                {String(i.name || "?").slice(0, 2).toUpperCase()}
                                <span className="ip-ic">
                                    <Ic n={t.icon} />
                                </span>
                            </span>

                            <div className="ip-body">
                                <p className="ip-text">
                                    <b>{i.name}</b> {i.text} <em>{i.role}</em>
                                    {i.at && (
                                        <>
                                            {" "}
                                            at <b>{i.at}</b>
                                        </>
                                    )}
                                </p>

                                <div className="ip-meta">
                                    <span className="ip-date">
                                        <Ic n="calendar" s={13} />
                                        {i.date}
                                    </span>
                                    <span className="ip-tag">{t.tag}</span>
                                </div>
                            </div>

                            {isUnread(i) && <span className="ip-dot" />}
                        </li>
                    );
                })}
            </ul>

            {shown.length === 0 && <p className="ip-empty">Nothing here yet.</p>}

            {/* ---------- Footer ---------- */}
            <div className="ip-foot">
                {unread > 0 ? (
                    <button type="button" className="ip-link" onClick={markAll}>
                        Mark all as read
                    </button>
                ) : (
                    <span className="ip-uptodate">You're all caught up</span>
                )}

                {onViewAll && (
                    <button type="button" className="ip-all" onClick={onViewAll}>
                        View all →
                    </button>
                )}
            </div>
        </aside>
    );
}