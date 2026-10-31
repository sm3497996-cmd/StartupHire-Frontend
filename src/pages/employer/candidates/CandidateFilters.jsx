import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CandidateFilters.css";

export const emptyFilters = {
    query: "",
    skills: [],
    experience: "Any",
    availability: "Any",
    education: "Any",
    location: "",
    minMatch: 0,
    sort: "",
};

const OPTIONS = {
    experience: ["Fresher", "1-3 yrs", "3-5 yrs", "5+ yrs"],
    availability: ["Immediate", "15 days", "30 days", "60 days"],
    education: ["B.Tech", "M.Tech", "BCA", "MCA", "MBA", "B.Des", "B.Sc"],
};

const SKILLS = ["React", "Node.js", "Figma", "SQL", "Python", "AWS"];
const QUICK_LOCATIONS = ["Remote", "Bhopal", "Indore", "Pune", "Bangalore"];

const SORTS = [
    ["", "Default"],
    ["match", "Best match"],
    ["exp", "Most experience"],
    ["name", "Name A–Z"],
];

// [category name, emoji, fallback skill (used only if category props are not passed)]
const QUICK = [
    ["All", "✨", null],
    ["Frontend", "🎨", "react"],
    ["Backend", "⚙️", "node.js"],
    ["Design", "🌼", "figma"],
    ["Marketing", "📣", "seo"],
    ["Data", "📊", "python"],
];

const PILLS = [
    ["skills", "Skills"],
    ["experience", "Experience"],
    ["availability", "Availability"],
    ["education", "Education"],
    ["location", "Location"],
];

const EXP_RANGE = {
    Fresher: [0, 0],
    "1-3 yrs": [1, 3],
    "3-5 yrs": [3, 5],
    "5+ yrs": [5, 99],
};

const norm = (s = "") => String(s).toLowerCase().replace(/[.\s]/g, "");

/* =========================================================
   APPLY FILTERS
========================================================= */

