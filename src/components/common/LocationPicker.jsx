import { useEffect, useRef, useState } from "react";
import "./LocationPicker.css";

/* =========================================================
   LOCATION PICKER
   - Type karo -> suggestions (OpenStreetMap search, free, no key)
   - "Use my current location" -> browser GPS + reverse geocode
   - Neeche Google Map ka live preview
========================================================= */

const NOM = "https://nominatim.openstreetmap.org";

/* address ko chhota readable label me badlo: "Road, Area, City, State" */
const labelFrom = (item) => {
    const a = item?.address || {};
    const parts = [
        a.road || a.pedestrian,
        a.neighbourhood || a.suburb,
        a.city || a.town || a.village || a.county,
        a.state,
    ].filter(Boolean);
    const uniq = parts.filter((p, i) => parts.indexOf(p) === i);
    return uniq.length >= 2 ? uniq.join(", ") : item?.display_name || "";
};

function useDebounced(value, ms) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), ms);
        return () => clearTimeout(t);
    }, [value, ms]);
    return v;
}

const Pin = ({ s = 18 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);

const Target = ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
);

/* =========================================================
   MAP EMBED  (Google Maps, API key ki zarurat nahi)
========================================================= */

export function MapEmbed({ query, height = 190 }) {
    const q = String(query || "").trim();

    if (!q) {
        return (
            <div className="lp-map empty" style={{ height }}>
                <span><Pin s={24} /></span>
                <p>Add your office location to show it on the map</p>
            </div>
        );
    }

    const src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

    return (
        <div className="lp-map" style={{ height }}>
            <iframe
                key={q}
                title="Office location"
                src={src}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            <a className="lp-open" href={link} target="_blank" rel="noopener noreferrer">
                Open in Google Maps ↗
            </a>
        </div>
    );
}

/* =========================================================
   LOCATION PICKER
   value    -> string
   onChange -> (string) => void
========================================================= */

export function LocationPicker({
    value = "",
    onChange,
    showMap = true,
    country = "in", // "" = poori duniya
    placeholder = "Search area, city or full address",
}) {
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [hi, setHi] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const typed = useRef(false); // suggestions sirf user ke type karne par
    const req = useRef(0);
    const mapQuery = useDebounced(value, 800);

    /* ---------- suggestions ---------- */
    useEffect(() => {
        if (!typed.current) return;

        const q = String(value).trim();
        if (q.length < 3) {
            setList([]);
            return;
        }

        const id = ++req.current;
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const url =
                    `${NOM}/search?format=jsonv2&addressdetails=1&limit=5&accept-language=en` +
                    (country ? `&countrycodes=${country}` : "") +
                    `&q=${encodeURIComponent(q)}`;
                const r = await fetch(url);
                const d = await r.json();
                if (id === req.current) {
                    setList(Array.isArray(d) ? d : []);
                    setHi(-1);
                }
            } catch {
                if (id === req.current) setList([]);
            }
            if (id === req.current) setLoading(false);
        }, 500);

        return () => clearTimeout(t);
    }, [value, country]);

    const onType = (e) => {
        typed.current = true;
        setErr("");
        setOpen(true);
        onChange(e.target.value);
    };

    const pick = (item) => {
        typed.current = false;
        onChange(labelFrom(item));
        setList([]);
        setOpen(false);
    };

    const clear = () => {
        typed.current = false;
        setList([]);
        setErr("");
        onChange("");
    };

    const onKey = (e) => {
        if (!open || !list.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((i) => Math.min(i + 1, list.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && hi >= 0) {
            e.preventDefault();
            pick(list[hi]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    /* ---------- current location ---------- */
    const useCurrent = () => {
        if (!navigator.geolocation) {
            setErr("Your browser does not support location.");
            return;
        }

        setBusy(true);
        setErr("");
        typed.current = false;

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;
                const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

                try {
                    const r = await fetch(
                        `${NOM}/reverse?format=jsonv2&addressdetails=1&zoom=17&accept-language=en&lat=${latitude}&lon=${longitude}`
                    );
                    const d = await r.json();
                    onChange(labelFrom(d) || fallback);
                } catch {
                    onChange(fallback);
                }

                setList([]);
                setOpen(false);
                setBusy(false);
            },
            (e) => {
                setBusy(false);
                setErr(
                    e.code === 1
                        ? "Location permission is blocked. Allow it from the lock icon in the address bar."
                        : "Could not get your location. Try again or type it."
                );
            },
            { enableHighAccuracy: true, timeout: 12000 }
        );
    };

    return (
        <div className="lp">
            <div className="lp-box">
                <Pin />
                <input
                    value={value}
                    placeholder={placeholder}
                    onChange={onType}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 160)}
                    onKeyDown={onKey}
                />
                {loading && <i className="lp-spin" />}
                {value && (
                    <button type="button" className="lp-clear" aria-label="Clear location" onClick={clear}>
                        ×
                    </button>
                )}
            </div>

            {open && list.length > 0 && (
                <ul className="lp-list">
                    {list.map((it, i) => (
                        <li key={it.place_id}>
                            <button
                                type="button"
                                className={hi === i ? "on" : ""}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => pick(it)}
                            >
                                <Pin s={16} />
                                <span>
                                    <b>{it.name || String(it.display_name).split(",")[0]}</b>
                                    <small>{it.display_name}</small>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <button type="button" className="lp-cur" onClick={useCurrent} disabled={busy}>
                <Target /> {busy ? "Finding your location..." : "Use my current location"}
            </button>

            {err && <p className="lp-err">{err}</p>}

            {showMap && <MapEmbed query={mapQuery} height={170} />}
        </div>
    );
}

/* =========================================================
   OFFICE CARD  ("Our office"  -  map + Edit)
   onSave(location) -> Promise<boolean>  (Companyprofile me define hota hai)
========================================================= */

export function OfficeCard({ location, onSave, title = "Our office" }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const [saving, setSaving] = useState(false);

    const start = () => {
        setDraft(location || "");
        setEditing(true);
    };

    const save = async () => {
        setSaving(true);
        const ok = await onSave(draft.trim());
        setSaving(false);
        if (ok) setEditing(false);
    };

    return (
        <div className="cp-card">
            <header className="cp-card-head">
                <h3>{title}</h3>
                {!editing && (
                    <button className="cp-link-btn" onClick={start}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
                            <path d="m13.5 6.5 4 4" />
                        </svg>{" "}
                        Edit
                    </button>
                )}
            </header>

            {editing ? (
                <div className="cp-edit-box">
                    <LocationPicker value={draft} onChange={setDraft} />
                    <div className="cp-edit-actions">
                        <span></span>
                        <div>
                            <button className="cp-btn cp-btn-outline" onClick={() => setEditing(false)}>
                                Cancel
                            </button>
                            <button className="cp-btn cp-btn-primary" onClick={save} disabled={saving}>
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <MapEmbed query={location} />
                    <p className="cp-address">{location || "Add your location"}</p>
                </>
            )}
        </div>
    );
}