import { EmployerIcon as Icon } from "../../../components/ui/Icon";
import { useEffect, useState } from "react";
import JobSocialModal from "../../../components/social/JobSocialModal";
import { socialGet } from "../../../services/socialService";

export default function MyJobsSection({
    company,
    employerName,
    myJobs,
    setActive,
    toggleJobStatus,
}) {
    const [social, setSocial] = useState({ likes: {}, comments: {} });
    const [modal, setModal] = useState(null);

    useEffect(() => {
        socialGet({ action: "summary" })
            .then((d) => d.success && setSocial({ likes: d.likes, comments: d.comments }))
            .catch(() => { });
    }, [myJobs.length]);
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

                                <button className="job-stat" onClick={() => setModal({ job, tab: "likes" })}>
                                    <Icon name="heart" size={19} />
                                    {social.likes[job.id] || 0}
                                </button>
                                <button className="job-stat" onClick={() => setModal({ job, tab: "comments" })}>
                                    <Icon name="comment" size={19} />
                                    {social.comments[job.id] || 0}
                                </button>
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
            {modal && (
                <JobSocialModal
                    jobId={modal.job.id}
                    title={modal.job.title}
                    initialTab={modal.tab}
                    onClose={() => setModal(null)}
                    onChange={(c) => setSocial((s) => ({ ...s, comments: { ...s.comments, [modal.job.id]: c.comments } }))}
                />
            )}
        </section>
    );
}
