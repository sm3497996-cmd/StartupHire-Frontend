import { useEffect, useMemo, useState } from "react";
import "./EmployerTeam.css";
import PendingInvites from "./PendingInvites";
import { API_PHP } from "../../config/env";
import { getStoredUser } from "../../utils/storage";
import { initialsOf } from "../../utils/initials";

const API_BASE = API_PHP;

/* =========================================================
   PERMISSIONS (same keys as ALL_PERMISSIONS in the backend)
========================================================= */

const PERMS = {
    manage_jobs: { label: "Manage Jobs", desc: "Post, edit, pause and close jobs", tone: "orange", icon: "brief" },
    view_applications: { label: "View Applications", desc: "See who applied to your jobs", tone: "blue", icon: "eye" },
    manage_applications: { label: "Manage Applications", desc: "Shortlist, select or reject candidates", tone: "pink", icon: "check" },
    view_candidates: { label: "View Candidates", desc: "Browse and search candidate profiles", tone: "violet", icon: "users" },
    manage_company_profile: { label: "Manage Company Profile", desc: "Edit company page, links and photos", tone: "green", icon: "building" },
};

const ALL = Object.keys(PERMS);

const ROLES = [
    { key: "admin", label: "Admin", desc: "Everything except team management", perms: ALL },
    {
        key: "recruiter",
        label: "Recruiter",
        desc: "Jobs, applications and candidates",
        perms: ["manage_jobs", "view_applications", "manage_applications", "view_candidates"],
    },
    { key: "viewer", label: "Viewer", desc: "View applications and candidates only", perms: ["view_applications", "view_candidates"] },
    { key: "custom", label: "Custom", desc: "Pick permissions yourself", perms: null },
];

const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
const roleOf = (perms = []) => ROLES.find((r) => r.perms && same(r.perms, perms)) || ROLES[3];

const roleLabel = (m) => {
    if (m.is_owner) return { key: "owner", label: "Owner" };
    if (!m.permissions.length) return { key: "none", label: "No access" };
    const r = roleOf(m.permissions);
    return { key: r.key, label: r.label };
};

/* =========================================================
   HELPERS
========================================================= */

const GRADS = [
    "linear-gradient(135deg,#3b82f6,#6366f1)",
    "linear-gradient(135deg,#ec4899,#fa7e1e)",
    "linear-gradient(135deg,#8b5cf6,#d946ef)",
    "linear-gradient(135deg,#06b6d4,#3b82f6)",
    "linear-gradient(135deg,#fa7e1e,#d62976)",
    "linear-gradient(135deg,#10b981,#14b8a6)",
];

const fmtDate = (s) => {
    if (!s) return "";
    const d = new Date(String(s).replace(" ", "T"));
    return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

/* =========================================================
   ICONS
========================================================= */

const PATHS = {
    brief: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
        </>
    ),
    eye: (
        <>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    check: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 3 3 5-6" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c.6-3.4 3-5 6.5-5s5.9 1.6 6.5 5" />
            <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.3c2 .5 3.2 2 3.5 4.7" />
        </>
    ),
    building: (
        <>
            <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" />
            <path d="M17 9h3a1 1 0 0 1 1 1v11M8 7h5M8 11h5M8 15h5" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </>
    ),
    search: (
        <>
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
        </>
    ),
    edit: (
        <>
            <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
            <path d="m13.5 6.5 4 4" />
        </>
    ),
    trash: (
        <>
            <path d="M4 7h16M10 11v6M14 11v6" />
            <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
        </>
    ),
    power: (
        <>
            <path d="M12 3v9" />
            <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
        </>
    ),
    tick: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    shield: (
        <>
            <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
    ),
};

