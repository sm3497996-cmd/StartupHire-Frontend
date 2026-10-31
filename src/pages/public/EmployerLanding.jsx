import { useMemo, useState } from "react";
import "./EmployerLanding.css";
import "./EmployerLanding.dark.css";
import { benefits, pipelineData, talentData } from "./data/employerLanding";

function Employer({ onNavigate }) {
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [search, setSearch] = useState("");
    const [activeStage, setActiveStage] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const [jobForm, setJobForm] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full Time",
    });

    const filteredTalent = useMemo(() => {
        return talentData.filter((person) => {
            const value = search.toLowerCase();

            return (
                person.name.toLowerCase().includes(value) ||
                person.role.toLowerCase().includes(value) ||
                person.skills.some((skill) =>
                    skill.toLowerCase().includes(value)
                )
            );
        });
    }, [search]);

    const handleJobChange = (e) => {
        setJobForm({
            ...jobForm,
            [e.target.name]: e.target.value,
        });
    };

    const handlePostJob = (e) => {
        e.preventDefault();

        setShowPostModal(false);
        setShowSuccess(true);

        setJobForm({
            title: "",
            company: "",
            location: "",
            type: "Full Time",
        });

        setTimeout(() => {
            setShowSuccess(false);
        }, 3500);
    };

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <div className="employer-landing">

            <main className="employer-main">

                {/* ================= HERO ================= */}

                <section
                    className="employer-hero"
                    id="employer-hero"
                >

                    <div className="hero-mesh-bg">
                        <div className="mesh-blob blob-one"></div>
                        <div className="mesh-blob blob-two"></div>
                        <div className="mesh-blob blob-three"></div>
                    </div>

                    <div className="hero-container">

                        <div className="hero-content-col">

                            <div className="hero-badge-pill">
                                <span className="pulse-dot">
                                    <span></span>
                                </span>
                                Trusted by 2,500+ ambitious teams
                            </div>

                            <h1 className="hero-heading">
                                <span className="hero-line hero-line-1">
                                    Build a team
                                </span>

                                <span className="hero-line hero-line-2">
                                    that <em>builds</em>
                                </span>

                                <span className="hero-line hero-line-3">
                                    the future.
                                </span>
                            </h1>

                            <p className="hero-sub">
                                Find talented people, discover the right
                                skills and build your next great team with
                                StartupHire.
                            </p>

                            <div className="hero-cta-row">

                                <button
                                    className="btn-glow"
                                    onClick={() =>
                                        setShowPostModal(true)
                                    }
                                >
                                    Start Hiring
                                    <span className="btn-arrow">
                                        →
                                    </span>
                                </button>

                                <button
                                    className="btn-ghost"
                                    onClick={() =>
                                        scrollTo("find-talent")
                                    }
                                >
                                    <span className="ghost-icon">
                                        ▶
                                    </span>
                                    Explore Talent
                                </button>

                            </div>

                            <div className="hero-metrics">

                                <div className="metric-item">
                                    <div className="metric-value">
                                        10K<span>+</span>
                                    </div>
                                    <div className="metric-label">
                                        Professionals
                                    </div>
                                </div>

                                <div className="metric-sep"></div>

                                <div className="metric-item">
                                    <div className="metric-value">
                                        2.5K<span>+</span>
                                    </div>
                                    <div className="metric-label">
                                        Companies
                                    </div>
                                </div>

                                <div className="metric-sep"></div>

                                <div className="metric-item">
                                    <div className="metric-value">
                                        92<span>%</span>
                                    </div>
                                    <div className="metric-label">
                                        Match Rate
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="hero-visual-col">

                            <div className="floating-panel-stack">

                                <div className="glass-panel panel-photo">
                                    <img
                                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=90"
                                        alt="Team working"
                                    />
                                    <div className="panel-photo-overlay"></div>
                                </div>

                                <div className="glass-panel panel-search">
                                    <span className="search-dot"></span>
                                    Searching top talent...
                                </div>

                                <div className="glass-panel panel-candidate panel-candidate-one">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                                        alt=""
                                    />

                                    <div>
                                        <strong>Ananya Verma</strong>
                                        <span>UI/UX Designer</span>
                                    </div>

                                    <div className="candidate-match">
                                        96%
                                    </div>
                                </div>

                                <div className="glass-panel panel-candidate panel-candidate-two">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                                        alt=""
                                    />

                                    <div>
                                        <strong>Rohan Mehta</strong>
                                        <span>Full Stack Dev</span>
                                    </div>

                                    <div className="candidate-match">
                                        92%
                                    </div>
                                </div>

                                <div className="glass-panel panel-highlight">
                                    <div className="highlight-icon">
                                        ✦
                                    </div>

                                    <div>
                                        <strong>Perfect Match</strong>
                                        <span>Found in 2 minutes</span>
                                    </div>
                                </div>

                                <div className="orbit-ring"></div>
                                <div className="orbit-icon orbit-icon-one">
                                    ✦
                                </div>
                                <div className="orbit-icon orbit-icon-two">
                                    +
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="hero-marquee">

                        <div className="marquee-track">

                            <span>Frontend Developer</span>
                            <span className="dot">•</span>

                            <span>UI/UX Designer</span>
                            <span className="dot">•</span>

                            <span>Full Stack Engineer</span>
                            <span className="dot">•</span>

                            <span>Data Analyst</span>
                            <span className="dot">•</span>

                            <span>Product Manager</span>
                            <span className="dot">•</span>

                            <span>Frontend Developer</span>
                            <span className="dot">•</span>

                            <span>UI/UX Designer</span>
                            <span className="dot">•</span>

                            <span>Full Stack Engineer</span>
                            <span className="dot">•</span>

                            <span>Data Analyst</span>
                            <span className="dot">•</span>

                            <span>Product Manager</span>

                        </div>

                    </div>

                </section>

                {/* ================= POST JOB ================= */}

                <section
                    className="post-job-section"
                    id="post-job"
                >

                    <div className="section-number">01</div>

                    <div className="post-job-heading">

                        <div>

                            <span className="section-label orange-label">
                                CREATE OPPORTUNITY
                            </span>

                            <h2>
                                Your next great hire
                                <br />
                                <span>starts here.</span>
                            </h2>

                        </div>

                        <p>
                            Tell talented professionals what you're building.
                            Create a job opportunity and start connecting with
                            people who can make an impact.
                        </p>

                    </div>

                    <div className="post-job-card">

                        <div className="post-card-top">

                            <div>
                                <span className="small-card-label">
                                    QUICK POST
                                </span>

                                <h3>
                                    Post your next opportunity
                                </h3>
                            </div>

                            <div className="post-icon">
                                ↗
                            </div>

                        </div>

                        <div className="job-input-grid">

                            <div className="job-input">
                                <label>JOB TITLE</label>

                                <input
                                    placeholder="e.g. Frontend Developer"
                                    name="title"
                                    value={jobForm.title}
                                    onChange={handleJobChange}
                                />
                            </div>

                            <div className="job-input">
                                <label>COMPANY</label>

                                <input
                                    placeholder="Company name"
                                    name="company"
                                    value={jobForm.company}
                                    onChange={handleJobChange}
                                />
                            </div>

                            <div className="job-input">
                                <label>LOCATION</label>

                                <input
                                    placeholder="e.g. Indore / Remote"
                                    name="location"
                                    value={jobForm.location}
                                    onChange={handleJobChange}
                                />
                            </div>

                            <div className="job-input">
                                <label>JOB TYPE</label>

                                <select
                                    name="type"
                                    value={jobForm.type}
                                    onChange={handleJobChange}
                                >
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Internship</option>
                                    <option>Remote</option>
                                </select>
                            </div>

                        </div>

                        <button
                            className="post-opportunity-btn"
                            onClick={() =>
                                setShowPostModal(true)
                            }
                        >
                            Create Job Post <span>→</span>
                        </button>

                    </div>

                </section>

                {/* ================= FIND TALENT ================= */}

                <section
                    className="find-talent-section"
                    id="find-talent"
                >

                    <div className="talent-top">

                        <div>

                            <span className="section-label purple-label">
                                DISCOVER TALENT
                            </span>

                            <h2>
                                Meet people who
                                <br />
                                <span>make things happen.</span>
                            </h2>

                        </div>

                        <div className="talent-search">

                            <span>⌕</span>

                            <input
                                placeholder="Search skills, roles or people..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="talent-grid">

                        {filteredTalent.map((person) => (

                            <div
                                className={`talent-card ${person.color}`}
                                key={person.name}
                                onClick={() =>
                                    setSelectedTalent(person)
                                }
                            >

                                <div className="talent-image">

                                    <img
                                        src={person.image}
                                        alt={person.name}
                                    />

                                    <div className="talent-available">
                                        <span></span>
                                        Available
                                    </div>

                                    <button
                                        className="talent-arrow"
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        ↗
                                    </button>

                                </div>

                                <div className="talent-info">

                                    <div className="talent-name-row">

                                        <div>
                                            <h3>{person.name}</h3>
                                            <p>{person.role}</p>
                                        </div>

                                        <span className="verified">
                                            ✓
                                        </span>

                                    </div>

                                    <div className="talent-meta">

                                        <span>
                                            ⌖ {person.location}
                                        </span>

                                        <span>
                                            ◷ {person.experience}
                                        </span>

                                    </div>

                                    <div className="talent-skills">

                                        {person.skills.map((skill) => (
                                            <span key={skill}>
                                                {skill}
                                            </span>
                                        ))}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {filteredTalent.length === 0 && (
                        <div className="talent-empty">

                            <span>⌕</span>

                            <h3>No talent found</h3>

                            <p>
                                Try searching for another skill or role.
                            </p>

                        </div>
                    )}

                </section>

                {/* ================= PIPELINE ================= */}

                <section
                    className="pipeline-section"
                    id="hiring-process"
                >

                    <div className="pipeline-background-word">
                        HIRING
                    </div>

                    <div className="pipeline-heading">

                        <div>

                            <span className="section-label cyan-label">
                                SIMPLE PROCESS
                            </span>

                            <h2>
                                From first click
                                <br />
                                <span>to first day.</span>
                            </h2>

                        </div>

                        <p>
                            A simple hiring journey designed to help you
                            focus on people, not paperwork.
                        </p>

                    </div>

                    <div className="pipeline-wrapper">

                        <div className="pipeline-line">

                            <div
                                className="pipeline-progress"
                                style={{
                                    width: `${activeStage * 33.33 + 10
                                        }%`,
                                }}
                            ></div>

                        </div>

                        <div className="pipeline-grid">

                            {pipelineData.map((item, index) => (

                                <div
                                    className={`pipeline-item ${activeStage === index
                                        ? "active"
                                        : ""
                                        }`}
                                    key={item.number}
                                    onClick={() =>
                                        setActiveStage(index)
                                    }
                                >

                                    <div className="pipeline-number">
                                        {item.number}
                                    </div>

                                    <div className="pipeline-icon">
                                        {item.icon}
                                    </div>

                                    <h3>{item.title}</h3>

                                    <p>{item.text}</p>

                                    {activeStage === index && (
                                        <span className="pipeline-active">
                                            CURRENT STEP
                                        </span>
                                    )}

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                {/* ================= BENEFITS ================= */}

                <section
                    className="benefits-section"
                    id="benefits"
                >

                    <div className="benefits-glow benefits-glow-one"></div>
                    <div className="benefits-glow benefits-glow-two"></div>

                    <div className="benefits-header">

                        <span className="section-label pink-label">
                            WHY STARTUPHIRE
                        </span>

                        <h2>
                            Hiring should feel
                            <br />
                            <span>simple.</span>
                        </h2>

                        <p>
                            Everything you need to discover talented people
                            and build a stronger team — without making
                            hiring complicated.
                        </p>

                        <button
                            className="benefits-btn"
                            onClick={() =>
                                setShowPostModal(true)
                            }
                        >
                            Start Hiring <span>→</span>
                        </button>

                    </div>

                    <div className="benefits-bento">

                        {benefits.map((benefit, index) => (

                            <div
                                key={benefit.title}
                                className={`bento-card ${benefit.color} ${index === 0
                                    ? "bento-featured"
                                    : index === 1
                                        ? "bento-wide"
                                        : "bento-mini"
                                    }`}
                            >

                                <div className="bento-top">

                                    <div className="bento-icon">
                                        {benefit.icon}
                                    </div>

                                    <span className="bento-index">
                                        0{index + 1}
                                    </span>

                                </div>

                                <div className="bento-stat">
                                    <strong>
                                        {benefit.stat}
                                    </strong>

                                    <span>
                                        {benefit.statLabel}
                                    </span>
                                </div>

                                <h3>{benefit.title}</h3>

                                <p>{benefit.text}</p>

                                <ul className="bento-points">

                                    {benefit.points.map((point) => (
                                        <li key={point}>
                                            <span>✓</span>
                                            {point}
                                        </li>
                                    ))}

                                </ul>

                                <div className="bento-arrow">
                                    ↗
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="benefits-strip">

                        <div className="strip-item">
                            <span className="strip-icon">✓</span>
                            No hidden fees, ever
                        </div>

                        <div className="strip-item">
                            <span className="strip-icon">✓</span>
                            Verified talent only
                        </div>

                        <div className="strip-item">
                            <span className="strip-icon">✓</span>
                            Dedicated hiring support
                        </div>

                        <div className="strip-item">
                            <span className="strip-icon">✓</span>
                            Cancel anytime
                        </div>

                    </div>

                </section>

                {/* ================= CTA ================= */}

                <section className="employer-cta">

                    <div className="cta-shape cta-shape-one"></div>
                    <div className="cta-shape cta-shape-two"></div>

                    <div className="cta-content">

                        <span>
                            READY TO BUILD YOUR TEAM?
                        </span>

                        <h2>
                            Your next great
                            <br />
                            teammate is <i>out there.</i>
                        </h2>

                        <p>
                            Create your opportunity and let StartupHire
                            help you find the right person.
                        </p>

                        <button
                            className="cta-button"
                            onClick={() =>
                                setShowPostModal(true)
                            }
                        >
                            Post Your First Job <span>→</span>
                        </button>

                    </div>

                </section>

                {/* ================= FOOTER ================= */}

                <footer className="employer-footer">

                    <div className="footer-brand">

                        <div className="employer-logo">
                            <span>Startup</span>Hire
                            <span className="logo-dot">.</span>
                        </div>

                        <p>
                            Connecting ambitious companies with
                            talented people.
                        </p>

                    </div>

                    <div className="footer-links">

                        <div>
                            <h4>EMPLOYERS</h4>

                            <button
                                onClick={() =>
                                    scrollTo("post-job")
                                }
                            >
                                Post a Job
                            </button>

                            <button
                                onClick={() =>
                                    scrollTo("find-talent")
                                }
                            >
                                Find Talent
                            </button>

                            <button
                                onClick={() =>
                                    scrollTo("benefits")
                                }
                            >
                                Why StartupHire
                            </button>
                        </div>

                        <div>
                            <h4>COMPANY</h4>

                            <button
                                onClick={() =>
                                    scrollTo("employer-hero")
                                }
                            >
                                Home
                            </button>

                            <button
                                onClick={() =>
                                    scrollTo("hiring-process")
                                }
                            >
                                Process
                            </button>

                            <button
                                onClick={() =>
                                    scrollTo("benefits")
                                }
                            >
                                Benefits
                            </button>
                        </div>

                    </div>

                    <div className="footer-bottom">

                        <span>
                            © 2026 StartupHire. All rights reserved.
                        </span>

                        <span>
                            Built for ambitious teams.
                        </span>

                    </div>

                </footer>

            </main>

            {/* ================= POST JOB MODAL ================= */}

            {showPostModal && (

                <div
                    className="employer-modal-overlay"
                    onClick={() =>
                        setShowPostModal(false)
                    }
                >

                    <div
                        className="employer-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={() =>
                                setShowPostModal(false)
                            }
                        >
                            ×
                        </button>

                        <span className="section-label orange-label">
                            CREATE OPPORTUNITY
                        </span>

                        <h2>Post a new job</h2>

                        <p>
                            Tell candidates about the opportunity
                            you're building.
                        </p>

                        <form onSubmit={handlePostJob}>

                            <input
                                required
                                placeholder="Job title"
                                name="title"
                                value={jobForm.title}
                                onChange={handleJobChange}
                            />

                            <input
                                required
                                placeholder="Company name"
                                name="company"
                                value={jobForm.company}
                                onChange={handleJobChange}
                            />

                            <input
                                required
                                placeholder="Location"
                                name="location"
                                value={jobForm.location}
                                onChange={handleJobChange}
                            />

                            <select
                                name="type"
                                value={jobForm.type}
                                onChange={handleJobChange}
                            >
                                <option>Full Time</option>
                                <option>Part Time</option>
                                <option>Internship</option>
                                <option>Remote</option>
                            </select>

                            <button type="submit">
                                Publish Job <span>→</span>
                            </button>

                        </form>

                    </div>

                </div>

            )}

            {/* ================= TALENT MODAL ================= */}

            {selectedTalent && (

                <div
                    className="employer-modal-overlay"
                    onClick={() =>
                        setSelectedTalent(null)
                    }
                >

                    <div
                        className="talent-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={() =>
                                setSelectedTalent(null)
                            }
                        >
                            ×
                        </button>

                        <img
                            src={selectedTalent.image}
                            alt={selectedTalent.name}
                        />

                        <div className="talent-modal-content">

                            <span className="talent-modal-label">
                                AVAILABLE FOR WORK
                            </span>

                            <h2>{selectedTalent.name}</h2>

                            <h4>{selectedTalent.role}</h4>

                            <p>
                                {selectedTalent.location} ·{" "}
                                {selectedTalent.experience}
                            </p>

                            <div className="talent-modal-skills">

                                {selectedTalent.skills.map(
                                    (skill) => (
                                        <span key={skill}>
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                            <button
                                onClick={() => {
                                    setSelectedTalent(null);
                                    setShowSuccess(true);

                                    setTimeout(() => {
                                        setShowSuccess(false);
                                    }, 3000);
                                }}
                            >
                                Connect With Candidate →
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ================= SUCCESS ================= */}

            {showSuccess && (

                <div className="employer-success">

                    <span>✓</span>

                    <div>
                        <strong>Success!</strong>

                        <p>
                            Your request has been submitted.
                        </p>
                    </div>

                </div>

            )}

        </div>
    );
}

export default Employer;