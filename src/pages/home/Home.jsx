import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import About from "../public/About";
import Candidate from "../public/CandidateLanding";
import Employer from "../public/EmployerLanding";
import Register from "../auth/Register";
import SimpleLogin from "../auth/SimpleLogin";
import Navbar from "../../components/layout/Navbar";
import Jobs from "../public/Jobs";
import { HERO_WORDS as heroWords, HOME_JOBS as jobs } from "../../constants/homeData";

/* =========================================
   HOME (purana App, ab Home naam se)
========================================= */
const Home = () => {
  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState("candidate");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [page, setPage] = useState("home");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroWord, setHeroWord] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWord((prev) => (prev + 1) % heroWords.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  /* =========================================
     OPEN LOGIN — opens Register.jsx directly in LOGIN mode
  ========================================= */
  const openLogin = (type) => {
    setLoginType(type);
    setShowLogin(true);
    setMobileMenu(false);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenu(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText =
      `${job.company} ${job.role} ${job.location}`.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesLocation = job.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      job.type === activeCategory ||
      job.level === activeCategory;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  const downloadGuide = () => {
    const content = `
STARTUPHIRE.IN

Find your next opportunity with StartupHire.

FOR CANDIDATES
- Search jobs
- Find internships
- Explore startups
- Build your career

FOR EMPLOYERS
- Post jobs
- Find talented candidates
- Manage applications
- Grow your team
`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "StartupHire-Guide.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  /* =========================================
     REGISTER / LOGIN MODALS
  ========================================= */
  const authModals = (
    <>
      {showLogin && (
        <SimpleLogin
          defaultType={loginType}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={(type) => {
            setLoginType(type);
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={(type) => {
            setShowLogin(false);

            const role = (type || "").toString().trim().toLowerCase();

            if (role === "candidate") {
              navigate("/candidate-dashboard");
            } else if (role === "employer") {
              navigate("/employer-dashboard");
            } else if (role === "superadmin") {
              navigate("/admin");
            } else {
              alert("Unknown account role: " + type);
            }
          }}
        />
      )}

      {showRegister && (
        <Register
          defaultType={loginType}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );

  /* =========================================
     PAGE ROUTING (sirf public pages)
  ========================================= */

  if (page === "about") {
    return (
      <>
        <Navbar page={page} onNavigate={setPage} onLoginClick={openLogin} />
        <About onBack={() => { setPage("home"); window.scrollTo(0, 0); }} />
        {authModals}
      </>
    );
  }

  if (page === "jobs") {
    return (
      <>
        <Navbar page={page} onNavigate={setPage} onLoginClick={openLogin} />
        <Jobs />
        {authModals}
      </>
    );
  }

  if (page === "candidate") {
    return (
      <>
        <Navbar page={page} onNavigate={setPage} onLoginClick={openLogin} />
        <Candidate onNavigate={setPage} />
        {authModals}
      </>
    );
  }

  if (page === "employer") {
    return (
      <>
        <Navbar page={page} onNavigate={setPage} onLoginClick={openLogin} />
        <Employer onNavigate={setPage} />
        {authModals}
      </>
    );
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <Navbar page={page} onNavigate={setPage} onLoginClick={openLogin} />

      {/* HERO */}
      <section id="home" className="hero hero-new">
        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span></span>
              India's Growing Startup Job Platform
            </div>

            <h1>
              Find Your
              <br />
              <span className="animated-word">
                {heroWords[heroWord]}
              </span>
              <br />
              & Build Your
              <br />
              Future.
            </h1>

            <p className="hero-description">
              Discover exciting jobs, internships and startup opportunities
              from companies that are building the future.
            </p>

            <div className="hero-buttons">
              <button
                className="gradient-btn hero-primary"
                onClick={() => scrollToSection("jobs")}
              >
                Explore Jobs <span>→</span>
              </button>

              <button
                className="outline-btn"
                onClick={() => scrollToSection("candidate")}
              >
                I'm a Candidate
              </button>
            </div>

            <div className="hero-points">
              <span>✓ Verified Opportunities</span>
              <span>✓ Startup Jobs</span>
              <span>✓ Internships</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-main-image image-frame hero-photo-main">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85"
                alt="Startup team"
              />
            </div>

            <div className="hero-small-image image-frame hero-photo-small hero-image-float">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80"
                alt="Team collaboration"
              />
            </div>

            <div className="hero-side-image image-frame hero-photo-side hero-image-rise">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
                alt="Business meeting"
              />
            </div>

            <div className="hiring-card floating">
              <span>🚀</span>
              <div>
                <strong>Startups Hiring</strong>
                <small>New jobs every day</small>
              </div>
            </div>

            <div className="hero-mini-card">
              <span>✓</span>
              <div>
                <strong>Verified</strong>
                <small>Companies</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section id="jobs" className="jobs-section jobs-new">
        <div className="section-container">
          <div className="search-section search-new jobs-search">
            <div className="search-box">
              <div className="search-field">
                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="search-field location-field">
                <span>📍</span>

                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option>All</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Junior Level</option>
                <option>Mid Level</option>
                <option>Senior Level</option>
              </select>

              <button
                className="gradient-btn search-button"
                onClick={() => scrollToSection("jobs")}
              >
                Search
              </button>
            </div>
          </div>

          <div className="section-heading-row">
            <div>
              <span className="section-label">OPPORTUNITIES</span>
              <h2>Popular Jobs</h2>
              <p>
                Explore some of the latest opportunities from top companies.
              </p>
            </div>

            <button
              className="view-all"
              onClick={() => {
                setSearch("");
                setLocation("");
                setActiveCategory("All");
              }}
            >
              View all jobs →
            </button>
          </div>

          <div className="jobs-grid">
            {filteredJobs.map((job, index) => (
              <div className="job-card reveal-card" key={index}>
                <div className="job-top">
                  <div className={`company-logo ${job.logoBg}`}>
                    {job.short}
                  </div>

                  <button className="save-job" title="Save job">
                    ♡
                  </button>

                  <span className="posted">{job.posted}</span>
                </div>

                <p className="company-name">{job.company}</p>

                <h3>{job.role}</h3>

                <div className="job-tags">
                  <span>{job.type}</span>
                  <span>{job.level}</span>
                </div>

                <div className="job-bottom">
                  <div>
                    <strong>{job.pay}</strong>
                    <p>📍 {job.location}</p>
                  </div>

                  <button
                    className="apply-btn"
                    onClick={() => openLogin("candidate")}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="no-jobs">
              <div>🔎</div>
              <h3>No jobs found</h3>
              <p>Try another keyword, location or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* PLATFORM INSIGHTS */}
      <section className="insights-section insights-new">
        <div className="section-container">
          <div className="insights-heading">
            <span className="section-label">
              STARTUPHIRE AT A GLANCE
            </span>

            <h2>Growing opportunities, growing careers.</h2>

            <p>
              A quick look at the StartupHire community and the opportunities
              being created every day.
            </p>
          </div>

          <div className="insights-layout graph-only-layout">
            <div className="growth-chart-card">
              <div className="chart-header">
                <div>
                  <span>OPPORTUNITY GROWTH</span>
                  <strong>More opportunities every month</strong>
                </div>

                <div className="chart-badge">↗ Growing</div>
              </div>

              <div className="growth-chart line-growth-chart">
                <div className="chart-grid-line line-a"></div>
                <div className="chart-grid-line line-b"></div>
                <div className="chart-grid-line line-c"></div>

                <svg
                  className="growth-line-svg"
                  viewBox="0 0 600 170"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="growthLineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                      />
                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                      />
                    </linearGradient>

                    <linearGradient
                      id="growthAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity="0.18"
                      />
                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                        stopOpacity="0.01"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    className="growth-area"
                    d="M20 138 C75 110, 92 125, 140 100 S205 113, 250 78 S315 95, 360 62 S430 74, 475 48 S535 55, 580 20 L580 160 L20 160 Z"
                  />

                  <path
                    className="growth-line"
                    d="M20 138 C75 110, 92 125, 140 100 S205 113, 250 78 S315 95, 360 62 S430 74, 475 48 S535 55, 580 20"
                  />

                  <circle
                    className="growth-dot dot-1"
                    cx="20"
                    cy="138"
                    r="5"
                  />

                  <circle
                    className="growth-dot dot-2"
                    cx="140"
                    cy="100"
                    r="5"
                  />

                  <circle
                    className="growth-dot dot-3"
                    cx="250"
                    cy="78"
                    r="5"
                  />

                  <circle
                    className="growth-dot dot-4"
                    cx="360"
                    cy="62"
                    r="5"
                  />

                  <circle
                    className="growth-dot dot-5"
                    cx="475"
                    cy="48"
                    r="5"
                  />

                  <circle
                    className="growth-dot dot-6"
                    cx="580"
                    cy="20"
                    r="5"
                  />
                </svg>

                <div className="chart-months">
                  <small>Jan</small>
                  <small>Feb</small>
                  <small>Mar</small>
                  <small>Apr</small>
                  <small>May</small>
                  <small>Jun</small>
                </div>
              </div>
            </div>

            <div className="insights-side-card">
              <div className="insights-side-image">
                <img
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=85"
                  alt="Startup team working"
                />
              </div>

              <div className="insights-side-content">
                <span>STARTUP ECOSYSTEM</span>

                <h3>Where talent meets opportunity.</h3>

                <p>
                  Discover growing teams, exciting roles and meaningful
                  career opportunities — all in one place.
                </p>

                <div className="insight-mini-stats">
                  <div>
                    <strong>Jobs</strong>
                    <small>Explore roles</small>
                  </div>

                  <div>
                    <strong>Startups</strong>
                    <small>Find teams</small>
                  </div>
                </div>

                <button
                  className="insight-explore-btn"
                  onClick={() => scrollToSection("jobs")}
                >
                  Explore Opportunities →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOWCHART - RADIAL ROTATING VERSION */}
      <section className="clean-process">
        <div className="section-container">
          <div className="clean-process-layout">

            {/* LEFT CONTENT */}
            <div className="clean-process-copy">
              <span className="section-label blue-label">
                SIMPLE PROCESS
              </span>

              <h2>
                From <span>search</span> to success.
              </h2>

              <p>
                Finding the right opportunity does not have to be complicated.
                StartupHire takes you through simple steps — discover,
                apply, connect and grow.
              </p>

              <div className="clean-process-highlights">
                <div className="highlight-colorful hl-purple">
                  <span>✓</span>
                  <strong>Discover relevant roles</strong>
                </div>

                <div className="highlight-colorful hl-cyan">
                  <span>✓</span>
                  <strong>Apply in simple steps</strong>
                </div>

                <div className="highlight-colorful hl-pink">
                  <span>✓</span>
                  <strong>Connect with growing teams</strong>
                </div>
              </div>
            </div>

            {/* RADIAL ROTATING FLOWCHART */}
            <div className="clean-flowchart radial-flow">

              <div className="clean-ring ring-one"></div>
              <div className="clean-ring ring-two"></div>

              <div className="radial-orbit-dot orbit-dot-a"><span>✦</span></div>
              <div className="radial-orbit-dot orbit-dot-b"><span>✓</span></div>

              <div className="clean-center radial-center">
                <div className="clean-center-icon">🚀</div>
                <strong>Your Career</strong>
                <small>Start your journey</small>
              </div>

              <div className="radial-line line-1"></div>
              <div className="radial-line line-2"></div>
              <div className="radial-line line-3"></div>
              <div className="radial-line line-4"></div>
              <div className="radial-line line-5"></div>
              <div className="radial-line line-6"></div>

              <div className="radial-node node-1">
                <span className="node-icon icon-purple">🔍</span>
                <div>
                  <strong>Discover</strong>
                  <small>Explore opportunities</small>
                </div>
              </div>

              <div className="radial-node node-2">
                <span className="node-icon icon-cyan">📝</span>
                <div>
                  <strong>Apply</strong>
                  <small>Apply to your role</small>
                </div>
              </div>

              <div className="radial-node node-3">
                <span className="node-icon icon-orange">🎤</span>
                <div>
                  <strong>Interview</strong>
                  <small>Meet the team</small>
                </div>
              </div>

              <div className="radial-node node-4">
                <span className="node-icon icon-green">🤝</span>
                <div>
                  <strong>Connect</strong>
                  <small>Meet your employer</small>
                </div>
              </div>

              <div className="radial-node node-5">
                <span className="node-icon icon-blue">📩</span>
                <div>
                  <strong>Offer</strong>
                  <small>Get your offer</small>
                </div>
              </div>

              <div className="radial-node node-6">
                <span className="node-icon icon-pink">🌱</span>
                <div>
                  <strong>Grow</strong>
                  <small>Build your future</small>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section className="portal-section portal-new">
        <div className="section-container">
          <div className="center-heading">
            <span className="section-label orange-label">
              EXPLORE MORE
            </span>

            <h2>One place for every opportunity.</h2>
          </div>

          <div className="portal-grid">
            <div className="portal-card reveal-card">
              <div className="portal-number">01</div>
              <div className="portal-emoji">💼</div>
              <h3>Jobs</h3>
              <p>
                Find full-time and part-time roles from growing companies.
              </p>
              <button onClick={() => scrollToSection("jobs")}>
                Explore Jobs →
              </button>
            </div>

            <div className="portal-card reveal-card">
              <div className="portal-number">02</div>
              <div className="portal-emoji">🎓</div>
              <h3>Internships</h3>
              <p>
                Start your career with practical experience and real projects.
              </p>
              <button onClick={() => scrollToSection("candidate")}>
                Explore Internships →
              </button>
            </div>

            <div className="portal-card reveal-card">
              <div className="portal-number">03</div>
              <div className="portal-emoji">🚀</div>
              <h3>Startups</h3>
              <p>
                Discover India's growing startup ecosystem and teams.
              </p>
              <button onClick={() => scrollToSection("employer")}>
                Explore Startups →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CANDIDATE */}
      <section id="candidate" className="candidate-section candidate-new">
        <div className="section-container candidate-grid">
          <div className="large-image image-frame candidate-photo">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85"
              alt="Candidate"
            />

            <div className="image-floating-tag">
              ✨ Find your opportunity
            </div>
          </div>

          <div className="content-side">
            <span className="section-label">FOR CANDIDATES</span>

            <h2>
              Your next opportunity is<span> waiting.</span>
            </h2>

            <p>
              Create your profile, discover relevant jobs and internships,
              and connect with companies that value your skills.
            </p>

            <div className="check-list">
              <div>
                <span>✓</span>
                Personalized job opportunities
              </div>

              <div>
                <span>✓</span>
                Easy application process
              </div>

              <div>
                <span>✓</span>
                Discover internships and startups
              </div>
            </div>

            <button
              className="gradient-btn section-button"
              onClick={() => openLogin("candidate")}
            >
              Candidate Login →
            </button>
          </div>
        </div>
      </section>

      {/* EMPLOYER */}
      <section id="employer" className="employer-section employer-new">
        <div className="section-container employer-grid">
          <div className="content-side">
            <span className="section-label pink-label">
              FOR EMPLOYERS
            </span>

            <h2>
              Build your team with<span> great people.</span>
            </h2>

            <p>
              Post your openings, reach skilled candidates and build a team
              that can take your startup to the next level.
            </p>

            <div className="employer-mini-grid">
              <div>
                <strong>01</strong>
                <h3>Post Jobs</h3>
                <p>Reach relevant candidates.</p>
              </div>

              <div>
                <strong>02</strong>
                <h3>Find Talent</h3>
                <p>Discover skilled professionals.</p>
              </div>
            </div>

            <button
              className="gradient-btn section-button"
              onClick={() => openLogin("employer")}
            >
              Employer Login →
            </button>
          </div>

          <div className="large-image image-frame employer-image employer-photo">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=85"
              alt="Employer team"
            />

            <div className="image-floating-tag">
              🚀 Build your dream team
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="download-section download-new">
        <div className="download-container">
          <div className="download-decoration decoration-one"></div>
          <div className="download-decoration decoration-two"></div>

          <div className="download-content">
            <span>FREE CAREER GUIDE</span>

            <h2>
              Ready to take the
              <br />
              next step?
            </h2>

            <p>
              Download our quick career guide and get started with
              StartupHire today.
            </p>

            <button
              className="download-btn"
              onClick={downloadGuide}
            >
              Download Guide ↓
            </button>
          </div>

          <div className="download-visual">
            <div className="guide-card">
              <div className="guide-top">
                <span>StartupHire</span>
                <span>2026</span>
              </div>

              <div className="guide-icon">🚀</div>

              <h3>Career Guide</h3>

              <div className="guide-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="guide-button"></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section testimonial-new">
        <div className="section-container">
          <div className="center-heading">
            <span className="section-label">COMMUNITY</span>

            <h2>
              People are building<span> their future.</span>
            </h2>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial-card reveal-card">
              <div className="stars">★★★★★</div>

              <p>
                "StartupHire made it much easier to discover opportunities
                that actually matched my interests."
              </p>

              <div className="person">
                <div className="person-avatar avatar-one">A</div>

                <div>
                  <strong>Aarav</strong>
                  <small>Software Developer</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card featured-testimonial">
              <div className="stars">★★★★★</div>

              <p>
                "A clean and simple platform for finding startup
                opportunities."
              </p>

              <div className="person">
                <div className="person-avatar avatar-two">R</div>

                <div>
                  <strong>Riya</strong>
                  <small>UI/UX Designer</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card reveal-card">
              <div className="stars">★★★★★</div>

              <p>
                "We found talented candidates quickly and efficiently."
              </p>

              <div className="person">
                <div className="person-avatar avatar-three">K</div>

                <div>
                  <strong>Karan</strong>
                  <small>Startup Founder</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / ABOUT */}
      <section id="about" className="contact-section contact-new">
        <div className="section-container">
          <div className="center-heading">
            <span className="section-label">CONTACT</span>

            <h2>Reach Out To Us</h2>

            <p>
              Have a question, suggestion or partnership idea?
              We'd love to hear from you.
            </p>
          </div>

          <div className="contact-box">
            <div className="contact-info">
              <div className="contact-info-header">
                <span>LET'S TALK</span>

                <h3>Have something in mind?</h3>

                <p>
                  Whether you're looking for a job or hiring your next
                  team member, we're here to help.
                </p>
              </div>

              <div className="contact-detail">
                <span>✉</span>

                <div>
                  <small>Email</small>
                  <strong>hello@startuphire.in</strong>
                </div>
              </div>

              <div className="contact-detail">
                <span>📍</span>

                <div>
                  <small>Location</small>
                  <strong>India</strong>
                </div>
              </div>

              <div className="contact-detail">
                <span>💬</span>

                <div>
                  <small>Support</small>
                  <strong>We're happy to help</strong>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <div className="form-row">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Email Address" />
              </div>

              <input type="text" placeholder="Subject" />

              <textarea
                rows="6"
                placeholder="Write your message..."
              ></textarea>

              <button
                className="gradient-btn send-button"
                onClick={() =>
                  alert("Thanks! Your message is ready to be sent.")
                }
              >
                Send Message →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <button
              className="footer-logo"
              onClick={() => scrollToSection("home")}
            >
              <span>Startup</span>Hire<span>.</span>
            </button>

            <p>
              Connecting ambitious people with companies building the future.
            </p>

            <div className="socials">
              <button>in</button>
              <button>𝕏</button>
              <button>◎</button>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <button onClick={() => scrollToSection("jobs")}>
              Jobs
            </button>

            <button>Internships</button>
            <button>Startups</button>
            <button>Companies</button>
          </div>

          <div className="footer-column">
            <h3>For Business</h3>

            <button onClick={() => openLogin("employer")}>
              Post a Job
            </button>

            <button>Find Talent</button>

            <button onClick={() => openLogin("employer")}>
              Employer Login
            </button>

            <button>Partnerships</button>


          </div>

          <div className="footer-column">
            <h3>Contact</h3>

            <p>✉ hello@startupHire.in</p>
            <p>📍 India</p>
            <p>💬 We're happy to help</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 StartupHire.in. All rights reserved.</p>
          <p>Made for the next generation of talent 🚀</p>
        </div>
      </footer>

      {authModals}
    </div>
  );
};

/* =========================================
   DASHBOARD ROUTES (alag alag URL)
   ab har sidebar option ka apna route hai:
   /candidate-dashboard/find, /candidate-dashboard/saved, etc.
========================================= */

export default Home;
