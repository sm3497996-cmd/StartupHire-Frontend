import { useEffect, useRef, useState } from "react";
import "./CompanyProfile.css";
import "./CompanyProfile.dark.css";
import "./CompanyProfileBlue.css";
import "./CompanyProfileBlue.dark.css";
import {
    ChipPicker, ContactLinksEditor, ContactLinksView,
    PERK_SUGGESTIONS, TECH_SUGGESTIONS, HIRING_SUGGESTIONS,
    socialsToLinks, linksToSocials, chipsToItems,
    sanitizeContact, validateContact,
} from "../../components/common/ProfileEditors";
import { LocationPicker, OfficeCard } from "../../components/common/LocationPicker";
import "./CompanyProfileLayout.css";
import "./CompanyProfileLayout.dark.css";
import { CompanyIcon as CPIcon } from "../../components/ui/Icon";
import { API_BASE, fromProp, resolveLogo } from "./companyHelpers";
import { BENEFITS, EMPTY_EXTRA, GALLERY, RATING_SPLIT, REVIEWS, TABS, TEAM, VALUES, emptyCompany } from "./companyData";
import { StatTile } from "./components/StatTile";
import { Stars } from "./components/Stars";

/* =========================================================
   Company Profile page (add-on for EmployerDashboard)
   Props:
     jobs         -> myJobs array from Employer component
     onEdit       -> (kept for backward compat, no longer used
                      to open the old static side panel — name/
                      location/website are now edited inline here)
     onPostJob    -> () => setActive("postjob")
     onViewJobs   -> () => setActive("myjobs")
     onToast      -> (msg) => setToast(msg)

   Name, location, website and the About text are now loaded
   from and saved to the real backend (routes/companies.php).
   Everything else on this page (facts, benefits, team, reviews,
   gallery) stays as showcase content since there's no database
   table for those yet.
   ========================================================= */