const Ic = ({ n, s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {PATHS[n]}
    </svg>
);


/* =========================================================
   ROLE + PERMISSION PICKER (used for both invite and edit)
========================================================= */

function PermPicker({ value, onChange }) {
    const current = roleOf(value);
    const toggle = (p) => onChange(value.includes(p) ? value.filter((x) => x !== p) : [...value, p]);

    const pickRole = (r) => {
        if (r.perms) onChange([...r.perms]);
        else if (current.key !== "custom") onChange([]);
    };

    return (
        <div className="tm-picker">
            <p className="tm-label">Quick role</p>
            <div className="tm-roles">
                {ROLES.map((r) => (
                    <button
                        type="button"
                        key={r.key}
                        className={`tm-role-card r-${r.key} ${current.key === r.key ? "on" : ""}`}
                        onClick={() => pickRole(r)}
                    >
                        <b>{r.label}</b>
                        <small>{r.desc}</small>
                    </button>
                ))}
            </div>

            <p className="tm-label">
                Permissions <em>{value.length} of {ALL.length} selected</em>
            </p>
            <div className="tm-perms">
                {ALL.map((p) => {
                    const m = PERMS[p];
                    const on = value.includes(p);
                    return (
                        <button type="button" key={p} className={`tm-perm t-${m.tone} ${on ? "on" : ""}`} onClick={() => toggle(p)}>
                            <span className="tm-perm-ic">
                                <Ic n={m.icon} />
                            </span>
                            <span className="tm-perm-tx">
                                <b>{m.label}</b>
                                <small>{m.desc}</small>
                            </span>
                            <span className="tm-tick">{on && <Ic n="tick" s={13} />}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* =========================================================
   MAIN
========================================================= */

function EmployerTeam({ onToast }) {
    const me = useMemo(() => {
        try {
            return getStoredUser()?.id ?? null;
        } catch {
            return null;
        }
    }, []);

    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState([]);

    const [email, setEmail] = useState("");
    const [newPerms, setNewPerms] = useState(ROLES[1].perms); // default: Recruiter
    const [adding, setAdding] = useState(false);
    const [formError, setFormError] = useState("");

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");

    const [editFor, setEditFor] = useState(null);
    const [editPerms, setEditPerms] = useState([]);
    const [saving, setSaving] = useState(false);

    const [busyId, setBusyId] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const notify = (msg) => (onToast ? onToast(msg) : alert(msg));

    const post = async (body) => {
        try {
            const res = await fetch(`${API_BASE}/companies.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            return await res.json();
        } catch {
            return { success: false, message: "Could not reach the server." };
        }
    };

    const loadTeam = (silent = false) => {
        if (!silent) setLoading(true);
        return fetch(`${API_BASE}/companies.php?action=team`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setTeam(data.team);
                else notify(data.message || "Could not load team");
            })
            .catch(() => notify("Could not reach the server."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTeam();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- derived ---------- */
    const canManage = loading ? true : team.find((m) => m.user_id === me)?.is_owner ?? true;
    const activeCount = team.filter((m) => m.status === "active").length;
    const inactiveCount = team.length - activeCount;

    const shown = team.filter((m) => {
        if (filter === "active" && m.status !== "active") return false;
        if (filter === "inactive" && m.status === "active") return false;
        const q = query.trim().toLowerCase();
        return !q || `${m.name} ${m.email}`.toLowerCase().includes(q);
    });

    /* ---------- actions ---------- */
    const handleAdd = async (e) => {
        e.preventDefault();
        setFormError("");

        const mail = email.trim().toLowerCase();
        if (!isEmail(mail)) return setFormError("Enter a valid email address.");
        if (!newPerms.length) return setFormError("Select at least one permission or pick a role.");

        setAdding(true);
        const data = await post({ action: "send_invite", email: mail, permissions: newPerms });
        setAdding(false);

        if (data.success) {
            notify(`Invitation sent to ${mail}`);
            setEmail("");
            setNewPerms(ROLES[1].perms);
            loadTeam(true);
            setRefreshKey((k) => k + 1);
        } else {
            setFormError(data.message || "Could not send the invitation");
        }
    };

    const toggleStatus = async (m) => {
        setBusyId(m.user_id);
        const data = await post({ action: "toggle_status", member_user_id: m.user_id });
        setBusyId(null);
        notify(data.success ? (m.status === "active" ? "Member deactivated" : "Member activated") : data.message || "Could not update status");
        if (data.success) loadTeam(true);
    };

    const doRemove = async () => {
        const m = confirm;
        setBusyId(m.user_id);
        const data = await post({ action: "remove_member", member_user_id: m.user_id });
        setBusyId(null);
        setConfirm(null);
        notify(data.success ? "Team member removed" : data.message || "Could not remove member");
        if (data.success) loadTeam(true);
    };

    const startEdit = (m) => {
        setEditFor(m.user_id);
        setEditPerms([...m.permissions]);
    };

    const saveEdit = async () => {
        setSaving(true);
        const data = await post({ action: "update_permissions", member_user_id: editFor, permissions: editPerms });
        setSaving(false);
        notify(data.success ? "Permissions updated" : data.message || "Could not update permissions");
        if (data.success) {
            setEditFor(null);
            loadTeam(true);
        }
    };

    /* ---------- render ---------- */
    return (
        <section className="tm-page">
            {/* ===== Stats ===== */}
            <div className="tm-stats">
                <div className="tm-stat s-blue">
                    <span><Ic n="users" s={20} /></span>
                    <div><b>{team.length}</b><small>Total members</small></div>
                </div>
                <div className="tm-stat s-green">
                    <span><Ic n="shield" s={20} /></span>
                    <div><b>{activeCount}</b><small>Active</small></div>
                </div>
                <div className="tm-stat s-pink">
                    <span><Ic n="lock" s={20} /></span>
                    <div><b>{inactiveCount}</b><small>Inactive</small></div>
                </div>
            </div>

            {/* ===== Invite member ===== */}
            {canManage ? (
                <div className="tm-card tm-add">
                    <div className="tm-bar" />
                    <header className="tm-card-head">
                        <h3>Invite a team member</h3>
                        <p>
                            Your teammate must already have an <b>Employer account</b> on StartupHire. Enter their email and choose a role.
                            They will see the invitation in their dashboard and join your company once they accept.
                        </p>
                    </header>

                    <form onSubmit={handleAdd} noValidate>
                        <div className="tm-row">
                            <div className={`tm-input ${formError && !isEmail(email.trim()) ? "err" : ""}`}>
                                <Ic n="mail" />
                                <input
                                    type="email"
                                    placeholder="teammate@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFormError("");
                                    }}
                                />
                            </div>
                            <button type="submit" className="tm-btn pri" disabled={adding}>
                                <Ic n="mail" /> {adding ? "Sending..." : "Send Invite"}
                            </button>
                        </div>

                        {formError && <p className="tm-error">{formError}</p>}

                        <PermPicker value={newPerms} onChange={(v) => { setNewPerms(v); setFormError(""); }} />
                    </form>
                </div>
            ) : (
                <div className="tm-note">
                    <Ic n="lock" s={18} />
                    <p>Only the company owner can invite, edit or remove team members. You can view the team here.</p>
                </div>
            )}
            <PendingInvites refreshKey={refreshKey} onToast={onToast} />

            {/* ===== Members header ===== */}
            <div className="tm-head">
                <h3>
                    Team members <span>{team.length}</span>
                </h3>

                <div className="tm-tools">
                    <div className="tm-search">
                        <Ic n="search" />
                        <input placeholder="Search name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>

                    <div className="tm-tabs">
                        {[
                            ["all", "All", team.length],
                            ["active", "Active", activeCount],
                            ["inactive", "Inactive", inactiveCount],
                        ].map(([k, label, n]) => (
                            <button key={k} type="button" className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
                                {label} <b>{n}</b>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== List ===== */}
            {loading ? (
                <div className="tm-list">
                    {[1, 2].map((i) => (
                        <div className="tm-card tm-skel" key={i}>
                            <i /><i /><i />
                        </div>
                    ))}
                </div>
            ) : shown.length === 0 ? (
                <div className="tm-empty">
                    <span><Ic n="users" s={26} /></span>
                    <h4>{team.length === 0 ? "No team members yet" : "No members found"}</h4>
                    <p>
                        {team.length === 0
                            ? "Invite teammates above so they can work on your company's jobs and applications."
                            : "Try a different search or filter."}
                    </p>
                </div>
            ) : (
                <div className="tm-list">
                    {shown.map((m, idx) => {
                        const role = roleLabel(m);
                        const isMe = m.user_id === me;
                        const busy = busyId === m.user_id;

                        return (
                            <article key={m.membership_id} className={`tm-card tm-member ${m.status}`} style={{ animationDelay: `${idx * 60}ms` }}>
                                <div className="tm-top">
                                    <div className="tm-av" style={{ background: GRADS[m.user_id % GRADS.length] }}>
                                        {initialsOf(m.name)}
                                    </div>

                                    <div className="tm-who">
                                        <h4>
                                            {m.name}
                                            {isMe && <span className="tm-you">You</span>}
                                        </h4>
                                        <p>{m.email}</p>
                                        {m.added_on && <small>Added {fmtDate(m.added_on)}</small>}
                                    </div>

                                    <div className="tm-badges">
                                        <span className={`tm-role r-${role.key}`}>{role.label}</span>
                                        <span className={`tm-status ${m.status}`}>
                                            <i />
                                            {m.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* permissions */}
                                {editFor === m.user_id ? (
                                    <div className="tm-edit">
                                        <PermPicker value={editPerms} onChange={setEditPerms} />
                                        <div className="tm-actions">
                                            <button type="button" className="tm-btn ghost" onClick={() => setEditFor(null)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="tm-btn pri" onClick={saveEdit} disabled={saving}>
                                                {saving ? "Saving..." : "Save access"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="tm-chips">
                                            {m.is_owner ? (
                                                <span className="tm-chip t-full">
                                                    <Ic n="shield" s={13} /> Full access (all permissions)
                                                </span>
                                            ) : m.permissions.length === 0 ? (
                                                <span className="tm-chip t-none">No permissions assigned</span>
                                            ) : (
                                                m.permissions.map((p) => (
                                                    <span key={p} className={`tm-chip t-${PERMS[p]?.tone || "blue"}`}>
                                                        {PERMS[p]?.label || p}
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        {canManage && !m.is_owner && (
                                            <div className="tm-actions">
                                                <button type="button" className="tm-btn soft" onClick={() => startEdit(m)} disabled={busy}>
                                                    <Ic n="edit" s={15} /> Edit access
                                                </button>
                                                <button type="button" className="tm-btn soft" onClick={() => toggleStatus(m)} disabled={busy}>
                                                    <Ic n="power" s={15} /> {m.status === "active" ? "Deactivate" : "Activate"}
                                                </button>
                                                <button type="button" className="tm-btn danger" onClick={() => setConfirm(m)} disabled={busy}>
                                                    <Ic n="trash" s={15} /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            {/* ===== Confirm remove ===== */}
            {confirm && (
                <div className="tm-overlay" onClick={() => setConfirm(null)}>
                    <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="tm-modal-ic"><Ic n="trash" s={22} /></span>
                        <h4>Remove {confirm.name}?</h4>
                        <p>
                            They will lose access to your company's jobs and applications. To add them back, you will need to send a new
                            invitation to their email.
                        </p>
                        <div className="tm-actions">
                            <button type="button" className="tm-btn ghost" onClick={() => setConfirm(null)}>
                                Cancel
                            </button>
                            <button type="button" className="tm-btn dangerfill" onClick={doRemove}>
                                Yes, remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default EmployerTeam;