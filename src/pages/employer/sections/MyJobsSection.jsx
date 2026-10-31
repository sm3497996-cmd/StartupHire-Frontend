import { EmployerIcon as Icon } from "../../../components/ui/Icon";

export default function MyJobsSection({
    company,
    employerName,
    myJobs,
    setActive,
    toggleJobStatus,
}) {
    return (
        <section className="jobs-section">
                                    <div className="extra-jobs-grid">
                                        {myJobs.map((job) => (
                                            <article className="big-job-card" key={job.id}>
                                                <div
                                                    className="big-card-glow"
                                                    style={{ background: job.color }}
                                                ></div>

                                                <div className="big-job-top">
                                                    <div
                                                        className="big-company-logo"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${job.color}, ${job.color}99)`,
                                                        }}
                                                    >
                                                        {job.title.charAt(0)}
                                                    </div>

                                                    <div className="big-company-info">
                                                        <div className="company-name-row">
                                                            <h3>{job.company_name || company?.name || employerName}</h3>
                                                            <span className="verified-mark">✓</span>
                                                        </div>
                                                        <span>{job.applicants} applicants</span>
                                                    </div>

                                                    {job.status !== "Closed" && (
                                                        <button
                                                            className={`big-save-btn ${job.status === "Paused" ? "saved" : ""
                                                                }`}
                                                            title={
                                                                job.status === "Active"
                                                                    ? "Pause job"
                                                                    : "Resume job"
                                                            }
                                                            onClick={() => toggleJobStatus(job.id)}
                                                        >
                                                            <Icon
                                                                name={
                                                                    job.status === "Active"
                                                                        ? "pause"
                                                                        : "play"
                                                                }
                                                                size={18}
                                                            />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="big-job-main">
                                                    <div className="big-title-row">
                                                        <div>
                                                            <h2>{job.title}</h2>
                                                            <span className="big-posted">
                                                                Posted {job.posted}
                                                            </span>
                                                        </div>

                                                        <span
                                                            className={`open-badge status-badge-${job.status.toLowerCase()}`}
                                                        >
                                                            {job.status}
                                                        </span>
                                                    </div>

                                                    <p className="big-job-summary">{job.summary}</p>

                                                    <div className="big-job-meta">
                                                        <span>
                                                            <Icon name="location" size={16} />
                                                            {job.location}
                                                        </span>
                                                        <span>
                                                            <Icon name="salary" size={16} />
                                                            {job.salary}
                                                        </span>
                                                        <span>
                                                            <Icon name="briefcase" size={16} />
                                                            {job.type}
                                                        </span>
                                                    </div>

                                                    <div className="big-job-tags">
                                                        {(job.skills || []).map((skill) => (
                                                            <span key={skill}>{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="big-card-bottom">
                                                    <div className="big-social">
                                                        <span className="job-stat">
                                                            <Icon name="eye" size={19} />
                                                            {job.views}
                                                        </span>

                                                        <span className="job-stat">
                                                            <Icon name="users" size={19} />
                                                            {job.applicants}
                                                        </span>
                                                    </div>

                                                    <button
                                                        className="big-view-btn"
                                                        onClick={() => setActive("applicants")}
                                                    >
                                                        View Applicants
                                                        <Icon name="arrow" size={16} />
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
    );
}
