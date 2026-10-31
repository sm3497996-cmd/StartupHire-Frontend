import { CandidateIcon as Icon } from "../../../components/ui/Icon";

export default function DashboardHomeSection({
    applications,
    dashboardJobs,
    jobsLoading,
    profilePct,
    renderJobCard,
    saved,
    setActive,
}) {
    return (
        <>

                            <section className="stats-row">

                                <div className="stat-card blue">
                                    <div className="stat-icon">
                                        <Icon name="briefcase" size={23} />
                                    </div>

                                    <div>
                                        <span>Applied Jobs</span>
                                        <strong>{applications.length}</strong>
                                        <small>+3 this month</small>
                                    </div>
                                </div>

                                <div className="stat-card purple">
                                    <div className="stat-icon">
                                        <Icon name="bookmark" size={23} />
                                    </div>

                                    <div>
                                        <span>Saved Jobs</span>
                                        <strong>{saved.length}</strong>
                                        <small>Tap ♡ on a job to save</small>
                                    </div>
                                </div>

                                <div className="stat-card orange">
                                    <div className="stat-icon">
                                        <Icon name="user" size={23} />
                                    </div>

                                    <div>
                                        <span>Profile Views</span>
                                        <strong>186</strong>
                                        <small>+18% this week</small>
                                    </div>
                                </div>

                                <div className="stat-card pink">
                                    <div className="stat-icon">
                                        <Icon name="sparkle" size={23} />
                                    </div>

                                    <div>
                                        <span>Profile Score</span>
                                        <strong>{profilePct}%</strong>
                                        <small>Looking great!</small>
                                    </div>
                                </div>

                            </section>

                            <section className="jobs-section">

                                <div className="section-heading">
                                    <div>
                                        <span className="section-kicker">
                                            EXPLORE OPPORTUNITIES
                                        </span>

                                        <h2>
                                            Recommended jobs for you
                                        </h2>

                                        <p>
                                            Handpicked opportunities based
                                            on your profile.
                                        </p>
                                    </div>

                                    <button
                                        className="see-all-btn"
                                        onClick={() => setActive("find")}
                                    >
                                        See all jobs →
                                    </button>
                                </div>

                                <div className="extra-jobs-grid">
                                    {dashboardJobs.map(renderJobCard)}
                                </div>

                                {dashboardJobs.length === 0 && !jobsLoading && (
                                    <div className="empty-state">
                                        <div>⌕</div>
                                        <h3>No jobs found</h3>
                                        <p>Try searching for another role or company.</p>
                                    </div>
                                )}

                            </section>
                        </>
    );
}
