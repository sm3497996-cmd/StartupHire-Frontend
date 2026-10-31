import { useState } from "react";
import { AdminIcon as Icon } from "../../components/ui/Icon/index";
import { API_BASE } from "../../services/adminService";

/* =========================================================
   LOGIN GATE — now calls the real backend
   ========================================================= */
export function AdminLogin({ onSuccess, onBack }) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("email", email.trim());
            formData.append("password", pass);

            const response = await fetch(`${API_BASE}/login.php`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (data.success && data.user && data.user.role === "superadmin") {
                onSuccess(data.user);
            } else if (data.success && data.user) {
                // Logged in, but not a superadmin account — don't let them in here.
                setError("This account does not have Super Admin access.");
                setShake(true);
                setTimeout(() => setShake(false), 500);
            } else {
                setError(data.message || "Email or password is incorrect.");
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } catch (err) {
            console.error(err);
            setError("Could not reach the server. Is the backend running?");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sa-gate">
            <span className="sa-gate-blob g1"></span>
            <span className="sa-gate-blob g2"></span>
            <form className={`sa-gate-card ${shake ? "shake" : ""}`} onSubmit={submit}>
                <div className="sa-gate-logo"><Icon name="shield" size={30} /></div>
                <h1>Super Admin</h1>
                <p>Sign in to manage StartupHire.in</p>

                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@startuphire.in" autoFocus required />
                </label>
                <label>
                    Password
                    <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required />
                </label>

                {error && <div className="sa-gate-error" role="alert">{error}</div>}

                <button type="submit" className="sa-btn sa-btn-primary sa-gate-btn" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                <button type="button" className="sa-gate-back" onClick={onBack}>Back to homepage</button>
            </form>
        </div>
    );
}
