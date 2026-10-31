import { useEffect } from "react";
import "./About.css";
import "./About.dark.css";
import { IMPACT_STATS, JOURNEY, PILLARS } from "./data/about";

/* ---------- Content ---------- */

const About = ({ onBack }) => {
    useEffect(() => {
        const elements = document.querySelectorAll(".reveal-on-scroll");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="ap-page">

            {/* ================= NAVBAR ================= */}

            {/* =====================================================
                SECTION 1 — HERO (rounded image card style)
            ===================================================== */}

            <section className="ap-section ap-hero3-wrap">

                <div className="ap-container">

                    <div className="ap-hero3-card">

                        <img
                            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85"
                            alt="Startup founders working together"
                        />

                        <div className="ap-hero3-overlay"></div>

                        <div className="ap-hero3-content">

                            <span className="ap-hero3-eyebrow">
                                THE STARTUPHIRE PROMISE
                            </span>

                            <h1>
                                Good hires
                                <br />
                                aren't luck.
                                <br />
                                <span className="ap-hero3-gradient">
                                    They're designed.
                                </span>
                            </h1>

                            <p className="ap-hero3-tagline">
                                — built for founders who refuse to settle
                            </p>

                            <div className="ap-hero3-actions">

                                <button className="ap-btn-gradient" onClick={onBack}>
                                    Explore StartupHire →
                                </button>

                                <button
                                    className="ap-btn-ghost-light"
                                    onClick={() =>
                                        document
                                            .querySelector(".ap-story")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    ▶ Our Story
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 2 — IMPACT
            ===================================================== */}

            <section className="ap-section ap-impact">

                <div className="ap-impact-glow"></div>

                <div className="ap-container">

                    <div className="ap-impact-layout">

                        {/* LEFT */}

                        <div className="ap-impact-left reveal-on-scroll">

                            <span className="ap-impact-badge">
                                <span></span>
                                OUR IMPACT
                            </span>

                            <h2>
                                Making hiring
                                <br />
                                <span>simpler, faster &</span>
                                <br />
                                <span>better.</span>
                            </h2>

                            <p>
                                We're creating a hiring experience where
                                talented people and ambitious companies can
                                discover each other without unnecessary
                                complexity.
                            </p>

                            <div className="ap-impact-note">

                                <div className="ap-impact-note-icon">
                                    ⚡
                                </div>

                                <div>

                                    <strong>
                                        Less searching. More building.
                                    </strong>

                                    <span>
                                        Focus on the right opportunities and
                                        meaningful connections.
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* RIGHT STATS */}

                        <div className="ap-impact-grid reveal-on-scroll">

                            {IMPACT_STATS.map((stat) => (

                                <div
                                    className="ap-impact-card"
                                    key={stat.label}
                                >

                                    <div className="ap-impact-card-icon">
                                        {stat.icon}
                                    </div>

                                    <strong>
                                        {stat.value}
                                    </strong>

                                    <small>
                                        {stat.label}
                                    </small>

                                    <div className="ap-card-line"></div>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* BOTTOM PROCESS */}

                    <div className="ap-impact-process reveal-on-scroll">

                        <div className="ap-process-item">

                            <span>01</span>

                            <div>
                                <strong>Discover</strong>

                                <small>
                                    Find opportunities that fit.
                                </small>
                            </div>

                        </div>

                        <div className="ap-process-arrow">
                            →
                        </div>

                        <div className="ap-process-item">

                            <span>02</span>

                            <div>
                                <strong>Connect</strong>

                                <small>
                                    Meet the right people.
                                </small>
                            </div>

                        </div>

                        <div className="ap-process-arrow">
                            →
                        </div>

                        <div className="ap-process-item">

                            <span>03</span>

                            <div>
                                <strong>Build</strong>

                                <small>
                                    Create something meaningful.
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 3 — OUR STORY
            ===================================================== */}

            <section className="ap-section ap-story">

                <div className="ap-story-bg"></div>

                <div className="ap-container">

                    <div className="ap-section-intro reveal-on-scroll">

                        <span className="ap-section-number">
                            03 / OUR STORY
                        </span>

                        <h2>
                            Where the idea
                            <span> started.</span>
                        </h2>

                        <p>
                            StartupHire was born from a simple problem:
                            great people and great startups were having
                            trouble finding each other.
                        </p>

                    </div>


                    {/* STORY CARD 1 */}

                    <div className="ap-story-modern reveal-on-scroll">

                        <div className="ap-story-image-wrap">

                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
                                alt="Team working together"
                            />

                            <div className="ap-image-label">
                                🌙 Late nights, big ideas
                            </div>

                            <div className="ap-image-number">
                                01
                            </div>

                        </div>

                        <div className="ap-story-modern-copy">

                            <span className="ap-eyebrow">
                                HOW IT STARTED
                            </span>

                            <h3>
                                Two founders,
                                <br />
                                one broken
                                <span> hiring process.</span>
                            </h3>

                            <p>
                                We were building our own startups and kept
                                hitting the same wall — job boards built for
                                volume, not for fit. Every hire felt like a
                                gamble.
                            </p>

                            <div className="ap-story-highlight">

                                <span>01</span>

                                <strong>
                                    Hiring should feel human,
                                    not complicated.
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* STORY CARD 2 */}

                    <div className="ap-story-modern ap-story-modern-reverse reveal-on-scroll">

                        <div className="ap-story-image-wrap">

                            <img
                                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1000&q=85"
                                alt="Startup founders brainstorming"
                            />

                            <div className="ap-image-label">
                                ✨ Built with founders
                            </div>

                            <div className="ap-image-number">
                                02
                            </div>

                        </div>

                        <div className="ap-story-modern-copy">

                            <span className="ap-eyebrow">
                                HOW IT'S GOING
                            </span>

                            <h3>
                                A platform builders
                                <br />
                                and founders
                                <span> actually enjoy.</span>
                            </h3>

                            <p>
                                Today, StartupHire is where early founders
                                find people who've actually shipped things —
                                and where builders find teams worth betting
                                their career on.
                            </p>

                            <div className="ap-story-highlight">

                                <span>02</span>

                                <strong>
                                    Better matches create better companies.
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 4 — JOURNEY
            ===================================================== */}

            <section className="ap-section ap-journey">

                <div className="ap-journey-orb"></div>

                <div className="ap-container">

                    <div className="ap-section-intro ap-dark-intro reveal-on-scroll">

                        <span className="ap-section-number">
                            04 / OUR JOURNEY
                        </span>

                        <h2>
                            From a side project
                            <br />
                            <span>to a movement.</span>
                        </h2>

                        <p>
                            Every year brought a new challenge, a new lesson,
                            and a bigger reason to keep building.
                        </p>

                    </div>


                    <div className="ap-modern-timeline">

                        <div className="ap-timeline-progress"></div>

                        {JOURNEY.map((item, index) => (

                            <div
                                className={`ap-modern-timeline-item reveal-on-scroll ${index % 2 === 0
                                    ? "timeline-left"
                                    : "timeline-right"
                                    }`}
                                key={item.year}
                            >

                                <div className="ap-year-bubble">
                                    {item.year}
                                </div>

                                <div className="ap-modern-timeline-card">

                                    <div className="ap-timeline-top">

                                        <span className="ap-timeline-emoji">
                                            {item.emoji}
                                        </span>

                                        <span>
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                    </div>

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p>
                                        {item.text}
                                    </p>

                                    <div className="ap-timeline-mini-line"></div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION 5 — PILLARS
            ===================================================== */}

            <section className="ap-section ap-pillars">

                <div className="ap-container">

                    <div className="ap-section-intro reveal-on-scroll">

                        <span className="ap-section-number">
                            05 / WHAT DRIVES US
                        </span>

                        <h2>
                            The principles
                            <br />
                            behind every <span>match.</span>
                        </h2>

                        <p>
                            We don't just want to make hiring faster.
                            We want to make it better.
                        </p>

                    </div>


                    <div className="ap-pillars-modern">

                        {PILLARS.map((pillar, index) => (

                            <div
                                className={`ap-pillar-modern ${pillar.color} reveal-on-scroll`}
                                key={pillar.title}
                            >

                                <div className="ap-pillar-number">
                                    0{index + 1}
                                </div>

                                <div className="ap-pillar-icon">
                                    {pillar.icon}
                                </div>

                                <h3>
                                    {pillar.title}
                                </h3>

                                <p>
                                    {pillar.text}
                                </p>

                                <div className="ap-pillar-arrow">
                                    ↗
                                </div>

                            </div>

                        ))}

                    </div>


                    {/* BIG IMAGE */}

                    <div className="ap-banner-modern reveal-on-scroll">

                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=85"
                            alt="Startup team celebrating"
                        />

                        <div className="ap-banner-gradient"></div>

                        <div className="ap-banner-content">

                            <span>
                                THE STARTUPHIRE MINDSET
                            </span>

                            <h2>
                                Great teams
                                <br />
                                aren't found.
                                <br />
                                <strong>
                                    They're built.
                                </strong>
                            </h2>

                            <p>
                                — the whole reason StartupHire exists
                            </p>

                        </div>

                    </div>

                </div>

            </section>
            {/* ================= FOOTER ================= */}
            <footer className="ap-footer-modern">
                <div className="ap-container">

                    <div className="ap-footer-main">

                        {/* Brand */}
                        <div className="ap-footer-brand">
                            <div className="ap-logo">
                                Startup<span>Hire</span>
                            </div>

                            <p>
                                Connecting ambitious startups with people who build,
                                create and grow.
                            </p>
                        </div>

                        {/* Links */}
                        <div className="ap-footer-links">

                            <div>
                                <h4>Platform</h4>
                                <a href="#jobs">Jobs</a>
                                <a href="#features">Features</a>
                                <a href="#candidates">Candidates</a>
                                <a href="#employers">Employers</a>
                            </div>

                            <div>
                                <h4>Company</h4>
                                <a href="#story">About Us</a>
                                <a href="#journey">Our Journey</a>
                                <a href="#pillars">Our Values</a>
                            </div>

                            <div>
                                <h4>Connect</h4>
                                <a href="#contact">Contact</a>
                                <a href="#support">Support</a>
                                <a href="#privacy">Privacy</a>
                                <a href="#terms">Terms</a>
                            </div>

                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="ap-footer-bottom">
                        <span>
                            © 2026 StartupHire. All rights reserved.
                        </span>

                        <div className="ap-footer-socials">
                            <span>LinkedIn</span>
                            <span>Instagram</span>
                            <span>GitHub</span>
                        </div>
                    </div>

                </div>
            </footer>

        </div>
    );
};

export default About;