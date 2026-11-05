import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/interactionsService";

const initials = (name = "") =>
    name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
const cap = (s = "") => s.replace(/\b\w/g, (c) => c.toUpperCase());
const roleLabel = (r) => (r === "employer" ? "Employer" : "Candidate");

function Person({ p, children }) {
    return (
        <div className="nw-card">
            <div className={`nw-avatar ${p.role === "employer" ? "emp" : "cand"}`}>{initials(p.name)}</div>
            <h4>{cap(p.name)}</h4>
            <span className={`nw-badge ${p.role}`}>{roleLabel(p.role)}</span>
            <div className="nw-actions">{children}</div>
        </div>
    );
}

export default function ConnectionsPanel() {
    const [tab, setTab] = useState("discover");
    const [q, setQ] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [people, setPeople] = useState([]);
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendSearch, setFriendSearch] = useState("");
    const [msg, setMsg] = useState("");

    const loadAll = useCallback(async () => {
        const [f, p, s] = await Promise.all([
            api("/connections"),
            api("/connections/pending"),
            api("/connections/sent"),
        ]);
        setFriends(f.connections || []);
        setReceived(p.requests || []);
        setSent(s.sent || []);
    }, []);

    const loadPeople = useCallback(async () => {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (roleFilter !== "all") params.set("role", roleFilter);
        const d = await api(`/connections/suggestions?${params.toString()}`);
        setPeople(d.people || []);
    }, [q, roleFilter]);

    useEffect(() => { loadAll(); }, [loadAll]);

    useEffect(() => {
        const t = setTimeout(loadPeople, 300); // small delay while typing
        return () => clearTimeout(t);
    }, [loadPeople]);

    useEffect(() => {
        if (!msg) return;
        const t = setTimeout(() => setMsg(""), 2500);
        return () => clearTimeout(t);
    }, [msg]);

    const refresh = () => { loadAll(); loadPeople(); };

    const connect = async (id) => {
        const d = await api("/connections/send", { method: "POST", body: { user_id: id } });
        setMsg(d.message || "Done");
        refresh();
    };

    const respond = async (id, action) => {
        await api(`/connections/${id}/respond`, { method: "POST", body: { action } });
        setMsg(action === "accept" ? "Connection accepted" : "Request declined");
        refresh();
    };

    const remove = async (id, text) => {
        await api(`/connections/${id}`, { method: "DELETE" });
        setMsg(text);
        refresh();
    };

    const shownFriends = friends.filter((f) =>
        f.name.toLowerCase().includes(friendSearch.toLowerCase())
    );

    return (
        <section className="nw">
            <div className="nw-head">
                <div>
                    <h2>My Network</h2>
                    <p>Grow your network with candidates and employers.</p>
                </div>
                <div className="nw-stats">
                    <div><b>{friends.length}</b><span>Connections</span></div>
                    <div><b>{received.length}</b><span>Requests</span></div>
                </div>
            </div>

            <div className="nw-tabs">
                <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}>
                    People you may know
                </button>
                <button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>
                    Requests {received.length > 0 && <i>{received.length}</i>}
                </button>
                <button className={tab === "network" ? "active" : ""} onClick={() => setTab("network")}>
                    Connections ({friends.length})
                </button>
            </div>

            {tab === "discover" && (
                <>
                    <div className="nw-toolbar">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search people by name..."
                        />
                        <div className="nw-chips">
                            {[["all", "All"], ["candidate", "Candidates"], ["employer", "Employers"]].map(([v, l]) => (
                                <button key={v} className={roleFilter === v ? "active" : ""} onClick={() => setRoleFilter(v)}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {people.length === 0 ? (
                        <p className="nw-empty">No people found.</p>
                    ) : (
                        <div className="nw-grid">
                            {people.map((p) => (
                                <Person key={p.id} p={p}>
                                    <button className="nw-btn primary" onClick={() => connect(p.id)}>+ Connect</button>
                                </Person>
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === "requests" && (
                <>
                    <h3>Received ({received.length})</h3>
                    {received.length === 0 ? (
                        <p className="nw-empty">No pending requests.</p>
                    ) : (
                        <div className="nw-grid">
                            {received.map((p) => (
                                <Person key={p.connection_id} p={p}>
                                    <button className="nw-btn primary" onClick={() => respond(p.connection_id, "accept")}>Accept</button>
                                    <button className="nw-btn ghost" onClick={() => respond(p.connection_id, "reject")}>Ignore</button>
                                </Person>
                            ))}
                        </div>
                    )}

                    <h3>Sent ({sent.length})</h3>
                    {sent.length === 0 ? (
                        <p className="nw-empty">You have not sent any requests.</p>
                    ) : (
                        <div className="nw-grid">
                            {sent.map((p) => (
                                <Person key={p.connection_id} p={p}>
                                    <button className="nw-btn ghost" onClick={() => remove(p.connection_id, "Request withdrawn")}>
                                        Withdraw
                                    </button>
                                </Person>
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === "network" && (
                <>
                    <div className="nw-toolbar">
                        <input
                            value={friendSearch}
                            onChange={(e) => setFriendSearch(e.target.value)}
                            placeholder="Search your connections..."
                        />
                    </div>
                    {shownFriends.length === 0 ? (
                        <p className="nw-empty">No connections yet. Start from "People you may know".</p>
                    ) : (
                        <div className="nw-grid">
                            {shownFriends.map((p) => (
                                <Person key={p.connection_id} p={p}>
                                    <button className="nw-btn ghost" onClick={() => remove(p.connection_id, "Connection removed")}>
                                        Remove
                                    </button>
                                </Person>
                            ))}
                        </div>
                    )}
                </>
            )}

            {msg && <div className="nw-toast">{msg}</div>}

            <style>{`
                .nw { padding: 4px 0 30px; }
                .nw-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
                .nw-head h2 { margin: 0 0 4px; font-size: 24px; }
                .nw-head p { margin: 0; opacity: .65; font-size: 14px; }
                .nw-stats { display: flex; gap: 12px; }
                .nw-stats div { padding: 10px 22px; border-radius: 14px; text-align: center;
                    background: rgba(120,120,140,0.08); border: 1px solid rgba(120,120,140,0.18); }
                .nw-stats b { display: block; font-size: 20px; }
                .nw-stats span { font-size: 12px; opacity: .65; }

                .nw-tabs { display: flex; gap: 6px; border-bottom: 1px solid rgba(120,120,140,0.2); margin-bottom: 18px; overflow-x: auto; }
                .nw-tabs button { border: none; background: none; color: inherit; cursor: pointer; padding: 12px 16px;
                    font-size: 14px; font-weight: 600; opacity: .6; border-bottom: 3px solid transparent; white-space: nowrap; }
                .nw-tabs button.active { opacity: 1; border-bottom-color: #ee2a7b; }
                .nw-tabs i { font-style: normal; background: #ee2a7b; color: #fff; font-size: 11px; padding: 2px 7px; border-radius: 10px; margin-left: 4px; }

                .nw h3 { margin: 22px 0 12px; font-size: 16px; }
                .nw-toolbar { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 18px; }
                .nw-toolbar input { flex: 1; min-width: 220px; padding: 11px 16px; border-radius: 24px; font-size: 14px; outline: none;
                    border: 1.5px solid rgba(120,120,140,0.25); background: rgba(120,120,140,0.06); color: inherit; }
                .nw-toolbar input:focus { border-color: #ee2a7b; }
                .nw-chips { display: flex; gap: 8px; }
                .nw-chips button { border: 1.5px solid rgba(120,120,140,0.3); background: transparent; color: inherit; cursor: pointer;
                    padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
                .nw-chips button.active { background: linear-gradient(135deg, #f7971e, #ee2a7b 50%, #6228d7); color: #fff; border-color: transparent; }

                .nw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
                .nw-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 22px 14px 16px;
                    border-radius: 18px; background: rgba(120,120,140,0.07); border: 1px solid rgba(120,120,140,0.18);
                    transition: transform .15s ease, box-shadow .15s ease; }
                .nw-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,0.12); }
                .nw-avatar { width: 72px; height: 72px; border-radius: 50%; color: #fff; font-size: 24px; font-weight: 800;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
                .nw-avatar.cand { background: linear-gradient(135deg, #6228d7, #ee2a7b); }
                .nw-avatar.emp { background: linear-gradient(135deg, #f7971e, #ee2a7b); }
                .nw-card h4 { margin: 0 0 6px; font-size: 15px; word-break: break-word; }
                .nw-badge { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
                .nw-badge.candidate { background: rgba(98,40,215,0.12); color: #6228d7; }
                .nw-badge.employer { background: rgba(247,151,30,0.15); color: #d97706; }
                .nw-actions { display: flex; gap: 8px; margin-top: 16px; width: 100%; justify-content: center; flex-wrap: wrap; }
                .nw-btn { border: none; cursor: pointer; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; flex: 1; }
                .nw-btn.primary { background: linear-gradient(135deg, #6228d7, #ee2a7b); color: #fff; }
                .nw-btn.ghost { background: transparent; color: inherit; border: 1.5px solid rgba(120,120,140,0.35); }
                .nw-btn.ghost:hover { border-color: #ef4444; color: #ef4444; }
                .nw-btn:hover { filter: brightness(1.08); }
                .nw-empty { opacity: .6; font-size: 14px; padding: 20px 0; }
                .nw-toast { position: fixed; bottom: 24px; right: 24px; z-index: 2000; background: #111827; color: #fff;
                    padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 10px 28px rgba(0,0,0,.3); }
            `}</style>
        </section>
    );
}