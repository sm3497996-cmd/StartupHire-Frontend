import { useState } from "react";
import "./CandidateLanding.css";
import "./CandidateLanding.dark.css";
import { applications, jobs, skills } from "./data/candidateLanding";

function Candidate() {

    /* =====================================================
       EXPLORE JOBS STATES
       ===================================================== */

    const [selectedJob, setSelectedJob] = useState(null);

    const [locationFilter, setLocationFilter] =
        useState("All Locations");

    const [jobTypeFilter, setJobTypeFilter] =
        useState([]);

    const [activeTab, setActiveTab] =
        useState("All Jobs");

    const [appliedFilters, setAppliedFilters] =
        useState(false);


    /* =====================================================
       JOB TYPE FILTER
       ===================================================== */

    const toggleJobType = (type) => {

        setJobTypeFilter((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type]
        );

    };


    /* =====================================================
       FILTERED JOBS
       ===================================================== */

    const filteredJobs = jobs.filter((job) => {

        if (
            appliedFilters &&
            locationFilter !== "All Locations" &&
            job.location !== locationFilter
        ) {
            return false;
        }

        if (
            appliedFilters &&
            jobTypeFilter.length > 0 &&
            !jobTypeFilter.includes(job.type)
        ) {
            return false;
        }

        if (
            activeTab === "Full Time" &&
            job.type !== "Full Time"
        ) {
            return false;
        }

        if (
            activeTab === "Part Time" &&
            job.type !== "Part Time"
        ) {
            return false;
        }

        if (
            activeTab === "Remote" &&
            job.location !== "Remote"
        ) {
            return false;
        }

        if (
            activeTab === "Hybrid" &&
            job.location !== "Hybrid"
        ) {
            return false;
        }

        return true;
    });


    /* =====================================================
       RESET FILTERS
       ===================================================== */

    const resetFilters = () => {

        setLocationFilter("All Locations");
        setJobTypeFilter([]);
        setActiveTab("All Jobs");
        setAppliedFilters(false);

    };


    return (

        <div className="candidate-page">


            {/* =====================================================
                NAVBAR
               ===================================================== */}


            {/* =====================================================
                HERO
               ===================================================== */}

            <section
                className="candidate-hero"
                id="candidate-home"
            >

                <div className="hero-glow hero-glow-one"></div>

                <div className="hero-glow hero-glow-two"></div>


                <div className="hero-content">

                    <div className="small-badge">
                        FOR CANDIDATES
                    </div>


                    <h1>
                        Your next big opportunity
                        <br />
                        is just <span>a click away.</span>
                    </h1>


                    <p>
                        Find your dream job, work with amazing startups,
                        and build the career you've always imagined.
                    </p>


                    <div className="hero-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search jobs, skills or companies..."
                        />

                        <button>
                            ⌕
                        </button>

                    </div>


                    <div className="hero-tags">

                        <span>
                            Frontend Developer
                        </span>

                        <span>
                            UI/UX Designer
                        </span>

                        <span>
                            Product Manager
                        </span>

                        <span>
                            Full Stack
                        </span>

                    </div>


                    <div className="hero-stats">

                        <div>
                            <strong>
                                2,400+
                            </strong>

                            <small>
                                Startups hiring
                            </small>
                        </div>


                        <div>
                            <strong>
                                38,000+
                            </strong>

                            <small>
                                Candidates placed
                            </small>
                        </div>


                        <div>
                            <strong>
                                6 days
                            </strong>

                            <small>
                                Avg. time to hire
                            </small>
                        </div>


                        <div>
                            <strong>
                                22
                            </strong>

                            <small>
                                Cities in India
                            </small>
                        </div>

                    </div>

                </div>


                <div className="hero-person">

                    <div className="hero-circle"></div>


                    <img
                        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85"
                        alt="Candidate"
                    />


                    <div className="floating-note">

                        ✦

                        <span>
                            Build
                            <br />
                            Your Future
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================================
                JOB DISCOVERY / EXPLORE JOBS
               ===================================================== */}

            <section
                className="jobs-section"
                id="candidate-jobs"
            >

                <div className="section-intro">

                    <div className="small-badge light-badge">
                        EXPLORE JOBS
                    </div>


                    <h2>
                        Find the perfect role
                        <br />
                        for your <span>next chapter.</span>
                    </h2>


                    <p>
                        Explore thousands of jobs from innovative startups
                        and growing companies.
                    </p>

                </div>


                <div className="jobs-layout">


                    {/* =================================================
                        LEFT FILTERS
                       ================================================= */}

                    <aside className="job-filters">


                        <label>
                            Location
                        </label>


                        <select
                            value={locationFilter}
                            onChange={(e) =>
                                setLocationFilter(e.target.value)
                            }
                        >

                            <option>
                                All Locations
                            </option>

                            <option>
                                Bangalore
                            </option>

                            <option>
                                Mumbai
                            </option>

                            <option>
                                Delhi
                            </option>

                            <option>
                                Hyderabad
                            </option>

                            <option>
                                Remote
                            </option>

                        </select>


                        <label>
                            Experience Level
                        </label>


                        <div className="check-item">

                            <input
                                type="checkbox"
                            />

                            Fresher

                        </div>


                        <div className="check-item">

                            <input
                                type="checkbox"
                            />

                            1-3 years

                        </div>


                        <div className="check-item">

                            <input
                                type="checkbox"
                            />

                            3-5 years

                        </div>


                        <div className="check-item">

                            <input
                                type="checkbox"
                            />

                            5+ years

                        </div>


                        <label>
                            Job Type
                        </label>


                        <div className="check-item">

                            <input
                                type="checkbox"
                                checked={
                                    jobTypeFilter.includes("Full Time")
                                }
                                onChange={() =>
                                    toggleJobType("Full Time")
                                }
                            />

                            Full Time

                        </div>


                        <div className="check-item">

                            <input
                                type="checkbox"
                                checked={
                                    jobTypeFilter.includes("Internship")
                                }
                                onChange={() =>
                                    toggleJobType("Internship")
                                }
                            />

                            Internship

                        </div>


                        <div className="check-item">

                            <input
                                type="checkbox"
                                checked={
                                    jobTypeFilter.includes("Contract")
                                }
                                onChange={() =>
                                    toggleJobType("Contract")
                                }
                            />

                            Contract

                        </div>


                        <button
                            className="filter-btn"
                            onClick={() =>
                                setAppliedFilters(true)
                            }
                        >
                            Apply Filters
                        </button>


                        <button
                            className="reset-btn"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>

                    </aside>


                    {/* =================================================
                        JOB LIST
                       ================================================= */}

                    <div className="job-list">


                        {/* JOB TABS */}

                        <div className="job-tabs">

                            {[
                                "All Jobs",
                                "Full Time",
                                "Part Time",
                                "Remote",
                                "Hybrid",
                            ].map((tab) => (

                                <button
                                    key={tab}
                                    className={
                                        activeTab === tab
                                            ? "active-tab"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveTab(tab)
                                    }
                                >

                                    {tab === "All Jobs" && "✦ "}

                                    {tab}

                                </button>

                            ))}

                        </div>


                        {/* JOB RESULTS */}

                        {filteredJobs.length > 0 ? (

                            filteredJobs.map((job, index) => (

                                <div
                                    className="job-row"
                                    key={index}
                                    onClick={() =>
                                        setSelectedJob(job)
                                    }
                                >


                                    <div className="job-logo">
                                        {job.logo}
                                    </div>


                                    <div className="job-info">

                                        <h3>
                                            {job.title}
                                        </h3>

                                        <p>
                                            {job.company}
                                        </p>


                                        <div className="job-meta">

                                            <span>
                                                ⌖ {job.location}
                                            </span>

                                            <span>
                                                ◷ {job.type}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="job-right">

                                        <strong>
                                            {job.salary}
                                        </strong>

                                        <span className="match">
                                            Match {job.match}
                                        </span>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedJob(job);
                                            }}
                                        >
                                            ›
                                        </button>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="no-job-results">

                                <div>
                                    🔍
                                </div>

                                <h3>
                                    No jobs found
                                </h3>

                                <p>
                                    Try changing your filters or job category.
                                </p>

                                <button
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>

                            </div>

                        )}


                        {/* JOB ALERT */}

                        <div className="create-job-alert">

                            <span>
                                ♧
                            </span>

                            <div>

                                <strong>
                                    Can't find what you're looking for?
                                </strong>

                                <small>
                                    Create a job alert →
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                RECOMMENDED
               ===================================================== */}

            <section className="recommended-section">


                <div className="recommended-top">

                    <div>

                        <div className="small-badge">
                            RECOMMENDED FOR YOU
                        </div>


                        <h2>
                            Handpicked jobs
                            <br />
                            <span>just for you.</span>
                        </h2>


                        <p>
                            Based on your skills, experience and preferences.
                        </p>

                    </div>


                    <div className="smart-match">

                        <div>
                            ⚡
                        </div>

                        <strong>
                            Smart Matches
                        </strong>

                        <small>
                            Higher Chances
                            <br />
                            Better Opportunities
                        </small>

                    </div>

                </div>


                <div className="recommended-grid">

                    {jobs.slice(0, 4).map((job, index) => (

                        <div
                            className="recommended-card"
                            key={index}
                            onClick={() =>
                                setSelectedJob(job)
                            }
                        >


                            <div className="recommend-card-top">

                                <div className="job-logo">
                                    {job.logo}
                                </div>

                                <span>
                                    ♡
                                </span>

                            </div>


                            <h3>
                                {job.title}
                            </h3>


                            <p>
                                {job.company}
                            </p>


                            <div className="recommend-meta">

                                <span>
                                    ⌖ {job.location}
                                </span>

                                <span>
                                    ◷ {job.type}
                                </span>

                            </div>


                            <div className="recommend-bottom">

                                <strong>
                                    {job.salary}
                                </strong>

                                <span>
                                    Match {job.match}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedJob(job);
                                    }}
                                >
                                    →
                                </button>

                            </div>

                        </div>

                    ))}

                </div>


                <div className="recommend-footer">

                    <span>
                        ✦
                    </span>

                    Want more personalized recommendations?

                    <button>
                        Update Profile →
                    </button>

                </div>

            </section>


            {/* =====================================================
                APPLICATION TRACKER
               ===================================================== */}

            <section
                className="applications-section"
                id="candidate-resources"
            >


                <div className="applications-heading">

                    <div className="small-badge light-badge">
                        APPLICATIONS
                    </div>


                    <h2>
                        Track your journey
                        <br />
                        <span>to success.</span>
                    </h2>


                    <p>
                        Stay updated on your applications, interviews and
                        next steps — all in one place.
                    </p>

                </div>


                <div className="paper-plane">

                    <div>
                        ➤
                    </div>

                    <span>
                        You're
                        <br />
                        doing great!
                    </span>

                </div>


                <div className="journey-card">


                    <div className="journey-progress">


                        <div className="journey-step completed">

                            <div>
                                ✓
                            </div>

                            <strong>
                                Applied
                            </strong>

                            <small>
                                5 jobs
                            </small>

                        </div>


                        <div className="journey-line"></div>


                        <div className="journey-step active">

                            <div>
                                ↗
                            </div>

                            <strong>
                                Interview
                            </strong>

                            <small>
                                2 interviews
                            </small>

                        </div>


                        <div className="journey-line"></div>


                        <div className="journey-step">

                            <div>
                                ×
                            </div>

                            <strong>
                                Offer
                            </strong>

                            <small>
                                0 offers
                            </small>

                        </div>


                        <div className="journey-line"></div>


                        <div className="journey-step">

                            <div>
                                ✓
                            </div>

                            <strong>
                                Hired
                            </strong>

                            <small>
                                0 hired
                            </small>

                        </div>

                    </div>


                    <div className="recent-title">

                        <h3>
                            Recent Applications
                        </h3>

                        <span>
                            View all →
                        </span>

                    </div>


                    <div className="application-list">

                        {applications.map((app, index) => (

                            <div
                                className="application-row"
                                key={index}
                            >

                                <div className="job-logo">
                                    {app.logo}
                                </div>


                                <div className="application-info">

                                    <strong>
                                        {app.title}
                                    </strong>

                                    <small>
                                        {app.company}
                                    </small>

                                </div>


                                <small className="application-time">
                                    {app.time}
                                </small>


                                <span
                                    className={`status status-${index}`}
                                >
                                    {app.status}
                                </span>


                                <button>
                                    ›
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* =====================================================
                PROFILE
               ===================================================== */}

            <section className="profile-section">


                <div className="small-badge">
                    YOUR PROFILE
                </div>


                <div className="profile-heading">

                    <div>

                        <h2>
                            Showcase your <span>skills.</span>
                        </h2>

                        <p>
                            Build a profile that gets you noticed by top startups
                            and hiring teams.
                        </p>

                    </div>


                    <div className="complete-profile">

                        ✦

                        <div>

                            <strong>
                                Complete Profile
                            </strong>

                            <small>
                                Get 3x more views
                            </small>

                        </div>

                    </div>

                </div>


                <div className="profile-grid">


                    <div className="profile-main-card">

                        <div className="profile-person">

                            <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                                alt="Profile"
                            />


                            <div>

                                <h3>
                                    Rahul Sharma <span>✓</span>
                                </h3>

                                <p>
                                    Frontend Developer
                                </p>

                                <small>
                                    ⌖ Bangalore, India
                                </small>

                                <div className="available">
                                    Available for new role
                                </div>

                            </div>

                        </div>


                        <button className="edit-profile">
                            Edit Profile
                        </button>


                        <div className="profile-numbers">

                            <div>

                                <strong>
                                    5+
                                </strong>

                                <small>
                                    Years Experience
                                </small>

                            </div>


                            <div>

                                <strong>
                                    12
                                </strong>

                                <small>
                                    Projects
                                </small>

                            </div>


                            <div>

                                <strong>
                                    98%
                                </strong>

                                <small>
                                    Profile Completion
                                </small>

                            </div>

                        </div>

                    </div>


                    <div className="skills-card">

                        <div className="card-heading">

                            <h3>
                                Skills
                            </h3>

                            <span>
                                ⌁
                            </span>

                        </div>


                        <div className="skills-list">

                            {skills.map((skill, index) => (

                                <span key={index}>
                                    {skill}
                                </span>

                            ))}

                        </div>


                        <button className="add-skill">
                            ＋ Add Skills
                        </button>

                    </div>


                    <div className="about-card">

                        <div className="card-heading">

                            <h3>
                                About Me
                            </h3>

                            <span>
                                ✎
                            </span>

                        </div>


                        <p>
                            Passionate Frontend Developer with 5+ years of experience
                            building modern web applications. I love turning ideas
                            into beautiful and scalable products.
                        </p>

                    </div>


                    <div className="resume-card">

                        <div className="card-heading">

                            <h3>
                                Resume
                            </h3>

                            <span>
                                ✎
                            </span>

                        </div>


                        <div className="resume-file">

                            <div>
                                ▤
                            </div>

                            <span>

                                Rahul_Sharma_Resume.pdf

                                <small>
                                    Updated 2 days ago
                                </small>

                            </span>

                        </div>


                        <button>
                            Upload New Resume
                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                CAREER CTA
               ===================================================== */}

            <section
                className="career-section"
                id="candidate-employers"
            >


                <div className="career-content">

                    <div className="small-badge light-badge">
                        YOUR CAREER
                    </div>


                    <h2>
                        Your skills. Our platform.
                        <br />
                        <span>A brighter future.</span>
                    </h2>


                    <p>
                        Join thousands of talented professionals who are
                        building their dream careers with StartupHire.
                    </p>


                    <div className="career-points">


                        <div>

                            <span>
                                ✦
                            </span>

                            <p>
                                Work with innovative startups
                            </p>

                        </div>


                        <div>

                            <span>
                                ♧
                            </span>

                            <p>
                                Get personalized job recommendations
                            </p>

                        </div>


                        <div>

                            <span>
                                ↗
                            </span>

                            <p>
                                Grow your skills and career
                            </p>

                        </div>

                    </div>


                    <button className="explore-btn">
                        Explore Jobs →
                    </button>

                </div>


                <div className="career-image">

                    <div className="career-image-circle"></div>


                    <img
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85"
                        alt="Career"
                    />


                    <div className="dream-note">

                        Dream.
                        <br />
                        Apply.
                        <br />
                        Grow.

                    </div>

                </div>


                <div className="testimonial">

                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                        alt="Candidate"
                    />


                    <div>

                        <p>
                            "StartupHire helped me find my dream job at a startup
                            I love. The process was smooth, transparent and super fast!"
                        </p>

                        <strong>
                            Priya Mehta
                        </strong>

                        <small>
                            Frontend Developer
                        </small>

                    </div>


                    <div className="testimonial-arrows">
                        ← &nbsp; →
                    </div>

                </div>

            </section>


            {/* =====================================================
                FOOTER
               ===================================================== */}

            <footer className="candidate-footer">


                <div className="footer-logo">
                    Startup<span>Hire.</span>
                </div>


                <p>
                    Helping talented people find meaningful careers
                    at innovative startups.
                </p>


                <div className="footer-links">

                    <a href="#candidate-home">
                        Home
                    </a>

                    <a href="#candidate-jobs">
                        Jobs
                    </a>

                    <a href="#candidate-resources">
                        Resources
                    </a>

                    <a href="#candidate-employers">
                        For Employers
                    </a>

                </div>


                <div className="footer-bottom">

                    <span>
                        © 2026 StartupHire. All rights reserved.
                    </span>

                    <span>
                        Made for ambitious careers ✦
                    </span>

                </div>

            </footer>


            {/* =====================================================
                JOB DETAILS POPUP
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
                            className="job-modal-close"
                            onClick={() =>
                                setSelectedJob(null)
                            }
                        >
                            ×
                        </button>


                        <div className="modal-job-logo">
                            {selectedJob.logo}
                        </div>


                        <div className="modal-match">
                            Match {selectedJob.match}
                        </div>


                        <h2>
                            {selectedJob.title}
                        </h2>


                        <p className="modal-company">
                            {selectedJob.company}
                        </p>


                        <div className="modal-job-info">

                            <span>
                                ⌖ {selectedJob.location}
                            </span>

                            <span>
                                ◷ {selectedJob.type}
                            </span>

                            <span>
                                ₹ {selectedJob.salary}
                            </span>

                        </div>


                        <div className="modal-description">

                            <h3>
                                About this role
                            </h3>

                            <p>
                                Join {selectedJob.company} and work on exciting
                                projects with a talented team. This role offers
                                an opportunity to learn, grow and build your career
                                with an innovative company.
                            </p>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="modal-apply-btn"
                                onClick={() =>
                                    alert(
                                        `Application started for ${selectedJob.title}`
                                    )
                                }
                            >
                                Apply Now →
                            </button>


                            <button
                                className="modal-save-btn"
                                onClick={() =>
                                    alert("Job saved!")
                                }
                            >
                                ♡ Save Job
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Candidate;