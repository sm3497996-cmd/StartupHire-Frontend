import "./CandidateCard.css";

/* ---------- Icons ---------- */
const PATHS = {
    flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
    bookmark: (
        <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" />
    ),
    heart: (
        <path d="M20.8 8.8c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    ),
    chat: (
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-3.7-.8L4 20l1.8-3.6A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    ),
    send: <path d="m3 12 18-8-8 18-2-8-8-2Z" />,
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </>
    ),
    phone: (
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    ),
    pin: (
        <>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    brief: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
        </>
    ),
    grad: (
        <>
            <path d="m2 9 10-5 10 5-10 5L2 9Z" />
            <path d="M6 11.5V16c0 1 2.7 3 6 3s6-2 6-3v-4.5" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
        </>
    ),
    salary: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7v10M15 9.2c-.7-.8-1.6-1.2-3-1.2-1.7 0-2.8.8-2.8 2s1.1 2 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.4 0-2.4-.4-3-1.2" />
        </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
};

const Ic = ({ n, s = 19 }) => (
    <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {PATHS[n]}
    </svg>
);

/* ---------- Helpers ---------- */
const hasValue = (v) => v && String(v).trim().toLowerCase() !== "not specified";

const cleanSkills = (skills = []) => {
    const seen = new Set();
    return skills.filter((s) => {
        const k = String(s).trim().toLowerCase();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
    });
};

const DOTS = ["#61dafb", "#f7a51c", "#e44d26", "#2965f1", "#12b86f", "#962fbf"];

const TILE_BG = {
    location: "linear-gradient(135deg,#e83f7d,#fa7e1e)",
    experience: "linear-gradient(135deg,#7045d8,#4f5bd5)",
    education: "linear-gradient(135deg,#12b86f,#159fd8)",
    availability: "linear-gradient(135deg,#f7a51c,#fa7e1e)",
    salary: "linear-gradient(135deg,#962fbf,#d62976)",
};

const stop = (fn) => (e) => {
    e.stopPropagation();
    fn && fn();
};

/* =========================================================
   CANDIDATE CARD
========================================================= */

export default function CandidateCard({
    c,
    liked,
    saved,
    comments,
    onOpen,
    onLike,
    onLikeCount,
    onSave,
    onComment,
    onShare,
    onReport,
}) {
    const years = String(c.experience || "").replace(" experience", "");
    const skills = cleanSkills(c.skills);
    const shownSkills = skills.slice(0, 4);
    const extra = skills.length - shownSkills.length;

    // "Frontend Developer at Techify Solutions" -> company = "Techify Solutions"
    const m = String(c.summary || "").match(/\sat\s(.+)$/i);
    const company = m ? m[1] : null;
    const about = !company && hasValue(c.summary) ? c.summary : null;

    const tiles = [
        hasValue(c.location) && ["location", "pin", "Location", c.location],
        hasValue(years) && ["experience", "brief", "Experience", years],
        hasValue(c.education) && ["education", "grad", "Education", c.education],
        hasValue(c.availability) && ["availability", "calendar", "Availability", c.availability],
        hasValue(c.salary) && ["salary", "salary", "Expected", c.salary],
    ]
        .filter(Boolean)
        .slice(0, 4);

    return (
        <article className={`tc-card ${saved ? "saved" : ""}`} onClick={onOpen}>
            <div className="tc-glow" style={{ background: c.color }} />

            {/* ---------- Top ---------- */}
            <div className="tc-top">
                <div className="tc-ring">
                    <i style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                        {c.initials}
                    </i>
                </div>

                <div className="tc-nm">
                    <b>
                        <span className="tc-name">{c.name}</span>
                        <span className="tc-ver">✓</span>
                    </b>
                    <span className="tc-sub">{c.email}</span>
                </div>

                <div className="tc-act">
                    <button
                        type="button"
                        className="tc-ib"
                        title="Report"
                        aria-label="Report candidate"
                        onClick={stop(onReport)}
                    >
                        <Ic n="flag" s={17} />
                    </button>
                    <button
                        type="button"
                        className={`tc-ib ${saved ? "on" : ""}`}
                        title={saved ? "Shortlisted" : "Shortlist"}
                        aria-label="Shortlist candidate"
                        onClick={stop(onSave)}
                    >
                        <Ic n="bookmark" s={18} />
                    </button>
                </div>
            </div>

            {/* ---------- Role ---------- */}
            <h3 className="tc-role">
                {c.role}
                {c.match > 0 && <span className="tc-match">{c.match}% match</span>}
            </h3>

            {company && (
                <p className="tc-at">
                    at <b>{company}</b>
                </p>
            )}
            {about && <p className="tc-about">{about}</p>}

            {/* ---------- Info tiles ---------- */}
            {tiles.length > 0 && (
                <div className="tc-info">
                    {tiles.map(([key, icon, label, value]) => (
                        <div className="tc-it" key={key}>
                            <span className="tc-tile" style={{ background: TILE_BG[key] }}>
                                <Ic n={icon} s={17} />
                            </span>
                            <div>
                                <small>{label}</small>
                                <b title={value}>{value}</b>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---------- Skills ---------- */}
            {shownSkills.length > 0 && (
                <div className="tc-sk">
                    {shownSkills.map((s, i) => (
                        <span className="tc-t" key={s} style={{ "--c": DOTS[i % DOTS.length] }}>
                            {s}
                        </span>
                    ))}
                    {extra > 0 && <span className="tc-t more">+{extra} more</span>}
                </div>
            )}

            {/* ---------- Bottom ---------- */}
            <div className="tc-bot">
                <button
                    type="button"
                    className={`tc-sb ${liked ? "liked" : ""}`}
                    aria-label="Like"
                    onClick={stop(onLike)}
                >
                    <Ic n="heart" />
                    <span
                        style={{ cursor: "pointer" }}
                        title="See who liked"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLikeCount && onLikeCount();
                        }}
                    >
                        {liked ? c.likes + 1 : c.likes}
                    </span>
                </button>

                <button type="button" className="tc-sb" aria-label="Comments" onClick={stop(onComment)}>
                    <Ic n="chat" />
                    <span>{comments}</span>
                </button>

                <button type="button" className="tc-sb" aria-label="Share" onClick={stop(onShare)}>
                    <Ic n="send" s={18} />
                </button>

                <a
                    className="tc-sb tc-ct"
                    href={`mailto:${c.email}`}
                    title="Contact"
                    aria-label="Contact candidate"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Ic n="mail" />
                </a>
                {/* NAYA: Phone, mail ke baju mein */}
                {c.phone && (
                    <a
                        className="tc-sb tc-ct tc-call"
                        href={`tel:${c.phone}`}
                        title="Call"
                        aria-label="Call candidate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Ic n="phone" />
                    </a>
                )}

                <button type="button" className="tc-vp" onClick={stop(onOpen)}>
                    View Profile <Ic n="arrow" s={16} />
                </button>
            </div>
        </article>
    );
}
