import { useEffect, useMemo, useState } from "react";
import CandidateResumeView from "../../components/resume/CandidateResumeView";
import ResumeActions from "../../components/resume/ResumeActions";
import { API_PHP } from "../../config/env";
import { initialsOf } from "../../utils/initials";

const API = `${API_PHP}/applications.php`;
const TABS = ["All", "Applied", "Shortlisted", "Selected", "Rejected"];
const COLORS = { Applied: "#159fd8", Shortlisted: "#f7a51c", Selected: "#12b86f", Rejected: "#e5484d" };
const AVATARS = ["#5b3df5", "#12b86f", "#e83f7d", "#159fd8", "#f7a51c", "#7d2ae8"];
const ACTIONS = [
    { label: "Shortlist", status: "Shortlisted" },
    { label: "Select", status: "Selected" },
    { label: "Reject", status: "Rejected" },
];

const fmtDate = (d) => {
    if (!d) return "";
    const dt = new Date(String(d).replace(" ", "T"));
    return isNaN(dt) ? d : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const isUrl = (s) => /^https?:\/\/\S+$/i.test(String(s || "").trim());

export default function ApplicantsPanel({ initialStatus = "All", onToast }) {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tab, setTab] = useState(initialStatus);
    const [jobFilter, setJobFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [busyId, setBusyId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [detailTab, setDetailTab] = useState("answers");

    useEffect(() => setTab(initialStatus), [initialStatus]);

    const load = () => {
        setLoading(true);
        fetch(API, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => {
                if (d.success) {
                    setApps(d.applications || []);
                    setError("");
                } else {
                    setError(d.message || "Could not load applicants");
                }
            })
            .catch(() => setError("Server se connect nahi ho paya"))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const jobs = useMemo(() => {
        const m = new Map();
        apps.forEach((a) => m.set(a.job_id, a.job_title));
        return [...m.entries()];
    }, [apps]);

    const counts = useMemo(() => {
        const c = { All: apps.length };
        TABS.slice(1).forEach((t) => (c[t] = apps.filter((a) => a.status === t).length));
        return c;
    }, [apps]);

    const shown = apps.filter(
        (a) =>
            (tab === "All" || a.status === tab) &&
            (jobFilter === "all" || String(a.job_id) === jobFilter) &&
            `${a.candidate_name} ${a.candidate_email} ${a.job_title}`.toLowerCase().includes(search.toLowerCase())
    );

    const setStatus = async (app, status) => {
        if (app.status === status) return;
        setBusyId(app.id);
        try {
            const fd = new FormData();
            fd.append("action", "update_status");
            fd.append("application_id", app.id);
            fd.append("status", status);
            const r = await fetch(API, { method: "POST", body: fd, credentials: "include" });
            const d = await r.json();
            if (d.success) {
                setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
                onToast && onToast(`${app.candidate_name} marked ${status}`);
            } else {
                onToast && onToast(d.message || "Status update failed");
            }
        } catch {
            onToast && onToast("Server se connect nahi ho paya");
        }
        setBusyId(null);
    };

    const openApp = (a) => {
        const has = Array.isArray(a.screening_answers) && a.screening_answers.length > 0;
        setDetailTab(has ? "answers" : "resume");
        setSelectedId(a.id);
    };

    const selected = apps.find((a) => a.id === selectedId);

    const styles = `
        .ap-wrap{display:block;position:relative;width:100%;height:auto;min-height:0;overflow:visible;padding:4px 0 24px;box-sizing:border-box}.ap-wrap *{box-sizing:border-box}
        .ap-bar{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px;align-items:center;position:static;height:auto;width:100%}.ap-bar>*{position:static;flex:0 0 auto}
        .ap-tab{border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;border-radius:999px;padding:7px 14px;font:inherit;font-size:14px;cursor:pointer}
        .ap-tab.on{background:#5b3df5;border-color:#5b3df5;color:#fff}
        .ap-in{border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;border-radius:10px;padding:8px 12px;font:inherit;font-size:14px}
        .ap-list{display:grid;gap:12px}
        .ap-row{display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center;padding:14px 16px;border:1px solid rgba(127,127,127,.25);border-radius:14px;cursor:pointer;transition:border-color .15s, box-shadow .15s}
        .ap-row:hover{border-color:#5b3df5;box-shadow:0 6px 18px rgba(91,61,245,.12)}
        .ap-av{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700}
        .ap-av.big{width:64px;height:64px;font-size:20px}
        .ap-name{font-weight:700;font-size:16px}
        .ap-sub{font-size:13px;opacity:.75;margin-top:2px}
        .ap-badge{display:inline-block;font-size:12px;font-weight:600;padding:2px 10px;border-radius:999px;color:#fff;margin-left:8px;vertical-align:middle}
        .ap-view{border:1px solid #5b3df5;color:#5b3df5;background:transparent;border-radius:9px;padding:7px 14px;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
        .ap-empty{text-align:center;padding:48px 16px;opacity:.8}

        .ap-back{border:none;background:transparent;color:inherit;font:inherit;font-size:14px;font-weight:600;cursor:pointer;padding:0;margin:0 0 14px;opacity:.8}
        .ap-back:hover{opacity:1}
        .ap-card{border:1px solid rgba(127,127,127,.25);border-radius:18px;overflow:hidden}
        .ap-head{display:flex;gap:16px;align-items:center;padding:20px 22px;flex-wrap:wrap}
        .ap-head-info{flex:1;min-width:200px}
        .ap-tabs{display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px;border-top:1px solid rgba(127,127,127,.2);border-bottom:1px solid rgba(127,127,127,.2);background:rgba(127,127,127,.05);align-items:center}
        .ap-dt{border:none;background:transparent;color:inherit;font:inherit;font-size:14px;font-weight:600;padding:9px 18px;border-radius:10px;cursor:pointer;opacity:.75}
        .ap-dt:hover{opacity:1}
        .ap-dt.on{background:#5b3df5;color:#fff;opacity:1}
        .ap-sep{width:1px;height:24px;background:rgba(127,127,127,.35);margin:0 8px}
        .ap-st{border:1.5px solid currentColor;background:transparent;font:inherit;font-size:14px;font-weight:600;padding:8px 16px;border-radius:10px;cursor:pointer}
        .ap-st:disabled{cursor:default}
        .ap-st.on{color:#fff !important;border-color:transparent}
        .ap-body{padding:20px 22px}
        .ap-qa{display:grid;gap:10px}
        .ap-q{padding:12px 16px;border-radius:12px;background:rgba(127,127,127,.07)}
        .ap-q small{display:block;font-size:12px;opacity:.65;margin-bottom:3px}
        .ap-q strong{font-size:14px;font-weight:600;word-break:break-word;white-space:pre-line}
        .ap-q a{color:#5b3df5;font-weight:600}
        @media(max-width:700px){.ap-row{grid-template-columns:48px 1fr}.ap-view{grid-column:1/-1;justify-self:start}.ap-sep{display:none}}
    `;

    /* ---------------- DETAIL PAGE ---------------- */
    if (selected) {
        const a = selected;
        const answers = Array.isArray(a.screening_answers) ? a.screening_answers : [];

        return (
            <section className="ap-wrap">
                <style>{styles}</style>

                <button className="ap-back" onClick={() => setSelectedId(null)}>← Back to applicants</button>

                <div className="ap-card">
                    <div className="ap-head">
                        <div className="ap-av big" style={{ background: AVATARS[a.candidate_id % AVATARS.length] }}>
                            {initialsOf(a.candidate_name)}
                        </div>
                        <div className="ap-head-info">
                            <div className="ap-name" style={{ fontSize: 20 }}>
                                {a.candidate_name}
                                <span className="ap-badge" style={{ background: COLORS[a.status] || "#888" }}>
                                    {a.status}
                                </span>
                            </div>
                            <ResumeActions
                                candidateId={a.candidate_id}
                                name={a.candidate_name}
                                hideSave
                                compact
                            />
                            <div className="ap-sub">
                                Applied for <b>{a.job_title}</b> on {fmtDate(a.applied_at)}
                            </div>
                            <div className="ap-sub">
                                <a href={`mailto:${a.candidate_email}`} style={{ color: "inherit" }}>
                                    {a.candidate_email}
                                </a>
                            </div>
                            {a.reviewed_by_name && a.status !== "Applied" && (
                                <div className="ap-sub">
                                    {a.status} by <b>{a.reviewed_by_name}</b>
                                    {a.reviewed_at ? ` on ${fmtDate(a.reviewed_at)}` : ""}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="ap-tabs">
                        <button
                            className={`ap-dt ${detailTab === "answers" ? "on" : ""}`}
                            onClick={() => setDetailTab("answers")}
                        >
                            Answers ({answers.length})
                        </button>
                        <button
                            className={`ap-dt ${detailTab === "resume" ? "on" : ""}`}
                            onClick={() => setDetailTab("resume")}
                        >
                            Resume
                        </button>

                        <span className="ap-sep" />

                        {ACTIONS.map((x) => {
                            const isOn = a.status === x.status;
                            return (
                                <button
                                    key={x.status}
                                    className={`ap-st ${isOn ? "on" : ""}`}
                                    style={{
                                        color: COLORS[x.status],
                                        background: isOn ? COLORS[x.status] : "transparent",
                                    }}
                                    disabled={busyId === a.id || isOn}
                                    onClick={() => setStatus(a, x.status)}
                                >
                                    {isOn ? `✓ ${x.label}` : x.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="ap-body">
                        {detailTab === "answers" && (
                            answers.length === 0 ? (
                                <p style={{ opacity: 0.6 }}>This candidate did not submit any screening answers.</p>
                            ) : (
                                <div className="ap-qa">
                                    {answers.map((qa, i) => (
                                        <div className="ap-q" key={i}>
                                            <small>{i + 1}. {qa.question}</small>
                                            {qa.answer ? (
                                                isUrl(qa.answer) ? (
                                                    <a href={qa.answer} target="_blank" rel="noopener noreferrer">
                                                        {qa.answer}
                                                    </a>
                                                ) : (
                                                    <strong>{qa.answer}</strong>
                                                )
                                            ) : (
                                                <strong style={{ opacity: 0.5 }}>No answer</strong>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {detailTab === "resume" && <CandidateResumeView candidateId={a.candidate_id} />}
                    </div>
                </div>
            </section>
        );
    }

    /* ---------------- LIST PAGE ---------------- */
    return (
        <section className="ap-wrap">
            <style>{styles}</style>

            <div className="ap-bar">
                {TABS.map((t) => (
                    <button key={t} className={`ap-tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
                        {t} ({counts[t] ?? 0})
                    </button>
                ))}
            </div>

            <div className="ap-bar">
                <select className="ap-in" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                    <option value="all">All jobs</option>
                    {jobs.map(([id, title]) => (
                        <option key={id} value={String(id)}>{title}</option>
                    ))}
                </select>
                <input
                    className="ap-in"
                    style={{ minWidth: 240 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email or job"
                />
            </div>

            {loading ? (
                <div className="ap-empty">Loading applicants...</div>
            ) : error ? (
                <div className="ap-empty">{error}</div>
            ) : shown.length === 0 ? (
                <div className="ap-empty">
                    <h3>{apps.length === 0 ? "No applications yet" : "No applicants in this view"}</h3>
                    <p>
                        {apps.length === 0
                            ? "When a candidate applies for a job at your company, they’ll appear here."
                            : "Try a different status or job filter."}
                    </p>
                </div>
            ) : (
                <div className="ap-list">
                    {shown.map((a) => (
                        <div className="ap-row" key={a.id} onClick={() => openApp(a)}>
                            <div className="ap-av" style={{ background: AVATARS[a.candidate_id % AVATARS.length] }}>
                                {initialsOf(a.candidate_name)}
                            </div>

                            <div>
                                <div className="ap-name">
                                    {a.candidate_name}
                                    <span className="ap-badge" style={{ background: COLORS[a.status] || "#888" }}>
                                        {a.status}
                                    </span>
                                </div>
                                <div className="ap-sub">
                                    Applied for <b>{a.job_title}</b> on {fmtDate(a.applied_at)}
                                </div>
                                <div className="ap-sub">{a.candidate_email}</div>
                            </div>

                            <button
                                className="ap-view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openApp(a);
                                }}
                            >
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}