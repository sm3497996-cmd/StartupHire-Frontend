import { useState } from "react";
import "./Register.css";
import "./Register.dark.css";
import { API_PHP } from "../../config/env";

const Register = ({ onClose, onSwitchToLogin, defaultType = "candidate" }) => {
    const [regType, setRegType] = useState(defaultType);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.agree) {
            alert("Please agree to the Terms & Conditions.");
            return;
        }

        if (form.password !== form.confirm) {
            alert("Passwords do not match.");
            return;
        }

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("password", form.password);
        formData.append("role", regType);

        try {
            const response = await fetch(
                `${API_PHP}/register.php`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                onClose();
            }
        } catch (error) {
            console.error(error);
            alert("Server connection failed.");
        }
    };

    return (
        <div className="modal-overlay register-overlay" onClick={onClose}>
            <div
                className="register-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-modal register-close" onClick={onClose}>
                    ✕
                </button>

                {/* LEFT VISUAL SIDE */}
                <div className="register-visual">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                        alt="Team working together"
                    />

                    <div className="register-visual-overlay"></div>

                    <div className="register-visual-content">
                        <span className="register-visual-badge">
                            <span></span>
                            Join StartupHire
                        </span>

                        <h3>
                            Start your journey with <br /> the right opportunity.
                        </h3>

                        <p>
                            Create your free account and get access to verified jobs,
                            internships and startup opportunities.
                        </p>

                        <div className="register-visual-points">
                            <div>✓ Verified opportunities</div>
                            <div>✓ Fast & simple signup</div>
                            <div>✓ Free forever</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM SIDE */}
                <div className="register-form-side">
                    <span className="login-label">CREATE ACCOUNT</span>
                    <h2>Get Started</h2>
                    <p className="register-subtext">
                        Sign up as a candidate or employer to continue.
                    </p>

                    {/* TYPE SWITCH */}
                    <div className="register-type-switch">
                        <button
                            type="button"
                            className={regType === "candidate" ? "active" : ""}
                            onClick={() => setRegType("candidate")}
                        >
                            👤 Candidate
                        </button>

                        <button
                            type="button"
                            className={regType === "employer" ? "active" : ""}
                            onClick={() => setRegType("employer")}
                        >
                            🏢 Employer
                        </button>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder={
                                regType === "candidate" ? "Full Name" : "Company Name"
                            }
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>

                        <div className="password-field">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm"
                                placeholder="Confirm Password"
                                value={form.confirm}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? "🙈" : "👁"}
                            </button>
                        </div>

                        <label className="register-terms">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                            />
                            I agree to the <span>Terms &amp; Conditions</span> and{" "}
                            <span>Privacy Policy</span>
                        </label>

                        <button type="submit" className="gradient-btn register-submit">
                            Create {regType === "candidate" ? "Candidate" : "Employer"}{" "}
                            Account →
                        </button>
                    </form>

                    <div className="login-switch">
                        Already have an account?{" "}
                        <span onClick={onSwitchToLogin}>Login</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;