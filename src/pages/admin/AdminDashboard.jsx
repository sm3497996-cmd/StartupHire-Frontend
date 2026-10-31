import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminDashboard.css";
import { AdminIcon as Icon } from "../../components/ui/Icon";
import { API_BASE, USERS_API } from "../../services/adminService";
import { CHART, COLORS, EVENT_TEXT, NAV } from "./adminData";
import { timeAgoFromTs } from "../../utils/date";
import { Avatar } from "./components/Avatar";
import { AdminLogin } from "./AdminLogin";
import { API_LARAVEL } from "../../config/env";
import { useTheme } from "../../hooks/useTheme";
import OverviewSection from "./sections/OverviewSection";
import LiveSection from "./sections/LiveSection";
import UsersSection from "./sections/UsersSection";
import JobsSection from "./sections/JobsSection";
import ActivitySection from "./sections/ActivitySection";
import SettingsSection from "./sections/SettingsSection";
/* =========================================================
   MAIN
   ========================================================= */
export default function AdminDashboard({ onExit }) {
    const navigate = useNavigate();
    const { section } = useParams();
    const active = section || "overview";
    const setActive = (id) => navigate(id === "overview" ? "/admin" : `/admin/${id}`);

    const [authed, setAuthed] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [adminName, setAdminName] = useState("Super Admin");

    const { isDark: dark, setDark } = useTheme();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [chart, setChart] = useState(CHART);

    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_BASE}/admin_data.php`, { credentials: "include" });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Failed to load data");

            const toMs = (s) => (s ? new Date(String(s).replace(" ", "T")).getTime() : null);
            const cap = (r) => (r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : "Candidate");
            const typeMap = { login_success: "login", login_failed: "failed", login_blocked: "blocked", logout: "logout" };

            setUsers(
                data.users.map((u, i) => {
                    const created = toMs(u.created_at);
                    return {
                        id: Number(u.id),
                        name: u.name,
                        email: u.email,
                        phone: u.phone || "-",
                        role: cap(u.role),
                        is_active: Number(u.is_active),
                        blocked: Number(u.is_active) === 0,
                        online: Number(u.online) === 1 && Number(u.is_active) === 1,
                        verified: Number(u.is_verified) === 1,
                        joined: created ? Math.max(0, Math.floor((Date.now() - created) / 86400000)) : 0,
                        initials: u.name ? u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "U",
                        color: COLORS[i % COLORS.length],
                        city: "-",
                        device: "-",
                        ip: u.last_ip || "-",
                        count: String(u.role).toLowerCase() === "employer" ? Number(u.jobs_posted) : Number(u.applied),
                        logins: Number(u.logins),
                        lastActive: toMs(u.last_active) || created || Date.now(),
                    };
                })
            );

            setEvents(
                data.events
                    .filter((e) => typeMap[e.action])
                    .map((e) => ({
                        id: Number(e.id),
                        userId: Number(e.user_id),
                        type: typeMap[e.action],
                        ts: toMs(e.created_at),
                        ip: e.ip_address || "-",
                    }))
            );
            if (data.chart) setChart(data.chart);

            setJobs(
                data.jobs.map((j, i) => ({
                    id: Number(j.id),
                    title: j.title,
                    company: j.poster_name || "-",
                    city: j.city || j.location || "-",
                    status: j.status || "Live",
                    color: COLORS[i % COLORS.length],
                    applicants: Number(j.applicants),
                }))
            );
        } catch (error) {
            console.error("Admin data error:", error);
        } finally {
            setUsersLoading(false);
        }
    };
    (() => {
        if (!authed) return;

        loadUsers();
    }, [authed]);

    const [now, setNow] = useState(Date.now());
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [evFilter, setEvFilter] = useState("All");
    const [range, setRange] = useState("24h");
    const [selectedId, setSelectedId] = useState(null);
    const [notifOpen, setNotifOpen] = useState(false);
    const [toast, setToast] = useState("");
    const [settings, setSettings] = useState({ signups: true, verify: true, maintenance: false, alerts: true });

    const usersRef = useRef(users);
    usersRef.current = users;

    // On mount, ask the backend if we already have a valid
    // superadmin session (e.g. after a page refresh) instead
    // of trusting a local flag.
    useEffect(() => {
        let cancelled = false;

        fetch(`${API_BASE}/me.php`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.success && data.user && data.user.role === "superadmin") {
                    setAuthed(true);
                    setAdminName(data.user.name || "Super Admin");
                }
            })
            .catch(() => { /* not logged in / server unreachable — stay on login gate */ })
            .finally(() => {
                if (!cancelled) setCheckingSession(false);
            });

        return () => { cancelled = true; };
    }, []);

    const login = (user) => {
        setAuthed(true);
        setAdminName(user.name || "Super Admin");
    };

    const logout = () => {
        fetch(`${API_BASE}/logout.php`, { method: "POST", credentials: "include" }).catch(() => { });
        setAuthed(false);
        navigate("/admin");
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 2600);
        return () => clearTimeout(t);
    }, [toast]);

    /* simulated live logins — replace with websocket / polling from your API */
    useEffect(() => {
        if (!authed) return;
        const t = setInterval(() => {
            setNow(Date.now());
            loadUsers();
        }, 5000);
        return () => clearInterval(t);
    }, [authed]);

    const [score, setScore] = useState(null);

    useEffect(() => {
        const u = users.find((x) => x.id === selectedId);
        if (!u || String(u.role).toLowerCase() !== "candidate") {
            setScore(null);
            return;
        }
        fetch(`${API_LARAVEL}/admin/candidate-score/${u.id}`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => setScore(d.success ? d : null))
            .catch(() => setScore(null));
    }, [selectedId, users]);

    useEffect(() => {
        const u = users.find((x) => x.id === selectedId);
        if (!u || String(u.role).toLowerCase() !== "candidate") {
            setScore(null);
            return;
        }
        fetch(`${API_LARAVEL}/admin/candidate-score/${u.id}`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => setScore(d.success ? d : null))
            .catch(() => setScore(null));
    }, [selectedId, users]);

    if (checkingSession) {
        return (
            <div className={`sa-app ${dark ? "dark" : ""}`}>
                <div className="sa-gate">
                    <p style={{ color: "#94a3b8" }}>Checking session…</p>
                </div>
            </div>
        );
    }

    if (!authed) {
        return (
            <div className={`sa-app ${dark ? "dark" : ""}`}>
                <AdminLogin onSuccess={login} onBack={onExit || (() => navigate("/"))} />
            </div>
        );
    }

    const byId = (id) => users.find((u) => u.id === id);
    const online = users.filter((u) => u.online);
    const employers = users.filter((u) => u.role === "Employer");
    const candidates = users.filter((u) => u.role === "Candidate");
    const blocked = users.filter((u) => u.blocked);
    const selected = selectedId ? byId(selectedId) : null;

    const addEvent = (userId, type) =>
        setEvents((prev) => [{ id: Date.now() + Math.random(), userId, type, ts: Date.now(), ip: "—" }, ...prev].slice(0, 60));

    const forceLogout = async (id) => {
        try {
            const fd = new FormData();
            fd.append("action", "force_logout");
            fd.append("user_id", id);
            const r = await fetch(`${API_BASE}/admin_data.php`, { method: "POST", body: fd, credentials: "include" });
            const d = await r.json();
            if (!d.success) {
                setToast(d.message || "Could not log out user");
                return;
            }
            setUsers((p) => p.map((u) => (u.id === id ? { ...u, online: false, lastActive: Date.now() } : u)));
            addEvent(id, "forced");
            setToast("User will be logged out within 30 seconds");
        } catch {
            setToast("Server error");
        }
    };
    const toggleBlock = async (id) => {
        const u = byId(id);
        try {
            const fd = new FormData();
            fd.append("action", "toggle_active");
            fd.append("user_id", id);
            const r = await fetch(USERS_API, { method: "POST", body: fd, credentials: "include" });
            const d = await r.json();
            if (!d.success) {
                setToast(d.message || "Could not update user");
                return;
            }
            setUsers((p) => p.map((x) => (x.id === id ? { ...x, blocked: !x.blocked, online: false } : x)));
            if (!u.blocked) addEvent(id, "blocked");
            setToast(u.blocked ? "User unblocked" : "User blocked");
        } catch {
            setToast("Server error");
        }
    };
    const verifyUser = async (id) => {
        try {
            const fd = new FormData();
            fd.append("action", "verify_user");
            fd.append("user_id", id);
            const r = await fetch(`${API_BASE}/admin_data.php`, { method: "POST", body: fd, credentials: "include" });
            const d = await r.json();
            if (!d.success) {
                setToast(d.message || "Could not verify");
                return;
            }
            setUsers((p) => p.map((u) => (u.id === id ? { ...u, verified: true } : u)));
            addEvent(id, "verified");
            setToast("User verified");
        } catch {
            setToast("Server error");
        }
    };
    const setJobStatus = async (id, status) => {
        try {
            const fd = new FormData();
            fd.append("action", "set_job_status");
            fd.append("job_id", id);
            fd.append("status", status);
            const r = await fetch(`${API_BASE}/admin_data.php`, { method: "POST", body: fd, credentials: "include" });
            const d = await r.json();
            if (!d.success) {
                setToast(d.message || "Could not update job");
                return;
            }
            setJobs((p) => p.map((j) => (j.id === id ? { ...j, status } : j)));
            setToast(status === "Live" ? "Job approved" : status === "Removed" ? "Job removed" : "Job updated");
        } catch {
            setToast("Server error");
        }
    };

    const q = search.toLowerCase();
    const filteredUsers = users.filter((u) => {
        const matchText = `${u.name} ${u.email} ${u.city}`.toLowerCase().includes(q);
        const matchFilter =
            filter === "All" ||
            (filter === "Online" && u.online) ||
            (filter === "Offline" && !u.online) ||
            (filter === "Candidates" && u.role === "Candidate") ||
            (filter === "Employers" && u.role === "Employer") ||
            (filter === "Blocked" && u.blocked);
        return matchText && matchFilter;
    });

    const filteredEvents = events.filter((e) => {
        const u = byId(e.userId);
        const matchText = u ? u.name.toLowerCase().includes(q) : true;
        const matchType = evFilter === "All" || e.type === evFilter;
        return matchText && matchType;
    });

    const pendingJobs = jobs.filter((j) => j.status === "Pending" || j.status === "Flagged").length;
    const alerts = events.filter((e) => e.type === "failed" || e.type === "blocked").length;

    const titles = {
        overview: "Overview",
        live: "Live now",
        users: "All users",
        jobs: "Job moderation",
        activity: "Login activity",
        settings: "Settings",
    };

    /* ---------- reusable pieces ---------- */
    const StatusBadge = ({ u }) =>
        u.blocked ? (
            <span className="sa-status blocked">Blocked</span>
        ) : u.online ? (
            <span className="sa-status online"><i></i>Online</span>
        ) : (
            <span className="sa-status offline">Offline</span>
        );

    const FeedItem = ({ e }) => {
        const u = byId(e.userId);
        if (!u) return null;
        return (
            <article key={e.id} className={`sa-post type-${e.type}`}>
                <button className="sa-post-head" onClick={() => setSelectedId(u.id)}>
                    <Avatar u={u} size={42} ring={u.online} />
                    <div>
                        <strong>{u.name}</strong>
                        <span>{u.role} · {u.city}</span>
                    </div>
                    <time>{timeAgoFromTs(e.ts, now)}</time>
                </button>
                <div className="sa-post-body">
                    <span className={`sa-event-icon ev-${e.type}`}>
                        <Icon
                            name={e.type === "failed" ? "alert" : e.type === "blocked" || e.type === "forced" ? "ban" : e.type === "logout" ? "logout" : e.type === "signup" ? "user" : e.type === "verified" ? "verified" : "lock"}
                            size={18}
                        />
                    </span>
                    <p><b>{u.name}</b> {EVENT_TEXT[e.type]}</p>
                </div>
                <div className="sa-post-meta">
                    <span><Icon name="device" size={14} /> {u.device}</span>
                    <span><Icon name="pin" size={14} /> {u.city}</span>
                </div>
            </article>
        );
    };

    const UserCard = ({ u }) => (
        <article key={u.id} className={`sa-user-card ${u.blocked ? "is-blocked" : ""}`}>
            <div className="sa-user-top">
                <Avatar u={u} size={58} ring={u.online} live />
                <div className="sa-user-title">
                    <strong>
                        {u.name}
                        {u.verified && <span className="sa-check" title="Verified"><Icon name="verified" size={16} /></span>}
                    </strong>
                    <span>{u.role} · {u.city}</span>
                </div>
                {StatusBadge({ u })}
            </div>

            <div className="sa-user-stats">
                <div><b>{u.logins}</b><span>Logins</span></div>
                <div><b>{u.count}</b><span>{u.role === "Employer" ? "Jobs" : "Applied"}</span></div>
                <div><b>{u.joined}d</b><span>Member</span></div>
            </div>

            <p className="sa-user-seen">
                <Icon name="clock" size={14} />
                {u.online ? "Active right now" : `Last seen ${timeAgoFromTs(u.lastActive, now)}`}
            </p>

            <div className="sa-user-actions">
                <button className="sa-btn sa-btn-soft" onClick={() => setSelectedId(u.id)}>
                    <Icon name="eye" size={16} /> View
                </button>
                {u.online && !u.blocked ? (
                    <button className="sa-btn sa-btn-ghost" onClick={() => forceLogout(u.id)}>
                        <Icon name="logout" size={16} /> Log out
                    </button>
                ) : (
                    <button className={`sa-btn ${u.blocked ? "sa-btn-ghost" : "sa-btn-danger-soft"}`} onClick={() => toggleBlock(u.id)}>
                        <Icon name="ban" size={16} /> {u.blocked ? "Unblock" : "Block"}
                    </button>
                )}
            </div>
        </article>
    );

    /* ---------- views ---------- */






    /* ---------- user sheet ---------- */
    const userEvents = selected ? events.filter((e) => e.userId === selected.id).slice(0, 5) : [];

    return (
        <div className={`sa-app ${dark ? "dark" : ""}`}>
            {/* TOPBAR */}
            <header className="sa-topbar">
                <div className="sa-brand">
                    <span className="sa-brand-mark"><Icon name="shield" size={18} /></span>
                    <span className="sa-brand-text">Startup<b>Hire</b><i>.</i></span>
                    <em>Admin</em>
                </div>

                <div className="sa-search">
                    <Icon name="search" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => active === "overview" && setActive("users")}
                        placeholder="Search users, emails or cities"
                        aria-label="Search"
                    />
                </div>

                <div className="sa-top-actions">
                    <button className="sa-icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
                        <Icon name={dark ? "sun" : "moon"} size={19} />
                    </button>
                    <div className="sa-notif-wrap">
                        <button className="sa-icon-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Alerts">
                            <Icon name="bell" size={19} />
                            {alerts > 0 && <span className="sa-badge">{alerts}</span>}
                        </button>
                        {notifOpen && (
                            <div className="sa-dropdown">
                                <div className="sa-drop-head"><strong>Security alerts</strong><small>{alerts} new</small></div>
                                {events.filter((e) => e.type === "failed" || e.type === "blocked").slice(0, 4).map((e) => {
                                    const u = byId(e.userId);
                                    return u ? (
                                        <button key={e.id} onClick={() => { setNotifOpen(false); setSelectedId(u.id); }}>
                                            <span className={`sa-event-icon ev-${e.type}`}><Icon name={e.type === "failed" ? "alert" : "ban"} size={16} /></span>
                                            <div><strong>{u.name}</strong><p>{EVENT_TEXT[e.type]}</p></div>
                                        </button>
                                    ) : null;
                                })}
                                {alerts === 0 && <p className="sa-muted" style={{ padding: 14 }}>No alerts.</p>}
                            </div>
                        )}
                    </div>
                    <button className="sa-icon-btn sa-hide-desktop" onClick={() => setActive("settings")} aria-label="Settings">
                        <Icon name="settings" size={19} />
                    </button>
                    <button className="sa-icon-btn" onClick={onExit || (() => navigate("/"))} aria-label="Back to homepage" title="Back to homepage">
                        <Icon name="home" size={19} />
                    </button>
                    <button className="sa-me" onClick={() => setActive("settings")}>
                        <span>SA</span>
                    </button>
                </div>
            </header>

            <div className="sa-layout">
                {/* SIDEBAR (desktop) */}
                <aside className="sa-sidebar">
                    <nav>
                        {NAV.map((n) => (
                            <button key={n.id} className={`sa-nav ${active === n.id ? "on" : ""}`} onClick={() => setActive(n.id)}>
                                <Icon name={n.icon} size={21} />
                                <span>{n.label}</span>
                                {n.id === "live" && <em className="live">{online.length}</em>}
                                {n.id === "jobs" && pendingJobs > 0 && <em>{pendingJobs}</em>}
                                {n.id === "users" && <em className="soft">{users.length}</em>}
                            </button>
                        ))}
                    </nav>

                    <div className="sa-side-card">
                        <div className="sa-side-live"><i className="sa-pulse"></i> Live sessions</div>
                        <strong>{online.length}</strong>
                        <p>of {users.length} tracked users are logged in</p>
                        <div className="sa-bar"><i style={{ width: `${(online.length / users.length) * 100}%` }}></i></div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="sa-main">
                    <div className="sa-heading" key={active}>
                        <div>
                            <span>Super admin</span>
                            <h1>{titles[active] || "Overview"}</h1>
                        </div>
                        {active === "users" && (
                            <p>{filteredUsers.length} of {users.length} users</p>
                        )}
                    </div>

                    <div className="sa-view" key={`${active}-view`}>
                        {active === "overview" && <OverviewSection
                            alerts={alerts}
                            blocked={blocked}
                            candidates={candidates}
                            chart={chart}
                            employers={employers}
                            events={events}
                            FeedItem={FeedItem}
                            online={online}
                            range={range}
                            setActive={setActive}
                            setRange={setRange}
                            setSelectedId={setSelectedId}
                            users={users}
                        />}
                        {active === "live" && <LiveSection
                            now={now}
                            online={online}
                            setSelectedId={setSelectedId}
                            UserCard={UserCard}
                            users={users}
                        />}
                        {active === "users" && <UsersSection
                            blocked={blocked}
                            candidates={candidates}
                            employers={employers}
                            filter={filter}
                            filteredUsers={filteredUsers}
                            online={online}
                            setFilter={setFilter}
                            UserCard={UserCard}
                            users={users}
                        />}
                        {active === "jobs" && <JobsSection
                            jobs={jobs}
                            pendingJobs={pendingJobs}
                            setJobStatus={setJobStatus}
                        />}
                        {active === "activity" && <ActivitySection
                            byId={byId}
                            evFilter={evFilter}
                            filteredEvents={filteredEvents}
                            now={now}
                            setEvFilter={setEvFilter}
                            setSelectedId={setSelectedId}
                        />}
                        {active === "settings" && <SettingsSection
                            adminName={adminName}
                            logout={logout}
                            setSettings={setSettings}
                            settings={settings}
                            setToast={setToast}
                        />}
                    </div>
                </main>
            </div>

            {/* BOTTOM NAV (mobile, Instagram style) */}
            <nav className="sa-bottom-nav" aria-label="Main">
                {NAV.filter((n) => n.id !== "settings").map((n) => (
                    <button key={n.id} className={active === n.id ? "on" : ""} onClick={() => setActive(n.id)} aria-label={n.label}>
                        <Icon name={n.icon} size={24} />
                        {n.id === "live" && <i className="sa-dot"></i>}
                    </button>
                ))}
            </nav>

            {/* USER SHEET */}
            {selected && (
                <div className="sa-overlay" onClick={() => setSelectedId(null)}>
                    <div className="sa-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={selected.name}>
                        <button className="sa-sheet-close" onClick={() => setSelectedId(null)} aria-label="Close">
                            <Icon name="close" size={20} />
                        </button>
                        <div className="sa-sheet-handle"></div>

                        <div className="sa-profile-head">
                            <Avatar u={selected} size={92} ring={selected.online} live />
                            <div>
                                <h2>
                                    {selected.name}
                                    {selected.verified && <span className="sa-check"><Icon name="verified" size={20} /></span>}
                                </h2>
                                <p>{selected.role} · {selected.city}</p>
                                {StatusBadge({ u: selected })}
                            </div>
                        </div>

                        <div className="sa-profile-stats">
                            <div><b>{selected.logins}</b><span>Logins</span></div>
                            <div><b>{selected.count}</b><span>{selected.role === "Employer" ? "Jobs posted" : "Applications"}</span></div>
                            <div><b>{selected.joined}</b><span>Days member</span></div>
                        </div>
                        {score && (
                            <div className="sa-card" style={{ margin: "14px 0", padding: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <strong>Candidate score</strong>
                                    <span className={`sa-status ${score.verdict === "Recommended" ? "online" : score.verdict === "Low" ? "blocked" : "offline"}`}>
                                        {score.verdict}
                                    </span>
                                </div>
                                <h2 style={{ margin: "8px 0" }}>{score.total} pts</h2>
                                <ul className="sa-info-list">
                                    <li><span>Personal info</span><b>{score.breakdown.personal}</b></li>
                                    <li><span>Address</span><b>{score.breakdown.address}</b></li>
                                    <li><span>Education</span><b>{score.breakdown.education}</b></li>
                                    <li><span>Skills</span><b>{score.breakdown.skills + score.breakdown.skills_penalty}</b></li>
                                    <li><span>Courses</span><b>{score.breakdown.courses}</b></li>
                                    <li><span>Work experience</span><b>{score.breakdown.experience}</b></li>
                                    <li><span>Projects</span><b>{score.breakdown.projects}</b></li>
                                    <li><span>Achievements</span><b>{score.breakdown.achievements}</b></li>
                                    <li><span>Job-switch penalty</span><b>{score.breakdown.switch_penalty}</b></li>
                                </ul>
                            </div>
                        )}

                        <ul className="sa-info-list">
                            <li><Icon name="mail" size={17} /><span>Email</span><b>{selected.email}</b></li>
                            <li><Icon name="device" size={17} /><span>Device</span><b>{selected.device}</b></li>
                            <li><Icon name="pin" size={17} /><span>IP address</span><b>{selected.ip}</b></li>
                            <li><Icon name="clock" size={17} /><span>Last active</span><b>{selected.online ? "Right now" : timeAgoFromTs(selected.lastActive, now)}</b></li>
                        </ul>

                        <h3 className="sa-sheet-sub">Recent activity</h3>
                        <div className="sa-mini-tl">
                            {userEvents.length === 0 && <p className="sa-muted">No recent activity.</p>}
                            {userEvents.map((e) => (
                                <div key={e.id}>
                                    <span className={`sa-event-icon ev-${e.type}`}>
                                        <Icon name={e.type === "failed" ? "alert" : e.type === "blocked" || e.type === "forced" ? "ban" : e.type === "logout" ? "logout" : "lock"} size={15} />
                                    </span>
                                    <p>{EVENT_TEXT[e.type]}</p>
                                    <time>{timeAgoFromTs(e.ts, now)}</time>
                                </div>
                            ))}
                        </div>

                        <div className="sa-sheet-actions">
                            {!selected.verified && (
                                <button className="sa-btn sa-btn-primary" onClick={() => verifyUser(selected.id)}>
                                    <Icon name="verified" size={17} /> Verify
                                </button>
                            )}
                            {selected.online && !selected.blocked && (
                                <button className="sa-btn sa-btn-ghost" onClick={() => forceLogout(selected.id)}>
                                    <Icon name="logout" size={17} /> Force log out
                                </button>
                            )}
                            <button className={`sa-btn ${selected.blocked ? "sa-btn-soft" : "sa-btn-danger"}`} onClick={() => toggleBlock(selected.id)}>
                                <Icon name="ban" size={17} /> {selected.blocked ? "Unblock user" : "Block user"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className="sa-toast" role="status">{toast}</div>}
        </div>
    );
}