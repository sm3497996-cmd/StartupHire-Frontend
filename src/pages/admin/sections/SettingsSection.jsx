import { Avatar } from "../components/Avatar";
import { AdminIcon as Icon } from "../../../components/ui/Icon";

export default function SettingsSection({
    adminName,
    logout,
    setSettings,
    settings,
    setToast,
}) {
        const rows = [
            { k: "signups", t: "Allow new sign-ups", d: "Candidates and employers can create new accounts." },
            { k: "verify", t: "Require employer verification", d: "New employers must be verified before posting jobs." },
            { k: "alerts", t: "Failed-login alerts", d: "Get notified after repeated failed login attempts." },
            { k: "maintenance", t: "Maintenance mode", d: "Show a maintenance page to all non-admin visitors." },
        ];
        return (
            <div className="sa-settings">
                <article className="sa-card sa-admin-card">
                    <Avatar u={{ initials: "SA", color: "#5b3df5", online: true }} size={68} ring />
                    <div>
                        <strong>{adminName}</strong>
                        <span>Super Admin</span>
                    </div>
                    <button className="sa-btn sa-btn-ghost" onClick={logout}><Icon name="logout" size={16} /> Sign out</button>
                </article>

                <article className="sa-card">
                    <div className="sa-section-title"><h2>Platform controls</h2></div>
                    {rows.map((r) => (
                        <div className="sa-toggle-row" key={r.k}>
                            <div>
                                <strong>{r.t}</strong>
                                <p>{r.d}</p>
                            </div>
                            <button
                                role="switch"
                                aria-checked={settings[r.k]}
                                className={`sa-switch ${settings[r.k] ? "on" : ""}`}
                                onClick={() => {
                                    setSettings({ ...settings, [r.k]: !settings[r.k] });
                                    setToast(`${r.t}: ${!settings[r.k] ? "on" : "off"}`);
                                }}
                            >
                                <i></i>
                            </button>
                        </div>
                    ))}
                </article>
            </div>
        );
}
