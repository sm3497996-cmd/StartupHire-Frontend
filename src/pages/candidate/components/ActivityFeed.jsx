import { useEffect, useState } from "react";
import { api } from "../../../services/interactionsService";

const LABEL = {
    like: "liked your profile",
    save: "saved your profile",
    comment: "commented on your profile",
};
const ICON = { like: "❤️", save: "🔖", comment: "💬" };

const initials = (name = "") =>
    name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

export default function ActivityFeed() {
    const [items, setItems] = useState(null);

    useEffect(() => {
        let alive = true;
        const load = () =>
            api("/interactions/my-activity")
                .then((d) => alive && setItems(d.success ? d.activity : []))
                .catch(() => alive && setItems([]));
        load();
        const t = setInterval(load, 30000);
        return () => {
            alive = false;
            clearInterval(t);
        };
    }, []);

    return (
        <div className="af-wrap">
            <style>{`
                .af-wrap { display:grid; gap:4px; margin-bottom:24px; }
                .af-row { display:flex; gap:12px; padding:12px 8px; border-radius:14px; }
                .af-row:hover { background:rgba(120,120,140,.08); }
                .af-avatar { position:relative; flex:none; width:44px; height:44px; border-radius:50%;
                    display:grid; place-items:center; color:#fff; font-weight:700; font-size:14px;
                    background:linear-gradient(135deg,#6366f1,#ec4899); }
                .af-icon { position:absolute; right:-4px; bottom:-4px; font-size:14px; }
                .af-text { font-size:14px; line-height:1.45; }
                .af-text small { display:block; opacity:.6; margin-top:2px; }
                .af-comment { margin-top:6px; padding:8px 12px; border-radius:12px;
                    background:rgba(120,120,140,.12); font-size:13.5px; }
                .af-empty { padding:24px 8px; opacity:.7; }
            `}</style>

            {items === null && <p className="af-empty">Loading...</p>}
            {items && items.length === 0 && (
                <p className="af-empty">No activity yet. Jab employers aapki profile like ya comment karenge, wo yahan dikhega.</p>
            )}

            {(items || []).map((a, i) => (
                <div className="af-row" key={i}>
                    <div className="af-avatar">
                        {initials(a.employer_name)}
                        <span className="af-icon">{ICON[a.type]}</span>
                    </div>
                    <div className="af-text">
                        <strong>{a.employer_name}</strong> {LABEL[a.type]}
                        <small>
                            {a.company_name ? `${a.company_name} · ` : ""}
                            {a.time_ago}
                        </small>
                        {a.type === "comment" && a.comment_text && (
                            <div className="af-comment">{a.comment_text}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}