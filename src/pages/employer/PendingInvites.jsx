import { useEffect, useState } from "react";
import { API_PHP } from "../../config/env";

const API_BASE = API_PHP;

const PERMISSION_LABELS = {
    manage_jobs: "Manage Jobs",
    view_applications: "View Applications",
    manage_applications: "Manage Applications",
    view_candidates: "View Candidates",
    manage_company_profile: "Manage Company Profile",
};

const wrap = {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 22,
};

const pill = {
    display: "inline-block",
    padding: "3px 9px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    marginRight: 5,
    marginTop: 6,
    background: "#eef2ff",
    color: "#4f46e5",
};

const fmt = (d) => (d ? new Date(d.replace(" ", "T")).toLocaleDateString() : "");

/**
 * Owner side: invitations that were sent and not answered yet.
 * Props:
 *   refreshKey - change this number after sending a new invite to reload the list
 *   onToast    - optional (message) => void
 */
export default function PendingInvites({ refreshKey = 0, onToast }) {
    const [invites, setInvites] = useState([]);
    const notify = (m) => (onToast ? onToast(m) : alert(m));

    const load = () => {
        fetch(`${API_BASE}/companies.php?action=company_invites`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => d.success && setInvites(d.invites))
            .catch(() => { });
    };

    useEffect(load, [refreshKey]);

    const cancel = async (id) => {
        if (!window.confirm("Cancel this invitation?")) return;
        try {
            const res = await fetch(`${API_BASE}/companies.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "cancel_invite", invite_id: id }),
            });
            const d = await res.json();
            notify(d.message || "Done");
            if (d.success) load();
        } catch {
            notify("Could not reach the server.");
        }
    };

    if (invites.length === 0) return null;

    return (
        <div style={wrap}>
            <h3 style={{ marginTop: 0 }}>Pending invitations ({invites.length})</h3>
            {invites.map((inv) => (
                <div
                    key={inv.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        padding: "10px 0",
                        borderTop: "1px solid #f1f1f4",
                    }}
                >
                    <div>
                        <strong>{inv.email}</strong>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                            Sent {fmt(inv.sent_on)}, expires {fmt(inv.expires_on)}
                        </div>
                        <div>
                            {inv.permissions.length === 0 ? (
                                <span style={{ ...pill, background: "#f5f5f7", color: "#94a3b8" }}>No permissions</span>
                            ) : (
                                inv.permissions.map((p) => (
                                    <span key={p} style={pill}>{PERMISSION_LABELS[p] || p}</span>
                                ))
                            )}
                        </div>
                    </div>
                    <div>
                        <button className="secondary-btn" onClick={() => cancel(inv.id)}>Cancel invite</button>
                    </div>
                </div>
            ))}
        </div>
    );
}