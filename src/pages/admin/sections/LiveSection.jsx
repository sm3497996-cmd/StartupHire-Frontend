import { timeAgoFromTs } from "../../../utils/date";
import { AdminIcon as Icon } from "../../../components/ui/Icon";
import { Avatar } from "../components/Avatar";

export default function LiveSection({
    now,
    online,
    setSelectedId,
    UserCard,
    users,
}) {
    return (
        <>
            <div className="sa-banner">
                <span className="sa-pulse big"></span>
                <div>
                    <strong>{online.length} people logged in right now</strong>
                    <p>{online.filter((u) => u.role === "Candidate").length} candidates · {online.filter((u) => u.role === "Employer").length} employers</p>
                </div>
            </div>
            <div className="sa-grid">
                {online.map((u) => UserCard({ u }))}
            </div>
            {online.length === 0 && (
                <div className="sa-empty"><Icon name="live" size={34} /><h3>No one is online</h3><p>Live sessions will appear here.</p></div>
            )}
            <div className="sa-section-title" style={{ marginTop: 28 }}><h2>Not logged in</h2></div>
            <div className="sa-offline-list">
                {users.filter((u) => !u.online).map((u) => (
                    <button key={u.id} onClick={() => setSelectedId(u.id)}>
                        <Avatar u={u} size={40} />
                        <div>
                            <strong>{u.name}</strong>
                            <span>Last seen {timeAgoFromTs(u.lastActive, now)}</span>
                        </div>
                        <Icon name="arrow" size={16} />
                    </button>
                ))}
            </div>
        </>
    );
}
