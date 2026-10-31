import { useState } from "react";
import { API_LARAVEL, API_PHP } from "../../config/env";
import { TOKEN_KEY, USER_KEY } from "../../config/storageKeys";

const overlayStyle = {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    zIndex: 99999,
};

const modalStyle = {
    background: "var(--auth-surface, #ffffff)",
    borderRadius: "18px",
    padding: "32px",
    width: "380px",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 40px)",
    overflowY: "auto",
    position: "relative",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
    color: "var(--auth-text, #10182d)",
    boxShadow: "0 25px 70px rgba(15, 23, 42, 0.25)",
};

const closeBtnStyle = {
    position: "absolute",
    top: "14px",
    right: "16px",
    width: "32px",
    height: "32px",
    background: "transparent",
    border: "none",
    fontSize: "21px",
    cursor: "pointer",
    color: "var(--auth-muted, #64748b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const titleStyle = {
    margin: "0 45px 7px 0",
    fontSize: "25px",
    lineHeight: "1.2",
    fontWeight: "800",
    color: "var(--auth-text, #10182d)",
    background: "none",
    WebkitTextFillColor: "var(--auth-text, #10182d)",
};

const descriptionStyle = {
    margin: "0 0 20px",
    color: "var(--auth-muted, #64748b)",
    fontSize: "13px",
    lineHeight: "1.5",
};

const switchRowStyle = {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    width: "100%",
};

const switchBtnBase = {
    flex: 1,
    minWidth: 0,
    padding: "11px 8px",
    borderRadius: "10px",
    border: "1px solid var(--auth-border, #ddd)",
    background: "var(--auth-input-bg, #f5f5f7)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    color: "var(--auth-muted, #64748b)",
    boxSizing: "border-box",
};

const switchBtnActive = {
    ...switchBtnBase,
    background: "linear-gradient(90deg, #6366f1, #ec4899)",
    color: "#ffffff",
    border: "1px solid transparent",
};

const inputStyle = {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid var(--auth-border, #ddd)",
    fontSize: "14px",
    color: "var(--auth-text, #10182d)",
    background: "var(--auth-surface, #ffffff)",
    outline: "none",
    boxSizing: "border-box",
    display: "block",
};

const submitStyle = {
    width: "100%",
    height: "48px",
    padding: "0 13px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #6366f1, #ec4899)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px",
    boxSizing: "border-box",
};

const registerTextStyle = {
    textAlign: "center",
    margin: "16px 0 0",
    fontSize: "13px",
    color: "var(--auth-muted, #64748b)",
};

const PHP_API = API_PHP;
const LARAVEL_API = API_LARAVEL;

const SimpleLogin = ({
    defaultType = "candidate",
    onClose,
    onLoginSuccess,
    onSwitchToRegister,
}) => {
    const [type, setType] = useState(defaultType);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            /* STEP 1: PHP login (asli login, session yahin banta hai) */
            const response = await fetch(`${PHP_API}/login.php`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (!data.success) {
                console.error("Login failed:", data.message);
                return;
            }
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));

            /* STEP 2: Laravel token (sirf like/save/comment ke liye).
               Ye fail ho jaye to bhi login NAHI rukega. */
            try {
                const lr = await fetch(`${LARAVEL_API}/login`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
                const ld = await lr.json().catch(() => ({}));
                const token = ld.token || ld.access_token || ld.data?.token;

                if (token) localStorage.setItem(TOKEN_KEY, token);
            } catch (err) {
                console.warn("Laravel token skip:", err);
            }


            onLoginSuccess(data.user.role);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <>
            {/* Prevent homepage CSS from changing login modal */}
            <style>
                {`
                    .startup-login-modal input::placeholder {
                        color: #94a3b8 !important;
                        opacity: 1 !important;
                    }

                    .startup-login-modal input:focus {
                        border-color: #8b5cf6 !important;
                        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.10) !important;
                    }

                    .startup-login-modal h2 {
                        background: none !important;
                        -webkit-background-clip: initial !important;
                        background-clip: initial !important;
                        -webkit-text-fill-color: var(--auth-text, #10182d) !important;
                        color: var(--auth-text, #10182d) !important;
                    }

                    .startup-login-modal button {
                        font-family: 'Segoe UI', Arial, sans-serif;
                    }

                    @media (max-width: 480px) {
                        .startup-login-modal-box {
                            padding: 26px 20px !important;
                            border-radius: 16px !important;
                        }
                    }
                `}
            </style>

            <div style={overlayStyle} onClick={onClose}>
                <div
                    className="startup-login-modal startup-login-modal-box"
                    style={modalStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* CLOSE */}
                    <button
                        style={closeBtnStyle}
                        onClick={onClose}
                        aria-label="Close login"
                    >
                        ×
                    </button>

                    {/* TITLE */}
                    <h2 style={titleStyle}>
                        {type === "candidate" ? "Candidate Login" : "Employer Login"}
                    </h2>

                    <p style={descriptionStyle}>
                        {type === "candidate"
                            ? "Login to explore and apply for opportunities."
                            : "Login to manage your jobs and find great talent."}
                    </p>

                    {/* CANDIDATE / EMPLOYER */}
                    <div style={switchRowStyle}>
                        <button
                            type="button"
                            style={type === "candidate" ? switchBtnActive : switchBtnBase}
                            onClick={() => setType("candidate")}
                        >
                            👤 Candidate
                        </button>

                        <button
                            type="button"
                            style={type === "employer" ? switchBtnActive : switchBtnBase}
                            onClick={() => setType("employer")}
                        >
                            🏢 Employer
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    <form onSubmit={handleSubmit}>
                        <input
                            style={inputStyle}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" style={submitStyle}>
                            Login as {type === "candidate" ? "Candidate" : "Employer"} →
                        </button>
                    </form>

                    {/* REGISTER */}
                    {onSwitchToRegister && (
                        <p style={registerTextStyle}>
                            Don't have an account?{" "}
                            <span
                                style={{
                                    color: "#6366f1",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                                onClick={() => onSwitchToRegister(type)}
                            >
                                Create one
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default SimpleLogin;