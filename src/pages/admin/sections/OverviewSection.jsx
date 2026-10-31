import { Avatar } from "../components/Avatar";
import { Stat } from "../components/StatCard";
import { AreaChart } from "../charts/AreaChart";
import { Donut } from "../charts/Donut";

export default function OverviewSection({
    alerts,
    blocked,
    candidates,
    chart,
    employers,
    events,
    FeedItem,
    online,
    range,
    setActive,
    setRange,
    setSelectedId,
    users,
}) {
    return (
        <>
            <section className="sa-stories-card">
                <div className="sa-section-title">
                    <h2><i className="sa-pulse"></i> Online now</h2>
                    <button className="sa-link" onClick={() => setActive("live")}>See all</button>
                </div>
                <div className="sa-stories">
                    {online.map((u, i) => (
                        <button className="sa-story" key={u.id} onClick={() => setSelectedId(u.id)} style={{ animationDelay: `${i * 0.04}s` }}>
                            <Avatar u={u} size={62} ring />
                            <span>{u.name.split(" ")[0]}</span>
                        </button>
                    ))}
                    {online.length === 0 && <p className="sa-muted">Nobody is online right now.</p>}
                </div>
            </section>

            <section className="sa-stats">
                <Stat icon="users" label="Total users" value={users.length} note="+38 this week" tone="purple" />
                <Stat icon="live" label="Online now" value={online.length} note="Live, updates every few seconds" tone="green" />
                <Stat icon="briefcase" label="Employers" value={employers.length} note="+6 this week" tone="blue" />
                <Stat icon="ban" label="Blocked" value={blocked.length} note={`${alerts} security alerts`} tone="pink" />
            </section>

            <section className="sa-two-col">
                <article className="sa-card">
                    <div className="sa-section-title">
                        <h2>Logins</h2>
                        <div className="sa-seg">
                            {["24h", "7d"].map((r) => (
                                <button key={r} className={range === r ? "on" : ""} onClick={() => setRange(r)}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <AreaChart range={range} data={chart} />
                </article>

                <article className="sa-card">
                    <div className="sa-section-title"><h2>Who's on the platform</h2></div>
                    <Donut a={candidates.length} b={employers.length} labelA="Candidates" labelB="Employers" />
                    <div className="sa-mini-bars">
                        <div>
                            <div className="sa-mini-top"><span>Online candidates</span><b>{online.filter((u) => u.role === "Candidate").length}</b></div>
                            <div className="sa-bar"><i style={{ width: `${(online.filter((u) => u.role === "Candidate").length / Math.max(candidates.length, 1)) * 100}%` }}></i></div>
                        </div>
                        <div>
                            <div className="sa-mini-top"><span>Online employers</span><b>{online.filter((u) => u.role === "Employer").length}</b></div>
                            <div className="sa-bar alt"><i style={{ width: `${(online.filter((u) => u.role === "Employer").length / Math.max(employers.length, 1)) * 100}%` }}></i></div>
                        </div>
                    </div>
                </article>
            </section>

            <section>
                <div className="sa-section-title">
                    <h2>Recent activity</h2>
                    <button className="sa-link" onClick={() => setActive("activity")}>View all</button>
                </div>
                <div className="sa-feed">
                    {events.slice(0, 6).map((e) => FeedItem({ e }))}
                </div>
            </section>
        </>
    );
}
