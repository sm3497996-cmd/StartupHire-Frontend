import { FILTERS } from "../adminData";
import { AdminIcon as Icon } from "../../../components/ui/Icon";

export default function UsersSection({
    blocked,
    candidates,
    employers,
    filter,
    filteredUsers,
    online,
    setFilter,
    UserCard,
    users,
}) {
    return (
        <>
            <div className="sa-chips">
                {FILTERS.map((f) => (
                    <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                        {f}
                        <em>
                            {f === "All" ? users.length : f === "Online" ? online.length : f === "Offline" ? users.length - online.length : f === "Candidates" ? candidates.length : f === "Employers" ? employers.length : blocked.length}
                        </em>
                    </button>
                ))}
            </div>
            <div className="sa-grid">
                {filteredUsers.map((u) => UserCard({ u }))}
            </div>
            {filteredUsers.length === 0 && (
                <div className="sa-empty"><Icon name="search" size={34} /><h3>No users found</h3><p>Try another name, email or city.</p></div>
            )}
        </>
    );
}
