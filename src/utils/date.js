export const parse = (s) => (s ? new Date(String(s).replace(" ", "T")) : null);

export const fmtDate = (s) => {
    const d = parse(s);

    if (!d || isNaN(d.getTime())) return "";

    return d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export const timeAgo = (s) => {
    const d = parse(s);

    if (!d || isNaN(d.getTime())) return "";

    const mins = Math.floor((Date.now() - d.getTime()) / 60000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;

    const days = Math.floor(hrs / 24);

    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    return fmtDate(s);
};

/* ================= APPLICATION STATS ================= */

export function timeAgoFromTs(ts, now) {
    const s = Math.max(0, Math.floor((now - ts) / 1000));
    if (s < 45) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m || 1} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hr ago`;
    const d = Math.floor(h / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
}

/** "today / yesterday / 3 days ago" style (candidate dashboard jobs). */
export const timeAgoInDays = (d) => {
    if (!d) return "";
    const days = Math.floor((Date.now() - new Date(d.replace(" ", "T")).getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week(s) ago`;
    return `${Math.floor(days / 30)} month(s) ago`;
};