export function applyCandidateFilters(list, f) {
    const loc = f.location.trim().toLowerCase();
    const q = (f.query || "").trim().toLowerCase();

    let out = list.filter((c) => {
        const cSkills = (c.skills || []).map((s) => String(s).toLowerCase());
        const yrs = parseFloat(c.experience) || 0;
        const range = EXP_RANGE[f.experience];
        const avail = String(c.availability || "").toLowerCase();
        const availKey =
            f.availability === "Immediate" ? "immediate" : f.availability.toLowerCase();
        const haystack = `${c.name} ${c.role} ${c.location} ${cSkills.join(" ")}`.toLowerCase();

        return (
            (!q || haystack.includes(q)) &&
            f.skills.every((s) => cSkills.some((cs) => cs.includes(s))) &&
            (!range || (yrs >= range[0] && yrs <= range[1])) &&
            (f.availability === "Any" || avail.includes(availKey)) &&
            (f.education === "Any" || norm(c.education).includes(norm(f.education))) &&
            (!loc || String(c.location || "").toLowerCase().includes(loc)) &&
            (c.match ?? 100) >= f.minMatch
        );
    });

    if (f.sort === "match") out = [...out].sort((a, b) => (b.match ?? 0) - (a.match ?? 0));
    if (f.sort === "exp")
        out = [...out].sort(
            (a, b) => (parseFloat(b.experience) || 0) - (parseFloat(a.experience) || 0)
        );
    if (f.sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    return out;
}

/* =========================================================
   SMALL PIECES
========================================================= */

function ChipGroup({ label, options, value, onPick }) {
    return (
        <div className="cf-group">
            <h4 className="cf-h">{label}</h4>
            <div className="cf-chips">
                {options.map((o) => {
                    const [val, text] = Array.isArray(o) ? o : [o, o];
                    return (
                        <button
                            key={val}
                            type="button"
                            className={`cf-chip ${value === val ? "on" : ""}`}
                            onClick={() => onPick(val)}
                        >
                            {text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const Caret = ({ open }) => <i className={`cf-caret ${open ? "up" : ""}`} />;

/* =========================================================
   MAIN COMPONENT

   Required props : filters, setFilters, shown, total
   Optional props : category, setCategory   -> connect circles to category state
                    candidates              -> all candidates (for circle counts)
                    previewCandidates       -> filtered candidates (for avatars)
                    shortlistedCount        -> number for snapshot
                    onViewAll               -> shows the "View all candidates" button
========================================================= */

export default function CandidateFilters({
    filters,
    setFilters,
    shown,
    total,
    category,
    setCategory,
    candidates,
    previewCandidates,
    shortlistedCount = 0,
    onViewAll,
}) {
    const [open, setOpen] = useState(false); // all-filters drawer
    const [pop, setPop] = useState(null); // { key, left, top }
    const [skillInput, setSkillInput] = useState("");
    const searchRef = useRef(null);

    const set = (patch) => setFilters({ ...filters, ...patch });
    const useCategory = typeof setCategory === "function";

    /* ---------- Keyboard: Esc closes, Ctrl/Cmd+K focuses search ---------- */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                setPop(null);
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                if (searchRef.current) {
                    e.preventDefault();
                    searchRef.current.focus();
                }
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    /* ---------- Close dropdown on outside click / scroll / resize ---------- */
    useEffect(() => {
        if (!pop) return;
        const onDown = (e) => {
            if (!e.target.closest(".cf-pop, .cf-filter-pill, .cf-sort")) setPop(null);
        };
        const onScroll = (e) => {
            if (e.target && e.target.closest && e.target.closest(".cf-pop")) return;
            setPop(null);
        };
        const onResize = () => setPop(null);
        document.addEventListener("mousedown", onDown);
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        return () => {
            document.removeEventListener("mousedown", onDown);
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
    }, [pop]);

    const openPop = (key, e) => {
        if (pop && pop.key === key) return setPop(null);
        const r = e.currentTarget.getBoundingClientRect();
        const width = 290;
        const left = Math.max(10, Math.min(r.left, window.innerWidth - width - 10));
        setPop({ key, left, top: r.bottom + 8 });
    };

    /* ---------- Helpers ---------- */
    const toggleSkill = (value) =>
        set({
            skills: filters.skills.includes(value)
                ? filters.skills.filter((x) => x !== value)
                : [...filters.skills, value],
        });

    const addSkill = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const v = skillInput.trim().toLowerCase();
        if (v && !filters.skills.includes(v)) set({ skills: [...filters.skills, v] });
        setSkillInput("");
    };

    const pillText = (key, label) => {
        if (key === "skills") return filters.skills.length ? `Skills · ${filters.skills.length}` : label;
        if (key === "location") return filters.location ? `Location: ${filters.location}` : label;
        return filters[key] !== "Any" ? `${label}: ${filters[key]}` : label;
    };

    const pillActive = (key) =>
        key === "skills"
            ? filters.skills.length > 0
            : key === "location"
                ? !!filters.location
                : filters[key] !== "Any";

    const activeCount =
        filters.skills.length +
        ["experience", "availability", "education"].filter((k) => filters[k] !== "Any").length +
        (filters.location ? 1 : 0) +
        (filters.minMatch > 0 ? 1 : 0) +
        (filters.sort ? 1 : 0);

    const sortLabel = (SORTS.find((s) => s[0] === filters.sort) || SORTS[0])[1];

    const quickActive = (name, skill) => {
        if (useCategory) return (category || "All") === name;
        if (name === "All") return filters.skills.length === 0;
        return filters.skills.length === 1 && filters.skills[0] === skill;
    };

    const pickQuick = (name, skill) => {
        if (useCategory) return setCategory(name);
        set({ skills: skill ? [skill] : [] });
    };

    const quickCount = (name) => {
        if (!candidates) return 0;
        if (name === "All") return candidates.length;
        return candidates.filter((c) => c.category === name).length;
    };

    const locationSelected = (l) => filters.location.toLowerCase() === l.toLowerCase();

    const resetAll = () => {
        setFilters(emptyFilters);
        if (useCategory) setCategory("All");
    };

    /* ---------- Applied filter tags ---------- */
    const applied = [
        ...filters.skills.map((s) => ({
            label: `Skills: ${s}`,
            remove: () => set({ skills: filters.skills.filter((x) => x !== s) }),
        })),
        ...["experience", "availability", "education"]
            .filter((k) => filters[k] !== "Any")
            .map((k) => ({
                label: `${k[0].toUpperCase() + k.slice(1)}: ${filters[k]}`,
                remove: () => set({ [k]: "Any" }),
            })),
        ...(filters.location
            ? [{ label: `Location: ${filters.location}`, remove: () => set({ location: "" }) }]
            : []),
        ...(filters.minMatch > 0
            ? [{ label: `Match ${filters.minMatch}%+`, remove: () => set({ minMatch: 0 }) }]
            : []),
    ];

    /* ---------- Dropdown content ---------- */
    const renderPop = () => {
        const key = pop.key;
        let body = null;
        let label = "";

        if (key === "sort") {
            label = "Sort by";
            body = (
                <div className="cf-chips">
                    {SORTS.map(([val, text]) => (
                        <button
                            key={text}
                            type="button"
                            className={`cf-chip sm ${filters.sort === val ? "on" : ""}`}
                            onClick={() => set({ sort: val })}
                        >
                            {text}
                        </button>
                    ))}
                </div>
            );
        } else if (key === "skills") {
            label = "Skills";
            body = (
                <>
                    <div className="cf-chips">
                        {SKILLS.map((s) => {
                            const v = s.toLowerCase();
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    className={`cf-chip sm ${filters.skills.includes(v) ? "on" : ""}`}
                                    onClick={() => toggleSkill(v)}
                                >
                                    {s}
                                </button>
                            );
                        })}
                        {filters.skills
                            .filter((v) => !SKILLS.some((s) => s.toLowerCase() === v))
                            .map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    className="cf-chip sm on"
                                    onClick={() => toggleSkill(v)}
                                >
                                    {v} ×
                                </button>
                            ))}
                    </div>
                    <input
                        className="cf-field cf-mt"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        placeholder="Type a skill and press Enter"
                    />
                </>
            );
        } else if (key === "location") {
            label = "Location";
            body = (
                <>
                    <input
                        className="cf-field"
                        value={filters.location}
                        onChange={(e) => set({ location: e.target.value })}
                        placeholder="Search location..."
                    />
                    <div className="cf-chips cf-mt">
                        {QUICK_LOCATIONS.map((l) => (
                            <button
                                key={l}
                                type="button"
                                className={`cf-chip sm ${locationSelected(l) ? "on" : ""}`}
                                onClick={() => set({ location: locationSelected(l) ? "" : l })}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </>
            );
        } else {
            label = PILLS.find((p) => p[0] === key)[1];
            body = (
                <div className="cf-chips">
                    {OPTIONS[key].map((o) => (
                        <button
                            key={o}
                            type="button"
                            className={`cf-chip sm ${filters[key] === o ? "on" : ""}`}
                            onClick={() => set({ [key]: filters[key] === o ? "Any" : o })}
                        >
                            {o}
                        </button>
                    ))}
                </div>
            );
        }

        const clear = () =>
            set(
                key === "sort"
                    ? { sort: "" }
                    : key === "skills"
                        ? { skills: [] }
                        : key === "location"
                            ? { location: "" }
                            : { [key]: "Any" }
            );

        return createPortal(
            <div className="cf-root">
                <div className="cf-pop" style={{ left: pop.left, top: pop.top }}>
                    <div className="cf-pop-head">{label}</div>
                    {body}
                    <div className="cf-pop-foot">
                        <button type="button" className="cf-link" onClick={clear}>
                            Clear
                        </button>
                        <button type="button" className="cf-done" onClick={() => setPop(null)}>
                            Done
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    const avatars = (previewCandidates || []).slice(0, 4);

    return (
        <div className="cf-root">
            <div className="cf-card">
                {/* ---------- Header ---------- */}
                <div className="cf-head">
                    <div>
                        <h3 className="cf-title">Find talent</h3>
                        <div className="cf-subtitle">
                            Quick filters on top, everything else in "All filters"
                        </div>
                    </div>
                    <span className="cf-live">
                        <i />
                        {shown} of {total} candidates
                    </span>
                </div>

                <div className="cf-grid">
                    {/* ================= LEFT: filters ================= */}
                    <div className="cf-left">
                        {/* Category circles */}
                        <div className="cf-quick-scroll">
                            {QUICK.map(([name, emoji, skill]) => {
                                const n = quickCount(name);
                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        className={`cf-quick ${quickActive(name, skill) ? "active" : ""}`}
                                        onClick={() => pickQuick(name, skill)}
                                    >
                                        <span className="cf-quick-icon">
                                            {emoji}
                                            {n > 0 && <b className="cf-quick-badge">{n}</b>}
                                        </span>
                                        <span>{name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search + sort */}
                        <div className="cf-srow">
                            <div className="cf-search-ring">
                                <label className="cf-search">
                                    <span className="cf-search-ico">🔍</span>
                                    <input
                                        ref={searchRef}
                                        value={filters.query || ""}
                                        onChange={(e) => set({ query: e.target.value })}
                                        placeholder="Search by name, role or skill"
                                    />
                                    {filters.query ? (
                                        <button
                                            type="button"
                                            className="cf-search-x"
                                            aria-label="Clear search"
                                            onClick={() => set({ query: "" })}
                                        >
                                            ×
                                        </button>
                                    ) : (
                                        <kbd className="cf-kbd">Ctrl K</kbd>
                                    )}
                                </label>
                            </div>

                            <button
                                type="button"
                                className={`cf-sort ${pop && pop.key === "sort" ? "open" : ""}`}
                                onClick={(e) => openPop("sort", e)}
                            >
                                ↕ {sortLabel}
                                <Caret open={pop && pop.key === "sort"} />
                            </button>
                        </div>

                        {/* Filter pills (scroll) + All filters (fixed) */}
                        <div className="cf-filter-row">
                            {PILLS.map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`cf-filter-pill ${pillActive(key) ? "selected" : ""} ${pop && pop.key === key ? "open" : ""
                                        }`}
                                    onClick={(e) => openPop(key, e)}
                                >
                                    {pillText(key, label)}
                                    <Caret open={pop && pop.key === key} />
                                </button>
                            ))}

                            <button
                                type="button"
                                className="cf-all-filter-btn"
                                onClick={() => {
                                    setPop(null);
                                    setOpen(true);
                                }}
                            >
                                <span>⚙</span>
                                All filters
                                {activeCount > 0 && <em>{activeCount}</em>}
                            </button>
                        </div>

                        {/* Applied filters */}
                        {(applied.length > 0 || filters.query) && (
                            <div className="cf-applied">
                                <span className="cf-applied-label">Applied:</span>
                                {applied.map((a) => (
                                    <span className="cf-tag" key={a.label}>
                                        {a.label}
                                        <b role="button" aria-label="Remove" onClick={a.remove}>
                                            ×
                                        </b>
                                    </span>
                                ))}
                                <button type="button" className="cf-clear-all" onClick={resetAll}>
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ================= RIGHT: Hiring snapshot ================= */}
                    <aside className="cf-snap">
                        <small>Hiring snapshot</small>

                        <div className="cf-snap-big">
                            {total}
                            <span>candidates</span>
                        </div>

                        <div className="cf-snap-mini">
                            <div>
                                <b>{shortlistedCount}</b>
                                <span>Shortlisted</span>
                            </div>
                            <div>
                                <b>{shown}</b>
                                <span>Matching filters</span>
                            </div>
                        </div>

                        {avatars.length > 0 && (
                            <div className="cf-snap-av">
                                {avatars.map((c) => (
                                    <i key={c.id} style={{ background: c.color || "#5b3df5" }} title={c.name}>
                                        {c.initials}
                                    </i>
                                ))}
                                <span>
                                    {shown > avatars.length
                                        ? `+${shown - avatars.length} more`
                                        : "Matching profiles"}
                                </span>
                            </div>
                        )}

                        {onViewAll && (
                            <button type="button" className="cf-snap-btn" onClick={onViewAll}>
                                View all candidates →
                            </button>
                        )}
                    </aside>
                </div>
            </div>

            {pop && renderPop()}

            {/* =================================================
          ALL FILTERS DRAWER
      ================================================= */}
            {open &&
                createPortal(
                    <div className="cf-root" style={{ position: "relative", zIndex: 9999 }}>
                        <div
                            className="cf-ov"
                            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
                        >
                            <div className="cf-modal" role="dialog" aria-label="All filters">
                                <div className="cf-modal-head">
                                    <div>
                                        <h3>All filters</h3>
                                        <p>Refine your candidate search</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="cf-x"
                                        aria-label="Close"
                                        onClick={() => setOpen(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="cf-modal-body">
                                    <div className="cf-group">
                                        <h4 className="cf-h">Skills</h4>
                                        <div className="cf-chips">
                                            {SKILLS.map((s) => {
                                                const v = s.toLowerCase();
                                                return (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        className={`cf-chip ${filters.skills.includes(v) ? "on" : ""}`}
                                                        onClick={() => toggleSkill(v)}
                                                    >
                                                        {s}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <ChipGroup
                                        label="Experience"
                                        options={OPTIONS.experience}
                                        value={filters.experience}
                                        onPick={(v) => set({ experience: filters.experience === v ? "Any" : v })}
                                    />
                                    <ChipGroup
                                        label="Availability"
                                        options={OPTIONS.availability}
                                        value={filters.availability}
                                        onPick={(v) => set({ availability: filters.availability === v ? "Any" : v })}
                                    />
                                    <ChipGroup
                                        label="Education"
                                        options={OPTIONS.education}
                                        value={filters.education}
                                        onPick={(v) => set({ education: filters.education === v ? "Any" : v })}
                                    />

                                    <div className="cf-group">
                                        <h4 className="cf-h">Location</h4>
                                        <input
                                            className="cf-field"
                                            value={filters.location}
                                            onChange={(e) => set({ location: e.target.value })}
                                            placeholder="Search location..."
                                        />
                                        <div className="cf-chips cf-mt">
                                            {QUICK_LOCATIONS.map((l) => (
                                                <button
                                                    key={l}
                                                    type="button"
                                                    className={`cf-chip sm ${locationSelected(l) ? "on" : ""}`}
                                                    onClick={() => set({ location: locationSelected(l) ? "" : l })}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="cf-group">
                                        <h4 className="cf-h cf-between">
                                            <span>Minimum match</span>
                                            <b className="cf-pct">{filters.minMatch}%</b>
                                        </h4>
                                        <input
                                            className="cf-range"
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={filters.minMatch}
                                            onChange={(e) => set({ minMatch: Number(e.target.value) })}
                                            style={{ "--p": `${filters.minMatch}%` }}
                                        />
                                    </div>

                                    <ChipGroup
                                        label="Sort by"
                                        options={SORTS}
                                        value={filters.sort}
                                        onPick={(v) => set({ sort: v })}
                                    />
                                </div>

                                <div className="cf-modal-foot">
                                    <button type="button" className="cf-btn ghost" onClick={resetAll}>
                                        Clear all
                                    </button>
                                    <button type="button" className="cf-btn pri" onClick={() => setOpen(false)}>
                                        Show {shown} results
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}