export default function CompanyProfile({
    company: companyProp,
    jobs = [],
    onPostJob,
    onViewJobs,
    onToast,
}) {
    const toast = (m) => onToast && onToast(m);

    const [tab, setTab] = useState("overview");
    const [following, setFollowing] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);
    const [coverTheme, setCoverTheme] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [ringReady, setRingReady] = useState(false);
    const [openStep, setOpenStep] = useState(0);
    const [extra, setExtra] = useState(EMPTY_EXTRA);
    const [editing, setEditing] = useState(null);
    const [draft, setDraft] = useState({});
    const coverInput = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/company_extra.php`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => d.success && setExtra({ ...EMPTY_EXTRA, ...d.extra }))
            .catch(() => { });
    }, []);

    const saveExtra = async (next, file) => {
        const fd = new FormData();
        fd.append("extra", JSON.stringify(next));
        if (file) fd.append("cover", file);
        try {
            const res = await fetch(`${API_BASE}/company_extra.php`, {
                method: "POST", credentials: "include", body: fd,
            });
            const data = await res.json();
            if (data.success) {
                setExtra({ ...EMPTY_EXTRA, ...data.extra });
                toast("Saved");
                return true;
            }
            toast(data.message || "Could not save");
        } catch (e) {
            toast("Could not reach the server.");
        }
        return false;
    };

    const onCoverChange = (e) => {
        const f = e.target.files?.[0];
        if (f) saveExtra(extra, f);
        e.target.value = "";
    };
    const removeCover = async () => {
        if (!window.confirm("Remove the cover image?")) return;
        const ok = await saveExtra({ ...extra, cover_url: "" });
        if (ok) toast("Cover removed");
    };

    // ---- Real company data from the backend ----
    const [loadingCompany, setLoadingCompany] = useState(!companyProp);
    const [company, setCompany] = useState(fromProp(companyProp) || emptyCompany);

    const [editingAbout, setEditingAbout] = useState(false);
    const [aboutDraft, setAboutDraft] = useState("");

    const [editingHeader, setEditingHeader] = useState(false);
    const [headerDraft, setHeaderDraft] = useState({ name: "", location: "", website: "" });
    const [savingHeader, setSavingHeader] = useState(false);

    const logoInput = useRef(null);
    const photoInput = useRef(null);
    const tabsRef = useRef(null);
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });

    const covers = [
        "linear-gradient(120deg,#3b22c9 0%,#5b3df5 45%,#e83f7d 100%)",
        "linear-gradient(120deg,#0b5cad 0%,#159fd8 50%,#12b86f 100%)",
        "linear-gradient(120deg,#1b1f3a 0%,#5b3df5 55%,#7d2ae8 100%)",
        "linear-gradient(120deg,#e83f7d 0%,#f7a51c 100%)",
    ];


    const activeJobs = jobs.filter((j) => j.status === "Active");
    const totalApplicants = jobs.reduce((s, j) => s + (j.applicants || 0), 0);
    const totalViews = jobs.reduce((s, j) => s + (j.views || 0), 0);

    // ---- Load real company profile on mount ----
    const loadCompany = () => {
        setLoadingCompany(true);
        fetch(`${API_BASE}/companies.php?action=profile`, {
            credentials: "include"
        })
            .then((r) => r.json())
            .then((data) => {
                console.log("Company profile API response:", data);

                if (data.success) {
                    setCompany(fromProp(data.company));
                } else {
                    toast(data.message || "Could not load company profile");
                }
            })
            .catch(() => toast("Could not reach the server."))
            .finally(() => setLoadingCompany(false));
    };

    useEffect(() => {
        if (companyProp) {
            setCompany(fromProp(companyProp));
            setLoadingCompany(false);
        }

        loadCompany();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyProp]);

    useEffect(() => {
        const t = setTimeout(() => setRingReady(true), 250);
        return () => clearTimeout(t);
    }, []);

    // sliding tab indicator
    useEffect(() => {
        const place = () => {
            const el = tabsRef.current?.querySelector(".cp-tab.active");
            if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
        };
        place();
        window.addEventListener("resize", place);
        return () => window.removeEventListener("resize", place);
    }, [tab]);

    useEffect(() => {
        return () => {
            if (logoUrl) URL.revokeObjectURL(logoUrl);
            photos.forEach((p) => URL.revokeObjectURL(p));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoUrl(URL.createObjectURL(file));
        toast("Logo updated (visual only for now)");
    };

    const onPhotosChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        toast(`${files.length} photo${files.length > 1 ? "s" : ""} added`);
    };

    // ---- Save "About" to the real backend ----
    const startEditAbout = () => {
        setAboutDraft(company.description);
        setEditingAbout(true);
    };

    const saveAbout = async () => {
        try {
            const res = await fetch(`${API_BASE}/companies.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update_profile", description: aboutDraft.trim() }),
            });
            const data = await res.json();

            if (data.success) {
                setCompany((c) => ({ ...c, description: aboutDraft.trim() }));
                setEditingAbout(false);
                toast("About section saved");
            } else {
                toast(data.message || "Could not save changes");
            }
        } catch (e) {
            toast("Could not reach the server.");
        }
    };

    // ---- Save name / location / website to the real backend ----
    const startEditHeader = () => {
        setHeaderDraft({
            name: company.name,
            location: company.location,
            website: company.website,
        });
        setEditingHeader(true);
    };
    const saveOffice = async (location) => {
        try {
            const res = await fetch(`${API_BASE}/companies.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update_profile", name: company.name, website: company.website, location }),
            });
            const data = await res.json();
            if (data.success) {
                setCompany((c) => ({ ...c, location }));
                toast("Office location saved");
                return true;
            }
            toast(data.message || "Could not save location");
        } catch (e) {
            toast("Could not reach the server.");
        }
        return false;
    };

    const saveHeader = async () => {
        setSavingHeader(true);
        try {
            const res = await fetch(`${API_BASE}/companies.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update_profile", ...headerDraft }),
            });
            const data = await res.json();

            if (data.success) {
                setCompany((c) => ({ ...c, ...headerDraft }));
                setEditingHeader(false);
                toast("Company details updated");
            } else {
                toast(data.message || "Could not save changes");
            }
        } catch (e) {
            toast("Could not reach the server.");
        } finally {
            setSavingHeader(false);
        }
    };

    const shareProfile = async () => {
        console.log("Company data:", company);
        if (!company.id) {
            toast("Company id not found");
            return;
        }
        const url = `${window.location.origin}/company/${company.id}`;
        const title = `${company.name || "Our company"} on StartupHire.in`;
        try {
            if (navigator.share) {
                await navigator.share({ title, text: title, url });
            } else {
                await navigator.clipboard.writeText(url);
                toast("Profile link copied");
            }
        } catch (e) {
            /* cancelled */
        }
    };
    const R = 46;
    const C = 2 * Math.PI * R;

    const shownLogo = logoUrl || resolveLogo(company.logo_url);
    const c = { ...company, ...(extra.facts || {}) };

    const checklist = [
        { label: "Company logo", weight: 15, done: !!shownLogo },
        { label: "Cover banner", weight: 15, done: !!extra.cover_url },
        { label: "About the company", weight: 15, done: !!c.description },
        { label: "Company facts", weight: 15, done: !!(c.industry && c.size && c.type) },
        { label: "Benefits & perks", weight: 15, done: extra.benefits.length > 0 },
        { label: "Contact & social links", weight: 15, done: !!(extra.email || extra.socials.length) },
        { label: "Tech stack", weight: 10, done: extra.tech.length > 0 },
    ];
    const completion = checklist.reduce((s, x) => s + (x.done ? x.weight : 0), 0);

    const startEdit = (id) => {
        const d = {
            mission: { mission: extra.mission, vision: extra.vision },
            facts: { tagline: c.tagline, industry: c.industry, size: c.size, type: c.type, founded: c.founded },
            benefits: { chips: extra.benefits.map((b) => b.title) },
            tech: { chips: extra.tech },
            steps: { chips: extra.steps.map((s) => s.title) },
            contact: { contact: { email: extra.email, phone: extra.phone, links: socialsToLinks(extra.socials) } },
        }[id];
        setDraft(d);
        setEditing(id);
    };

    const saveSection = async (id) => {
        const n = { ...extra };
        if (id === "mission") { n.mission = draft.mission; n.vision = draft.vision; }
        if (id === "facts") n.facts = { ...(extra.facts || {}), ...draft };
        if (id === "benefits") n.benefits = chipsToItems(draft.chips, extra.benefits);
        if (id === "tech") n.tech = draft.chips;
        if (id === "steps") n.steps = chipsToItems(draft.chips, extra.steps);
        if (id === "contact") {
            if (validateContact(draft.contact).any) { toast("Please fix the highlighted fields"); return; }
            const ct = sanitizeContact(draft.contact);
            n.email = ct.email;
            n.phone = ct.phone;
            n.socials = linksToSocials(ct.links);
        }
        if (await saveExtra(n)) setEditing(null);
    };

    const field = (label, key, rows, hint) => (
        <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{label}</label>
            {rows ? (
                <textarea rows={rows} value={draft[key] || ""} placeholder={hint}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
            ) : (
                <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }}
                    value={draft[key] || ""} placeholder={hint}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
            )}
        </div>
    );

    const empty = (
        <div className="cp-zero">
            <span><CPIcon name="plus" size={18} /></span>
            <p>Not added yet. Click <b>Edit</b> to add.</p>
        </div>
    );

    const sec = (id, title, view, form) => (
        <article className="cp-card">
            <header className="cp-card-head">
                <h3>{title}</h3>
                {editing !== id && (
                    <button className="cp-link-btn" onClick={() => startEdit(id)}>
                        <CPIcon name="edit" size={15} /> Edit
                    </button>
                )}
            </header>
            {editing === id ? (
                <div className="cp-edit-box">
                    {form}
                    <div className="cp-edit-actions">
                        <span></span>
                        <div>
                            <button className="cp-btn cp-btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                            <button className="cp-btn cp-btn-primary" onClick={() => saveSection(id)}>Save changes</button>
                        </div>
                    </div>
                </div>
            ) : view}
        </article>
    );
    const displayName = c.name || "Your Company";
    const displayTagline = c.tagline || "Add a tagline that describes what you do.";
    const displayIndustry = c.industry || "Add your industry";
    const displaySize = c.size ? `${c.size} employees` : "Add company size";
    const displayType = c.type || "Add company type";
    const displayFounded = c.founded || "Add year";
    const displayLocation = c.location || "Add your location";
    const displayWebsite = c.website || "Add your website";
    const displayAbout = c.description || "No description yet. Click \"Edit\" to introduce your company to candidates.";
    return (
        <section className="cp-page">
            {/* ================= HERO ================= */}
            <div className="cp-hero">
                <div
                    className="cp-cover"
                    style={
                        extra.cover_url
                            ? { backgroundImage: `url(${resolveLogo(extra.cover_url)})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : { background: covers[coverTheme] }
                    }
                >
                    {!extra.cover_url && (
                        <>
                            <span className="cp-blob b1"></span>
                            <span className="cp-blob b2"></span>
                            <span className="cp-blob b3"></span>
                            <span className="cp-grid-lines"></span>
                        </>
                    )}

                    <div className="cp-cover-tools">
                        {!extra.cover_url ? (
                            <div className="cp-swatches" title="Change cover colour">
                                {covers.map((cv, i) => (
                                    <button
                                        key={i}
                                        className={coverTheme === i ? "on" : ""}
                                        style={{ background: cv }}
                                        onClick={() => setCoverTheme(i)}
                                        aria-label={`Cover style ${i + 1}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <span></span>
                        )}

                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="cp-glass-btn" onClick={() => coverInput.current?.click()}>
                                <CPIcon name="camera" size={16} />
                                Change cover
                            </button>
                            {extra.cover_url && (
                                <button className="cp-glass-btn cp-glass-danger" onClick={removeCover}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 7h16M10 11v6M14 11v6" />
                                        <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
                                    </svg>
                                    Remove cover
                                </button>
                            )}
                            <button className="cp-glass-btn" onClick={startEditHeader}>
                                <CPIcon name="edit" size={16} />
                                Edit company
                            </button>
                            <input
                                ref={coverInput}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={onCoverChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="cp-hero-body">
                    <div className="cp-logo-wrap">
                        <div
                            className="cp-logo"
                            style={shownLogo ? { backgroundImage: `url(${shownLogo})` } : undefined}
                        >
                            {!shownLogo && (displayName ? displayName.slice(0, 2).toUpperCase() : "AT")}
                        </div>
                        <button
                            className="cp-logo-edit"
                            onClick={() => logoInput.current?.click()}
                            title="Upload logo"
                        >
                            <CPIcon name="camera" size={15} />
                        </button>
                        <input
                            ref={logoInput}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onLogoChange}
                        />
                    </div>

                    <div className="cp-identity">
                        {editingHeader ? (
                            <div className="cp-edit-box">
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Company name</label>
                                <input
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", marginBottom: 10, boxSizing: "border-box" }}
                                    value={headerDraft.name}
                                    onChange={(e) => setHeaderDraft({ ...headerDraft, name: e.target.value })}
                                    placeholder="Company name"
                                />
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Location</label>
                                <div style={{ marginBottom: 10 }}>
                                    <LocationPicker
                                        showMap={false}
                                        value={headerDraft.location}
                                        onChange={(v) => setHeaderDraft({ ...headerDraft, location: v })}
                                    />
                                </div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Website</label>
                                <input
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", marginBottom: 10, boxSizing: "border-box" }}
                                    value={headerDraft.website}
                                    onChange={(e) => setHeaderDraft({ ...headerDraft, website: e.target.value })}
                                    placeholder="https://example.com"
                                />
                                <div className="cp-edit-actions">
                                    <span></span>
                                    <div>
                                        <button className="cp-btn cp-btn-outline" onClick={() => setEditingHeader(false)}>
                                            Cancel
                                        </button>
                                        <button className="cp-btn cp-btn-primary" onClick={saveHeader} disabled={savingHeader}>
                                            {savingHeader ? "Saving..." : "Save changes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="cp-name-row">
                                    <h2>{loadingCompany ? "Loading…" : displayName}</h2>
                                    <span className="cp-verified" title="Verified employer">
                                        <CPIcon name="verified" size={22} />
                                    </span>
                                    <span className="cp-hiring-pill">
                                        <i></i> Hiring now
                                    </span>
                                </div>
                                <p className="cp-tagline">{displayTagline}</p>
                                <div className="cp-chips">
                                    <span><CPIcon name="pin" size={15} /> {displayLocation}</span>
                                    <span><CPIcon name="industry" size={15} /> {displayIndustry}</span>
                                    <span><CPIcon name="people" size={15} /> {displaySize}</span>

                                </div>
                            </>
                        )}
                    </div>

                    <div className="cp-hero-actions">

                        <button className="cp-btn cp-btn-outline" onClick={shareProfile}>
                            <CPIcon name="share" size={16} />
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= STATS ================= */}
            <div className="cp-stats">
                <StatTile icon="briefcase" label="Active jobs" value={activeJobs.length} note={`${jobs.length} posted in total`} tone="blue" />
                <StatTile icon="people" label="Total applicants" value={totalApplicants} note="Across all jobs" tone="purple" />
                <StatTile icon="eye" label="Job views" value={totalViews} note="Across all jobs" tone="pink" />
                <StatTile icon="bookmark" label="Closed / paused" value={jobs.length - activeJobs.length} note="Not currently open" tone="orange" />
            </div>

            {/* ================= TABS ================= */}
            <div className="cp-tabs" ref={tabsRef}>
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        className={`cp-tab ${tab === t.id ? "active" : ""}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                        {t.id === "jobs" && <em>{activeJobs.length}</em>}
                    </button>
                ))}
                <span
                    className="cp-tab-indicator"
                    style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
                />
            </div>

            <div className="cp-layout">
                {/* ================= MAIN COLUMN ================= */}
                <div className="cp-main" key={tab}>
                    {/* ---------- OVERVIEW ---------- */}
                    {tab === "overview" && (
                        <>
                            <article className="cp-card">
                                <header className="cp-card-head">
                                    <h3>About the company</h3>
                                    {!editingAbout && (
                                        <button className="cp-link-btn" onClick={startEditAbout}>
                                            <CPIcon name="edit" size={15} /> Edit
                                        </button>
                                    )}
                                </header>
                                {editingAbout ? (
                                    <div className="cp-edit-box">
                                        <textarea rows="5" value={aboutDraft} autoFocus onChange={(e) => setAboutDraft(e.target.value)} />
                                        <div className="cp-edit-actions">
                                            <span>{aboutDraft.length} / 600</span>
                                            <div>
                                                <button className="cp-btn cp-btn-outline" onClick={() => setEditingAbout(false)}>Cancel</button>
                                                <button className="cp-btn cp-btn-primary" onClick={saveAbout}>Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="cp-about">{displayAbout}</p>
                                )}
                            </article>

                            {sec("mission", "Mission & vision",
                                (extra.mission || extra.vision) ? (
                                    <div className="cp-mission">
                                        <div><b>Our mission</b><p>{extra.mission || "Not added yet."}</p></div>
                                        <div><b>Our vision</b><p>{extra.vision || "Not added yet."}</p></div>
                                    </div>
                                ) : empty,
                                <>
                                    {field("Our mission", "mission", 3)}
                                    {field("Our vision", "vision", 3)}
                                </>
                            )}

                            {sec("facts", "Company facts",
                                <div className="cp-facts">
                                    <div className="cp-fact"><span><CPIcon name="industry" size={18} /></span><div><small>Industry</small><strong>{displayIndustry}</strong></div></div>
                                    <div className="cp-fact"><span><CPIcon name="people" size={18} /></span><div><small>Company size</small><strong>{displaySize}</strong></div></div>
                                    <div className="cp-fact"><span><CPIcon name="calendar" size={18} /></span><div><small>Founded</small><strong>{displayFounded}</strong></div></div>
                                    <div className="cp-fact"><span><CPIcon name="pin" size={18} /></span><div><small>Headquarters</small><strong>{displayLocation}</strong></div></div>
                                    <div className="cp-fact"><span><CPIcon name="globe" size={18} /></span><div><small>Website</small><strong>{displayWebsite}</strong></div></div>
                                    <div className="cp-fact"><span><CPIcon name="briefcase" size={18} /></span><div><small>Company type</small><strong>{displayType}</strong></div></div>
                                </div>,
                                <>
                                    {field("Tagline", "tagline", 0, "One line about what you do")}
                                    {field("Industry", "industry", 0, "e.g. Business consulting")}
                                    {field("Company size", "size", 0, "e.g. 11-50")}
                                    {field("Company type", "type", 0, "e.g. Private Limited")}
                                    {field("Founded (year)", "founded", 0, "e.g. 2021")}
                                    <p style={{ fontSize: 12, opacity: 0.7 }}>Name, location aur website ke liye upar "Edit company" use karo.</p>
                                </>
                            )}

                            {sec("benefits", "Perks & benefits",
                                extra.benefits.length ? (
                                    <div className="cp-benefits">
                                        {extra.benefits.map((b, i) => (
                                            <div className="cp-benefit" key={i}>
                                                <span><CPIcon name="star" size={20} /></span>
                                                <strong>{b.title}</strong>
                                                <p>{b.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : empty,
                                <ChipPicker label="Perks & benefits" value={draft.chips || []} onChange={(v) => setDraft({ ...draft, chips: v })} suggestions={PERK_SUGGESTIONS} placeholder="Search or add a perk" />
                            )}

                            {sec("tech", "Tech & tools we use",
                                extra.tech.length ? <div className="cp-tags">{extra.tech.map((t) => <span key={t}>{t}</span>)}</div> : empty,
                                <ChipPicker label="Tech & tools" value={draft.chips || []} onChange={(v) => setDraft({ ...draft, chips: v })} suggestions={TECH_SUGGESTIONS} placeholder="Search or add a technology" />
                            )}

                            {sec("steps", "How we hire",
                                extra.steps.length ? (
                                    <ol className="cp-steps">
                                        {extra.steps.map((s, i) => (
                                            <li key={i} className={openStep === i ? "open" : ""} onClick={() => setOpenStep(i)}>
                                                <span className="cp-step-dot">{i + 1}</span>
                                                <div><strong>{s.title}</strong><p>{s.text}</p></div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : empty,
                                <ChipPicker label="Hiring steps (in order)" value={draft.chips || []} onChange={(v) => setDraft({ ...draft, chips: v })} suggestions={HIRING_SUGGESTIONS} placeholder="Search or add a step" />
                            )}
                        </>
                    )}

                    {/* ---------- OPEN ROLES ---------- */}
                    {tab === "jobs" && (
                        <article className="cp-card">
                            <header className="cp-card-head">
                                <h3>Open roles at {displayName}</h3>
                                <button className="cp-btn cp-btn-primary" onClick={onPostJob}>
                                    <CPIcon name="plus" size={16} /> Post a job
                                </button>
                            </header>

                            {jobs.length === 0 ? (
                                <div className="cp-empty">
                                    <strong>No roles yet</strong>
                                    <p>Post your first job so candidates can find your team.</p>
                                </div>
                            ) : (
                                <div className="cp-jobs">
                                    {jobs.map((j) => (
                                        <div className="cp-job" key={j.id}>
                                            <span
                                                className="cp-job-logo"
                                                style={{ background: `linear-gradient(135deg, ${j.color}, ${j.color}99)` }}
                                            >
                                                {j.title.charAt(0)}
                                            </span>
                                            <div className="cp-job-info">
                                                <strong>{j.title}</strong>
                                                <span>
                                                    {j.location} · {j.type} · {j.salary}
                                                </span>
                                            </div>
                                            <div className="cp-job-side">
                                                <span className={`cp-status cp-status-${j.status.toLowerCase()}`}>
                                                    {j.status}
                                                </span>
                                                <small>{j.applicants} applicants</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {jobs.length > 0 && (
                                <button className="cp-wide-btn" onClick={onViewJobs}>
                                    Manage all jobs <CPIcon name="arrow" size={16} />
                                </button>
                            )}
                        </article>
                    )}

                    {/* ---------- CULTURE ---------- */}
                    {tab === "culture" && (
                        <>
                            <article className="cp-card">
                                <header className="cp-card-head">
                                    <h3>What we value</h3>
                                </header>
                                <div className="cp-values">
                                    {VALUES.map((v) => (
                                        <div className="cp-value" key={v.title}>
                                            <span>{v.emoji}</span>
                                            <div>
                                                <strong>{v.title}</strong>
                                                <p>{v.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="cp-card">
                                <header className="cp-card-head">
                                    <h3>Life at {displayName}</h3>
                                    <button className="cp-link-btn" onClick={() => photoInput.current?.click()}>
                                        <CPIcon name="upload" size={15} /> Add photos
                                    </button>
                                    <input
                                        ref={photoInput}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={onPhotosChange}
                                    />
                                </header>

                                <div className="cp-gallery">
                                    {GALLERY.map((g) => (
                                        <figure
                                            key={g.label}
                                            className={g.tall ? "tall" : ""}
                                            style={{ background: g.g }}
                                        >
                                            <figcaption>{g.label}</figcaption>
                                        </figure>
                                    ))}
                                    {photos.map((src, i) => (
                                        <figure key={src} style={{ backgroundImage: `url(${src})` }}>
                                            <figcaption>Photo {i + 1}</figcaption>
                                        </figure>
                                    ))}
                                    <button className="cp-add-photo" onClick={() => photoInput.current?.click()}>
                                        <CPIcon name="camera" size={22} />
                                        <span>Add office photo</span>
                                    </button>
                                </div>
                            </article>

                            <article className="cp-card">
                                <header className="cp-card-head">
                                    <h3>Perks &amp; benefits</h3>
                                </header>
                                <div className="cp-benefits">
                                    {BENEFITS.map((b) => (
                                        <div className="cp-benefit" key={b.title}>
                                            <span><CPIcon name={b.icon} size={20} /></span>
                                            <strong>{b.title}</strong>
                                            <p>{b.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </>
                    )}

                    {/* ---------- TEAM ---------- */}
                    {tab === "team" && (
                        <article className="cp-card">
                            <header className="cp-card-head">
                                <h3>Meet the team</h3>
                                <p>The people you'll work with</p>
                            </header>
                            <div className="cp-team">
                                {TEAM.map((m) => (
                                    <div className="cp-member" key={m.name}>
                                        <span
                                            className="cp-member-avatar"
                                            style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}aa)` }}
                                        >
                                            {m.initials}
                                        </span>
                                        <strong>{m.name}</strong>
                                        <small>{m.role}</small>
                                        <button onClick={() => toast(`Message sent to ${m.name.split(" ")[0]}`)}>
                                            <CPIcon name="mail" size={15} /> Say hi
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cp-departments">
                                {[
                                    { n: "Engineering", v: 24 },
                                    { n: "Design", v: 8 },
                                    { n: "Marketing", v: 6 },
                                    { n: "Operations", v: 5 },
                                ].map((d) => (
                                    <div key={d.n}>
                                        <div className="cp-dept-top">
                                            <span>{d.n}</span>
                                            <b>{d.v}</b>
                                        </div>
                                        <div className="cp-bar"><i style={{ width: ringReady ? `${(d.v / 24) * 100}%` : 0 }}></i></div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    )}

                    {/* ---------- REVIEWS ---------- */}
                    {tab === "reviews" && (
                        <>
                            <article className="cp-card cp-rating-card">
                                <div className="cp-rating-big">
                                    <strong>4.6</strong>
                                    <Stars value={4.6} size={18} />
                                    <small>128 employee reviews</small>
                                </div>
                                <div className="cp-rating-bars">
                                    {RATING_SPLIT.map((r) => (
                                        <div key={r.star}>
                                            <span>{r.star}</span>
                                            <div className="cp-bar"><i style={{ width: ringReady ? `${r.pct}%` : 0 }}></i></div>
                                            <em>{r.pct}%</em>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <div className="cp-reviews">
                                {REVIEWS.map((r, i) => (
                                    <article className="cp-card cp-review" key={i}>
                                        <div className="cp-review-top">
                                            <div>
                                                <strong>{r.name}</strong>
                                                <small>{r.role}</small>
                                            </div>
                                            <Stars value={r.rating} />
                                        </div>
                                        <p>{r.text}</p>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ================= SIDE COLUMN ================= */}
                <aside className="cp-side">
                    <div className="cp-card cp-complete">
                        <header className="cp-card-head">
                            <h3>Profile strength</h3>
                        </header>

                        <div className="cp-ring-row">
                            <div className="cp-ring">
                                <svg viewBox="0 0 110 110">
                                    <defs>
                                        <linearGradient id="cpRing" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#5b3df5" />
                                            <stop offset="100%" stopColor="#e83f7d" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="55" cy="55" r={R} className="cp-ring-bg" />
                                    <circle
                                        cx="55"
                                        cy="55"
                                        r={R}
                                        className="cp-ring-fg"
                                        strokeDasharray={C}
                                        strokeDashoffset={ringReady ? C * (1 - completion / 100) : C}
                                    />
                                </svg>
                                <b>{completion}%</b>
                            </div>
                            <p>
                                Complete profiles get up to <strong>3× more</strong> applications.
                            </p>
                        </div>

                        <ul className="cp-checklist">
                            {checklist.map((c) => (
                                <li key={c.label} className={c.done ? "done" : ""}>
                                    <span>{c.done && <CPIcon name="check" size={12} />}</span>
                                    {c.label}
                                    {!c.done && <em>+{c.weight}%</em>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <article className="cp-card">
                        <header className="cp-card-head">
                            <h3>Contact & links</h3>
                            {editing !== "contact" && (
                                <button className="cp-link-btn" onClick={() => startEdit("contact")}>
                                    <CPIcon name="edit" size={15} /> Edit
                                </button>
                            )}
                        </header>
                        {editing === "contact" ? (
                            <div className="cp-edit-box">
                                <ContactLinksEditor compact value={draft.contact} onChange={(v) => setDraft({ ...draft, contact: v })} />
                                <div className="cp-edit-actions">
                                    <span></span>
                                    <div>
                                        <button className="cp-btn cp-btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                                        <button className="cp-btn cp-btn-primary" onClick={() => saveSection("contact")}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <ContactLinksView
                                contact={{
                                    email: extra.email,
                                    phone: extra.phone,
                                    links: [
                                        ...(c.website ? [{ id: "w", type: "website", url: c.website }] : []),
                                        ...socialsToLinks(extra.socials),
                                    ],
                                }}
                            />
                        )}
                    </article>

                    <OfficeCard location={company.location} onSave={saveOffice} />
                </aside>
            </div>
        </section>
    );
}