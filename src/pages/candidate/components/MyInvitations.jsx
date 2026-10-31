import { useEffect, useState } from "react";
import { API_PHP } from "../../../config/env";

const API_BASE = API_PHP;

const PERMISSION_LABELS = {
    manage_jobs: "Manage Jobs",
    view_applications: "View Applications",
    manage_applications: "Manage Applications",
    view_candidates: "View Candidates",
    manage_company_profile: "Manage Company Profile",
};

const box = {
    border: "1px solid transparent",
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 14,
    background:
        "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #6366f1, #ec4899) border-box",
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

const gradBtn = {
    border: "none",
    borderRadius: 10,
    padding: "9px 16px",
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(90deg, #6366f1, #ec4899)",
};

const ghostBtn = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "9px 16px",
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
    background: "#fff",
};

/**
 * Invited person side. Put it at the top of the employer dashboard.
 * Props:
 *   onAccepted - called after a successful accept (e.g. reload dashboard data)
 *   onToast    - optional (message) => void
 * Renders nothing when there are no pending invitations.
 */
export default function MyInvitations({ onAccepted, onToast }) {
    const [invites, setInvites] = useState([]);
    const [busyId, setBusyId] = useState(null);
    const notify = (m) => (onToast ? onToast(m) : alert(m));

    const load = () => {
        fetch(`${API_BASE}/companies.php?action=my_invites`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => d.success && setInvites(d.invites))
            .catch(() => { });
    };

    useEffect(load, []);

    const post = async (payload) => {
        const res = await fetch(`${API_BASE}/companies.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.json();
    };

    const accept = async (id) => {
        setBusyId(id);
        try {
            let d = await post({ action: "accept_invite", invite_id: id });

            if (!d.success && d.needs_confirm) {
                if (!window.confirm(d.message)) return;
                d = await post({ action: "accept_invite", invite_id: id, confirm_switch: true });
            }

            notify(d.message || (d.success ? "Joined" : "Could not accept"));
            if (d.success) {
                load();
                if (onAccepted) onAccepted();
            }
        } catch {
            notify("Could not reach the server.");
        } finally {
            setBusyId(null);
        }
    };

    const decline = async (id) => {
        if (!window.confirm("Decline this invitation?")) return;
        setBusyId(id);
        try {
            const d = await post({ action: "decline_invite", invite_id: id });
            notify(d.message || "Done");
            if (d.success) load();
        } catch {
            notify("Could not reach the server.");
        } finally {
            setBusyId(null);
        }
    };

    if (invites.length === 0) return null;

    return (
        <div style={{ textAlign: "left", marginBottom: 8 }}>
            {invites.map((inv) => (
                <div key={inv.id} style={box}>
                    <div style={{ fontSize: 15 }}>
                        <strong>{inv.invited_by || "A company owner"}</strong> invited you to join{" "}
                        <strong>{inv.company_name}</strong>
                    </div>
                    <div>
                        {inv.permissions.length === 0 ? (
                            <span style={{ ...pill, background: "#f5f5f7", color: "#94a3b8" }}>No permissions yet</span>
                        ) : (
                            inv.permissions.map((p) => (
                                <span key={p} style={pill}>{PERMISSION_LABELS[p] || p}</span>
                            ))
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                        <button style={gradBtn} disabled={busyId === inv.id} onClick={() => accept(inv.id)}>
                            Accept
                        </button>
                        <button style={ghostBtn} disabled={busyId === inv.id} onClick={() => decline(inv.id)}>
                            Decline
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}