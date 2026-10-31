import { useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = ({ page, onNavigate, onLoginClick }) => {
    const [mobileMenu, setMobileMenu] = useState(false);

    // Go to home page (if not already there) then smooth-scroll to a section
    const goHomeAndScroll = (id) => {
        if (page !== "home") {
            onNavigate("home");
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }

        setMobileMenu(false);
    };

    // Switch to a different full page (candidate / employer / about / home)
    const goTo = (target) => {
        onNavigate(target);
        setMobileMenu(false);
        window.scrollTo(0, 0);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <button className="logo" onClick={() => goTo("home")}>
                    <span>Startup</span>Hire<span className="logo-dot">.</span>
                </button>

                <div className={`nav-links ${mobileMenu ? "mobile-open" : ""}`}>
                    <button onClick={() => goHomeAndScroll("home")}>Home</button>
                    <button onClick={() => goTo("jobs")}>Jobs</button>
                    <button onClick={() => goHomeAndScroll("features")}>
                        Features
                    </button>
                    <button onClick={() => goTo("candidate")}>Candidate</button>
                    <button onClick={() => goTo("employer")}>Employer</button>
                    <button onClick={() => goTo("about")}>About</button>

                    <div className="mobile-nav-buttons">
                        <ThemeToggle className="self-center" />

                        <button
                            className="mobile-login"
                            onClick={() => onLoginClick("candidate")}
                        >
                            Login
                        </button>

                        <button
                            className="mobile-post"
                            onClick={() => onLoginClick("employer")}
                        >
                            Post a Job
                        </button>
                    </div>
                </div>

                <div className="desktop-nav-buttons">
                    <ThemeToggle />

                    {page !== "home" && (
                        <button className="login-btn" onClick={() => goTo("home")}>
                            ← Home
                        </button>
                    )}

                    <button
                        className="login-btn"
                        onClick={() => onLoginClick("candidate")}
                    >
                        Login
                    </button>

                    <button
                        className="gradient-btn post-btn"
                        onClick={() => onLoginClick("employer")}
                    >
                        Post a Job
                    </button>
                </div>

                <button
                    className="hamburger"
                    onClick={() => setMobileMenu(!mobileMenu)}
                >
                    {mobileMenu ? "✕" : "☰"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;