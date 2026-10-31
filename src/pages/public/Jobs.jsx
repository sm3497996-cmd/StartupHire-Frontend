import { useEffect, useState } from "react";
import "./Jobs.css";
import "./Jobs.dark.css";

const Jobs = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [mobileMenu, setMobileMenu] = useState(false);

    const pages = [
        "Discover",
        "Latest",
        "Internships",
        "Startups",
        "Remote",
        "Companies",
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    /* =========================================================
       ALL JOBS
    ========================================================= */

    const allJobs = [
        {
            id: 1,
            company: "Google",
            logo: "G",
            role: "Frontend Developer",
            location: "Bangalore, India",
            type: "Full Time",
            level: "Entry Level",
            salary: "₹8 - 14 LPA",
            tag: "Featured",
        },
        {
            id: 2,
            company: "Microsoft",
            logo: "M",
            role: "Software Engineer",
            location: "Hyderabad, India",
            type: "Full Time",
            level: "Fresher",
            salary: "₹9 - 16 LPA",
            tag: "New",
        },
        {
            id: 3,
            company: "Amazon",
            logo: "A",
            role: "UI/UX Designer",
            location: "Bangalore, India",
            type: "Full Time",
            level: "Junior",
            salary: "₹6 - 11 LPA",
            tag: "Hiring",
        },
        {
            id: 4,
            company: "Adobe",
            logo: "A",
            role: "React Developer",
            location: "Noida, India",
            type: "Full Time",
            level: "Entry Level",
            salary: "₹7 - 12 LPA",
            tag: "Hot",
        },
        {
            id: 5,
            company: "Meta",
            logo: "M",
            role: "Product Designer",
            location: "Mumbai, India",
            type: "Full Time",
            level: "Junior",
            salary: "₹8 - 15 LPA",
            tag: "Featured",
        },
        {
            id: 6,
            company: "Netflix",
            logo: "N",
            role: "Web Developer",
            location: "Remote",
            type: "Remote",
            level: "Fresher",
            salary: "₹7 - 13 LPA",
            tag: "Remote",
        },
        {
            id: 7,
            company: "Infosys",
            logo: "I",
            role: "Associate Software Engineer",
            location: "Pune, India",
            type: "Full Time",
            level: "Fresher",
            salary: "₹4 - 7 LPA",
            tag: "New",
        },
        {
            id: 8,
            company: "TCS",
            logo: "T",
            role: "Graduate Engineer Trainee",
            location: "Indore, India",
            type: "Full Time",
            level: "Fresher",
            salary: "₹4 - 6 LPA",
            tag: "Hiring",
        },
        {
            id: 9,
            company: "Wipro",
            logo: "W",
            role: "Junior Web Developer",
            location: "Pune, India",
            type: "Full Time",
            level: "Fresher",
            salary: "₹4 - 7 LPA",
            tag: "New",
        },
    ];

    /* =========================================================
       LATEST JOBS
    ========================================================= */

    const latestJobs = [
        {
            id: 101,
            company: "Flipkart",
            logo: "F",
            role: "Frontend Engineer",
            location: "Bangalore, India",
            type: "Full Time",
            level: "Fresher",
            salary: "₹7 - 12 LPA",
            tag: "Just Added",
        },
        {
            id: 102,
            company: "Razorpay",
            logo: "R",
            role: "React Developer",
            location: "Bangalore, India",
            type: "Full Time",
            level: "Junior",
            salary: "₹8 - 14 LPA",
            tag: "Today",
        },
        {
            id: 103,
            company: "Swiggy",
            logo: "S",
            role: "Product Engineer",
            location: "Hyderabad, India",
            type: "Full Time",
            level: "Entry Level",
            salary: "₹7 - 13 LPA",
            tag: "New",
        },
        {
            id: 104,
            company: "Zomato",
            logo: "Z",
            role: "UI Developer",
            location: "Gurgaon, India",
            type: "Full Time",
            level: "Junior",
            salary: "₹6 - 10 LPA",
            tag: "Today",
        },
        {
            id: 105,
            company: "PhonePe",
            logo: "P",
            role: "Software Developer",
            location: "Pune, India",
            type: "Full Time",
            level: "Fresher",
            salary: "₹6 - 11 LPA",
            tag: "New",
        },
        {
            id: 106,
            company: "Paytm",
            logo: "P",
            role: "Frontend Intern",
            location: "Noida, India",
            type: "Internship",
            level: "Student",
            salary: "₹20K - 30K / month",
            tag: "Just Added",
        },
    ];

    /* =========================================================
       INTERNSHIPS
    ========================================================= */

    const internships = [
        {
            id: 201,
            company: "Microsoft",
            logo: "M",
            role: "Frontend Development Intern",
            location: "Hyderabad",
            type: "Internship",
            level: "Student",
            salary: "₹35K / month",
            tag: "3 Months",
        },
        {
            id: 202,
            company: "Adobe",
            logo: "A",
            role: "UI/UX Design Intern",
            location: "Noida",
            type: "Internship",
            level: "Student",
            salary: "₹30K / month",
            tag: "6 Months",
        },
        {
            id: 203,
            company: "Paytm",
            logo: "P",
            role: "React.js Intern",
            location: "Noida",
            type: "Internship",
            level: "Student",
            salary: "₹25K / month",
            tag: "3 Months",
        },
        {
            id: 204,
            company: "Razorpay",
            logo: "R",
            role: "Software Engineering Intern",
            location: "Bangalore",
            type: "Internship",
            level: "Student",
            salary: "₹40K / month",
            tag: "6 Months",
        },
        {
            id: 205,
            company: "CRED",
            logo: "C",
            role: "Frontend Intern",
            location: "Bangalore",
            type: "Internship",
            level: "Student",
            salary: "₹30K / month",
            tag: "3 Months",
        },
        {
            id: 206,
            company: "Myntra",
            logo: "M",
            role: "Web Development Intern",
            location: "Bangalore",
            type: "Internship",
            level: "Student",
            salary: "₹25K / month",
            tag: "4 Months",
        },
    ];

    /* =========================================================
       STARTUP JOBS
    ========================================================= */

    const startupJobs = [
        {
            id: 301,
            company: "Zepto",
            logo: "Z",
            role: "Frontend Developer",
            location: "Mumbai",
            type: "Full Time",
            level: "Junior",
            salary: "₹7 - 12 LPA",
            tag: "Startup",
        },
        {
            id: 302,
            company: "CRED",
            logo: "C",
            role: "React Engineer",
            location: "Bangalore",
            type: "Full Time",
            level: "Entry Level",
            salary: "₹8 - 14 LPA",
            tag: "Startup",
        },
        {
            id: 303,
            company: "Meesho",
            logo: "M",
            role: "Product Designer",
            location: "Bangalore",
            type: "Full Time",
            level: "Junior",
            salary: "₹6 - 11 LPA",
            tag: "Growing",
        },
        {
            id: 304,
            company: "Groww",
            logo: "G",
            role: "Software Developer",
            location: "Bangalore",
            type: "Full Time",
            level: "Fresher",
            salary: "₹7 - 13 LPA",
            tag: "Hiring",
        },
        {
            id: 305,
            company: "Unacademy",
            logo: "U",
            role: "UI Engineer",
            location: "Remote",
            type: "Remote",
            level: "Junior",
            salary: "₹6 - 10 LPA",
            tag: "Remote",
        },
        {
            id: 306,
            company: "BrowserStack",
            logo: "B",
            role: "Frontend Engineer",
            location: "Mumbai",
            type: "Full Time",
            level: "Junior",
            salary: "₹8 - 14 LPA",
            tag: "Startup",
        },
    ];

    /* =========================================================
       REMOTE JOBS
    ========================================================= */

    const remoteJobs = [
        {
            id: 401,
            company: "Netflix",
            logo: "N",
            role: "Web Developer",
            location: "Remote",
            type: "Remote",
            level: "Fresher",
            salary: "₹7 - 13 LPA",
            tag: "Remote",
        },
        {
            id: 402,
            company: "GitLab",
            logo: "G",
            role: "Frontend Engineer",
            location: "Remote",
            type: "Remote",
            level: "Junior",
            salary: "₹9 - 16 LPA",
            tag: "100% Remote",
        },
        {
            id: 403,
            company: "Canva",
            logo: "C",
            role: "UI Designer",
            location: "Remote",
            type: "Remote",
            level: "Entry Level",
            salary: "₹7 - 12 LPA",
            tag: "Remote",
        },
        {
            id: 404,
            company: "Atlassian",
            logo: "A",
            role: "Software Engineer",
            location: "Remote",
            type: "Remote",
            level: "Junior",
            salary: "₹10 - 18 LPA",
            tag: "Remote",
        },
        {
            id: 405,
            company: "HubSpot",
            logo: "H",
            role: "React Developer",
            location: "Remote",
            type: "Remote",
            level: "Fresher",
            salary: "₹6 - 11 LPA",
            tag: "Work From Home",
        },
        {
            id: 406,
            company: "Notion",
            logo: "N",
            role: "Product Designer",
            location: "Remote",
            type: "Remote",
            level: "Junior",
            salary: "₹8 - 14 LPA",
            tag: "Remote",
        },
    ];

    /* =========================================================
       COMPANIES
    ========================================================= */

    const companies = [
        {
            name: "Google",
            logo: "G",
            openings: 24,
            category: "Technology",
            description:
                "Build products used by millions of people around the world.",
        },
        {
            name: "Microsoft",
            logo: "M",
            openings: 31,
            category: "Technology",
            description:
                "Work on cloud, software and next-generation technologies.",
        },
        {
            name: "Amazon",
            logo: "A",
            openings: 28,
            category: "E-Commerce",
            description:
                "Solve challenging problems and create products at global scale.",
        },
        {
            name: "Adobe",
            logo: "A",
            openings: 18,
            category: "Creative Tech",
            description:
                "Create digital experiences that inspire people everywhere.",
        },
        {
            name: "Razorpay",
            logo: "R",
            openings: 16,
            category: "FinTech",
            description:
                "Build products shaping the future of digital payments.",
        },
        {
            name: "Flipkart",
            logo: "F",
            openings: 21,
            category: "E-Commerce",
            description:
                "Shape the future of shopping and technology in India.",
        },
    ];

    /* =========================================================
       FILTER
    ========================================================= */

    const filterJobs = (jobs) => {
        return jobs.filter((job) => {
            const text =
                `${job.company} ${job.role} ${job.location}`.toLowerCase();

            const searchMatch =
                search.trim() === "" ||
                text.includes(search.toLowerCase().trim());

            const locationMatch =
                location.trim() === "" ||
                job.location.toLowerCase().includes(location.toLowerCase().trim());

            return searchMatch && locationMatch;
        });
    };

    /* =========================================================
       SAVE
    ========================================================= */

    const toggleSave = (id) => {
        if (savedJobs.includes(id)) {
            setSavedJobs(savedJobs.filter((item) => item !== id));
        } else {
            setSavedJobs([...savedJobs, id]);
        }
    };

    /* =========================================================
       JOB CARD
    ========================================================= */

    const JobCard = ({ job }) => {
        const saved = savedJobs.includes(job.id);

        return (
            <div className="job-card">
                <div className="job-card-top">
                    <div className="company-logo">{job.logo}</div>

                    <button
                        className={`save-btn ${saved ? "saved" : ""}`}
                        onClick={() => toggleSave(job.id)}
                    >
                        {saved ? "♥" : "♡"}
                    </button>
                </div>

                <div className="job-tag">{job.tag}</div>

                <h3>{job.role}</h3>

                <p className="company-name">{job.company}</p>

                <div className="job-info">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                    <span>🎓 {job.level}</span>
                </div>

                <div className="job-bottom">
                    <strong>{job.salary}</strong>

                    <button
                        className="view-job-btn"
                        onClick={() => setSelectedJob(job)}
                    >
                        View Job →
                    </button>
                </div>
            </div>
        );
    };

    /* =========================================================
       PAGE 1 - DISCOVER
    ========================================================= */

    const DiscoverPage = () => {
        const jobs = filterJobs(allJobs);

        return (
            <>
                <section className="jobs-hero discover-hero">
                    <div className="hero-decoration hero-circle-one"></div>
                    <div className="hero-decoration hero-circle-two"></div>

                    <div className="jobs-hero-content">
                        <span className="small-label">START YOUR SEARCH</span>

                        <h1>
                            Find a job that
                            <br />
                            <span>fits your future.</span>
                        </h1>

                        <p>
                            Explore opportunities from growing startups and leading
                            companies. Your next career move starts here.
                        </p>

                        <div className="hero-search">
                            <div className="search-field">
                                <span>⌕</span>

                                <input
                                    type="text"
                                    placeholder="Job title, skills or company"
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

                            <button
                                onClick={() =>
                                    window.scrollTo({
                                        top: 650,
                                        behavior: "smooth",
                                    })
                                }
                            >
                                Search Jobs
                            </button>
                        </div>
                    </div>

                    <div className="hero-job-preview">
                        <div className="floating-mini-card card-a">
                            <span>✦</span>

                            <div>
                                <b>New opportunities</b>
                                <small>added today</small>
                            </div>
                        </div>

                        <div className="big-job-visual">
                            <div className="visual-logo">S</div>

                            <h3>Software Engineer</h3>

                            <p>Build something meaningful.</p>

                            <div className="visual-line"></div>

                            <div className="visual-row">
                                <span>Remote</span>
                                <span>₹10 LPA</span>
                            </div>
                        </div>

                        <div className="floating-mini-card card-b">
                            <span>✓</span>

                            <div>
                                <b>Easy Apply</b>
                                <small>simple application</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="jobs-section">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">EXPLORE</span>

                            <h2>Featured opportunities</h2>

                            <p>
                                Handpicked roles to help you discover your next move.
                            </p>
                        </div>

                        <div className="result-count">
                            {jobs.length} opportunities
                        </div>
                    </div>

                    <div className="category-row">
                        <button className="category active">All Jobs</button>

                        <button
                            className="category"
                            onClick={() => setCurrentPage(2)}
                        >
                            Latest
                        </button>

                        <button
                            className="category"
                            onClick={() => setCurrentPage(3)}
                        >
                            Internships
                        </button>

                        <button
                            className="category"
                            onClick={() => setCurrentPage(4)}
                        >
                            Startups
                        </button>

                        <button
                            className="category"
                            onClick={() => setCurrentPage(5)}
                        >
                            Remote
                        </button>
                    </div>

                    <div className="jobs-grid">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="no-results">
                                <div>🔎</div>
                                <h3>No jobs found</h3>
                                <p>Try another job title or location.</p>
                            </div>
                        )}
                    </div>
                </section>
            </>
        );
    };

    /* =========================================================
       PAGE 2 - LATEST
    ========================================================= */

    const LatestPage = () => {
        const jobs = filterJobs(latestJobs);

        return (
            <section className="page-section latest-page">
                <div className="inner-container">
                    <div className="different-hero">
                        <div>
                            <span className="section-label">
                                FRESH ON STARTUPHIRE
                            </span>

                            <h1>
                                Latest jobs,
                                <br />
                                <span>new possibilities.</span>
                            </h1>

                            <p>
                                Stay ahead with recently posted opportunities from companies
                                that are actively hiring.
                            </p>
                        </div>

                        <div className="latest-stat-card">
                            <div className="stat-number">24h</div>
                            <span>Fresh opportunities</span>
                            <div className="pulse-dot"></div>
                        </div>
                    </div>

                    <div className="latest-strip">
                        <div>
                            <strong>Recently added</strong>

                            <span>
                                Jobs posted by companies looking for talent right now.
                            </span>
                        </div>

                        <button onClick={() => setCurrentPage(1)}>
                            Explore all jobs →
                        </button>
                    </div>

                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    /* =========================================================
       PAGE 3 - INTERNSHIPS
    ========================================================= */

    const InternshipPage = () => {
        const jobs = filterJobs(internships);

        return (
            <section className="page-section internship-page">
                <div className="inner-container">
                    <div className="internship-hero">
                        <div className="internship-text">
                            <span className="section-label">
                                FOR STUDENTS & FRESHERS
                            </span>

                            <h1>
                                Learn.
                                <br />
                                <span>Build. Grow.</span>
                            </h1>

                            <p>
                                Find internships that give you real-world experience,
                                meaningful projects and a chance to start your career.
                            </p>

                            <div className="internship-points">
                                <div>✓ Real project experience</div>
                                <div>✓ Student-friendly roles</div>
                                <div>✓ Paid opportunities</div>
                            </div>
                        </div>

                        <div className="internship-visual">
                            <div className="visual-note note-one">
                                Internship
                            </div>

                            <div className="visual-note note-two">
                                Build Skills
                            </div>

                            <div className="graduation-card">
                                <div className="graduation-icon">✦</div>

                                <h3>Your first step</h3>

                                <p>towards your career</p>

                                <div className="progress-line">
                                    <span></span>
                                </div>

                                <small>Opportunity unlocked</small>
                            </div>
                        </div>
                    </div>

                    <div className="section-heading internship-heading">
                        <div>
                            <span className="section-label">INTERNSHIPS</span>

                            <h2>Start your career here</h2>

                            <p>
                                Find student-friendly opportunities and gain practical
                                experience.
                            </p>
                        </div>
                    </div>

                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    /* =========================================================
       PAGE 4 - STARTUPS
    ========================================================= */

    const StartupPage = () => {
        const jobs = filterJobs(startupJobs);

        return (
            <section className="page-section startup-page">
                <div className="inner-container">
                    <div className="startup-hero">
                        <div>
                            <span className="section-label">
                                STARTUP WORLD
                            </span>

                            <h1>
                                Work where
                                <br />
                                <span>ideas move fast.</span>
                            </h1>

                            <p>
                                Join ambitious startups, work on real products and grow
                                with teams building what's next.
                            </p>

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    window.scrollTo({
                                        top: 650,
                                        behavior: "smooth",
                                    })
                                }
                            >
                                Explore Startup Jobs →
                            </button>
                        </div>

                        <div className="startup-art">
                            <div className="startup-orbit orbit-one"></div>

                            <div className="startup-orbit orbit-two"></div>

                            <div className="startup-center">
                                <span>✦</span>
                                <b>STARTUP</b>
                                <small>BUILD • CREATE • GROW</small>
                            </div>
                        </div>
                    </div>

                    <div className="startup-features">
                        <div>
                            <strong>Fast Growth</strong>
                            <span>Learn by doing.</span>
                        </div>

                        <div>
                            <strong>Real Impact</strong>
                            <span>Your work matters.</span>
                        </div>

                        <div>
                            <strong>Creative Teams</strong>
                            <span>Build with innovators.</span>
                        </div>
                    </div>

                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                TRENDING STARTUPS
                            </span>

                            <h2>Opportunities worth exploring</h2>

                            <p>
                                Discover roles at fast-growing startup teams.
                            </p>
                        </div>
                    </div>

                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    /* =========================================================
       PAGE 5 - REMOTE
    ========================================================= */

    const RemotePage = () => {
        const jobs = filterJobs(remoteJobs);

        return (
            <section className="page-section remote-page">
                <div className="inner-container">
                    <div className="remote-hero">
                        <div className="remote-copy">
                            <span className="section-label">
                                WORK FROM ANYWHERE
                            </span>

                            <h1>
                                Your desk
                                <br />
                                <span>can be anywhere.</span>
                            </h1>

                            <p>
                                Discover remote-friendly opportunities that give you
                                the flexibility to work from wherever you do your best
                                work.
                            </p>

                            <div className="remote-badges">
                                <span>🌎 Worldwide</span>
                                <span>🏠 Work From Home</span>
                                <span>⏰ Flexible</span>
                            </div>
                        </div>

                        <div className="remote-visual">
                            <div className="cloud cloud-one">☁</div>

                            <div className="cloud cloud-two">☁</div>

                            <div className="laptop-card">
                                <div className="laptop-top">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <div className="laptop-screen">
                                    <div className="screen-logo">S</div>

                                    <h3>Remote Work</h3>

                                    <p>Work from anywhere.</p>

                                    <div className="screen-location">
                                        <span>📍</span>
                                        <b>Anywhere</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                REMOTE OPPORTUNITIES
                            </span>

                            <h2>Work without boundaries</h2>

                            <p>
                                Explore roles designed for flexible and remote work.
                            </p>
                        </div>
                    </div>

                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    /* =========================================================
       PAGE 6 - COMPANIES
    ========================================================= */

    const CompaniesPage = () => {
        return (
            <section className="page-section companies-page">
                <div className="inner-container">
                    <div className="companies-hero">
                        <span className="section-label">
                            DISCOVER COMPANIES
                        </span>

                        <h1>
                            Meet the teams
                            <br />
                            <span>building tomorrow.</span>
                        </h1>

                        <p>
                            Explore companies, learn about their work and discover
                            open opportunities.
                        </p>
                    </div>

                    <div className="company-grid">
                        {companies.map((company, index) => (
                            <div className="company-card" key={index}>
                                <div className="company-card-top">
                                    <div className="large-company-logo">
                                        {company.logo}
                                    </div>

                                    <span className="company-openings">
                                        {company.openings} openings
                                    </span>
                                </div>

                                <h3>{company.name}</h3>

                                <span className="company-category">
                                    {company.category}
                                </span>

                                <p>{company.description}</p>

                                <button
                                    onClick={() =>
                                        setSelectedJob({
                                            id: `company-${index}`,
                                            company: company.name,
                                            logo: company.logo,
                                            role: `${company.openings} Open Positions`,
                                            location: "Multiple Locations",
                                            type: "Full Time",
                                            level: "Multiple Levels",
                                            salary: "View available roles",
                                            tag: "Hiring",
                                        })
                                    }
                                >
                                    View Open Roles →
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="company-bottom">
                        <div>
                            <span className="section-label">
                                FIND YOUR PLACE
                            </span>

                            <h2>One platform. Many possibilities.</h2>

                            <p>
                                Whether you're looking for your first internship or
                                your next big opportunity, explore companies that
                                match your goals.
                            </p>
                        </div>

                        <button
                            className="primary-btn"
                            onClick={() => setCurrentPage(1)}
                        >
                            Explore Jobs →
                        </button>
                    </div>
                </div>
            </section>
        );
    };

    /* =========================================================
       PAGE SWITCH
    ========================================================= */

    const changePage = (number) => {
        setCurrentPage(number);
        setMobileMenu(false);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return <DiscoverPage />;

            case 2:
                return <LatestPage />;

            case 3:
                return <InternshipPage />;

            case 4:
                return <StartupPage />;

            case 5:
                return <RemotePage />;

            case 6:
                return <CompaniesPage />;

            default:
                return <DiscoverPage />;
        }
    };

    /* =========================================================
       RETURN
    ========================================================= */

    return (
        <div className="jobs-page">

            {/* =====================================================
          MAIN WEBSITE NAVBAR
      ===================================================== */}

            <nav className="main-navbar">

                <div
                    className="main-logo"
                    onClick={() => (window.location.href = "/")}
                >
                    <span className="logo-star">✦</span>
                    Startup<span>Hire</span>
                </div>

                <div className={`main-nav-links ${mobileMenu ? "open" : ""}`}>

                    <button
                        onClick={() => (window.location.href = "/")}
                    >
                        Home
                    </button>

                    <button className="active">
                        Jobs
                    </button>

                    <button>
                        Companies
                    </button>

                    <button>
                        About
                    </button>

                    <button>
                        Contact
                    </button>

                </div>

                <button
                    className="main-mobile-btn"
                    onClick={() => setMobileMenu(!mobileMenu)}
                >
                    ☰
                </button>

            </nav>


            {/* =====================================================
          JOBS SUB NAVBAR
      ===================================================== */}

            <div className="jobs-subnav">

                <div className="jobs-subnav-inner">

                    {pages.map((page, index) => (
                        <button
                            key={page}
                            className={
                                currentPage === index + 1
                                    ? "active"
                                    : ""
                            }
                            onClick={() => changePage(index + 1)}
                        >
                            {page}
                        </button>
                    ))}

                </div>

            </div>


            {/* =====================================================
          CONTENT
      ===================================================== */}

            {renderPage()}


            {/* =====================================================
          PAGE NAVIGATION
      ===================================================== */}

            <section className="page-navigation">

                <div className="page-nav-inner">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => changePage(currentPage - 1)}
                    >
                        ← Previous
                    </button>

                    <div className="page-numbers">

                        {pages.map((page, index) => (
                            <button
                                key={page}
                                className={
                                    currentPage === index + 1
                                        ? "active"
                                        : ""
                                }
                                onClick={() => changePage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                    </div>

                    <button
                        disabled={currentPage === 6}
                        onClick={() => changePage(currentPage + 1)}
                    >
                        Next →
                    </button>

                </div>

            </section>


            {/* =====================================================
          FOOTER
      ===================================================== */}

            <footer className="jobs-footer">

                <div className="footer-logo">
                    <span>✦</span> Startup<span>Hire</span>
                </div>

                <p>
                    Find opportunities. Build your future.
                </p>

                <div className="footer-links">

                    <button onClick={() => changePage(1)}>
                        Jobs
                    </button>

                    <button onClick={() => changePage(3)}>
                        Internships
                    </button>

                    <button onClick={() => changePage(4)}>
                        Startups
                    </button>

                    <button onClick={() => changePage(6)}>
                        Companies
                    </button>

                </div>

                <small>
                    © 2026 StartupHire. All rights reserved.
                </small>

            </footer>


            {/* =====================================================
          JOB MODAL
      ===================================================== */}

            {selectedJob && (
                <div
                    className="job-modal-overlay"
                    onClick={() => setSelectedJob(null)}
                >

                    <div
                        className="job-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="modal-close"
                            onClick={() => setSelectedJob(null)}
                        >
                            ×
                        </button>

                        <div className="modal-logo">
                            {selectedJob.logo}
                        </div>

                        <span className="modal-tag">
                            {selectedJob.tag}
                        </span>

                        <h2>{selectedJob.role}</h2>

                        <h4>{selectedJob.company}</h4>

                        <div className="modal-details">

                            <span>
                                📍 {selectedJob.location}
                            </span>

                            <span>
                                💼 {selectedJob.type}
                            </span>

                            <span>
                                🎓 {selectedJob.level}
                            </span>

                            <span>
                                💰 {selectedJob.salary}
                            </span>

                        </div>

                        <div className="modal-description">

                            <h3>
                                About this opportunity
                            </h3>

                            <p>
                                This opportunity is designed for candidates who want
                                to learn, contribute and grow with a modern team.
                                Explore the role, understand the requirements and
                                take your next career step.
                            </p>

                        </div>

                        <button className="apply-btn">
                            Apply Now →
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Jobs;