import { EVENT_FILTERS, EVENT_TEXT } from "../adminData";
import { timeAgoFromTs } from "../../../utils/date";
import { AdminIcon as Icon } from "../../../components/ui/Icon";

export default function ActivitySection({
    byId,
    evFilter,
    filteredEvents,
    now,
    setEvFilter,
    setSelectedId,
}) {
    return (
        <>
            <div className="sa-chips">
                {EVENT_FILTERS.map((f) => (
                    <button key={f} className={evFilter === f ? "on" : ""} onClick={() => setEvFilter(f)}>
                        {f === "All" ? "All" : f === "failed" ? "Failed" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
                    </button>
                ))}
            </div>
            <div className="sa-timeline">
                {filteredEvents.map((e) => {
                    const u = byId(e.userId);
                    if (!u) return null;
                    return (
                        <div className={`sa-tl-item type-${e.type}`} key={e.id}>
                            <span className={`sa-event-icon ev-${e.type}`}>
                                <Icon name={e.type === "failed" ? "alert" : e.type === "blocked" || e.type === "forced" ? "ban" : e.type === "logout" ? "logout" : e.type === "signup" ? "user" : e.type === "verified" ? "verified" : "lock"} size={17} />
                            </span>
                            <button onClick={() => setSelectedId(u.id)}>
                                <strong>{u.name}</strong>
                                <p>{EVENT_TEXT[e.type]} · {u.device}</p>
                            </button>
                            <time>{timeAgoFromTs(e.ts, now)}</time>
                        </div>
                    );
                })}
                {filteredEvents.length === 0 && (
                    <div className="sa-empty"><Icon name="activity" size={34} /><h3>No activity found</h3><p>Try a different filter.</p></div>
                )}
            </div>
        </>
    );
}
