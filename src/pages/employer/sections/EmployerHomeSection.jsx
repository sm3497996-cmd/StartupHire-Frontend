import { EmployerIcon as Icon } from "../../../components/ui/Icon";
import CandidateFilters from "../candidates/CandidateFilters.jsx";

export default function EmployerHomeSection({
    advFilters,
    candidates,
    filter,
    filteredCandidates,
    myJobs,
    renderCandidatesWithPanel,
    setActive,
    setAdvFilters,
    setFilter,
    shortlisted,
}) {
    return (
        <>
            <section className="stats-row">

                <div className="stat-card blue">
                    <div className="stat-icon">
                        <Icon name="briefcase" size={23} />
                    </div>
                    <div>
                        <span>Active Jobs</span>
                        <strong>
                            {myJobs.filter((j) => j.status === "Active").length}
                        </strong>
                        <small>+2 this month</small>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon">
                        <Icon name="users" size={23} />
                    </div>
                    <div>
                        <span>Total Applicants</span>
                        <strong>{myJobs.reduce((sum, j) => sum + (j.applicants || 0), 0)}</strong>
                        <small>+32 this week</small>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">
                        <Icon name="bookmark" size={23} />
                    </div>
                    <div>
                        <span>Shortlisted</span>
                        <strong>{shortlisted.length}</strong>
                        <small>8 interviews set</small>
                    </div>
                </div>

                <div className="stat-card pink">
                    <div className="stat-icon">
                        <Icon name="eye" size={23} />
                    </div>
                    <div>
                        <span>Profile Views</span>
                        <strong>{myJobs.reduce((sum, j) => sum + (j.views || 0), 0)}</strong>
                        <small>+18% this week</small>
                    </div>
                </div>

            </section>

            <section className="jobs-section">

                <div className="section-heading">
                    <div>
                        <span className="section-kicker">
                            DISCOVER TALENT
                        </span>

                        <h2>Top candidates for you</h2>

                        <p>Handpicked profiles based on your open jobs.</p>
                    </div>

                    <button
                        className="see-all-btn"
                        onClick={() => setActive("applicants")}
                    >
                        See all candidates →
                    </button>
                </div>
                <CandidateFilters
                    filters={advFilters}
                    setFilters={setAdvFilters}
                    shown={filteredCandidates.length}
                    total={candidates.length}
                    category={filter}
                    setCategory={setFilter}
                    candidates={candidates}
                    previewCandidates={filteredCandidates}
                    shortlistedCount={shortlisted.length}
                    onViewAll={() => setActive("applicants")}
                />


                {renderCandidatesWithPanel(filteredCandidates)}

            </section>
        </>
    );
}
