import { CandidateIcon as Icon } from "../../../components/ui/Icon";

export default function SavedJobsSection({
    allJobs,
    renderJobCard,
    saved,
    setActive,
}) {
    return (
        saved.length > 0 ? (
                            <section className="jobs-section">
                                <div className="extra-jobs-grid">
                                    {allJobs
                                        .filter((j) => saved.includes(j.id))
                                        .map(renderJobCard)}
                                </div>
                            </section>
                        ) : (
                            <section className="content-panel">

                                <div className="big-panel-icon purple-bg">
                                    <Icon name="bookmark" size={35} />
                                </div>

                                <h2>Your Saved Jobs</h2>

                                <p>
                                    Jobs you save will appear here so you can
                                    easily come back to them later.
                                </p>

                                <button
                                    className="primary-btn"
                                    onClick={() => setActive("find")}
                                >
                                    Find More Jobs
                                </button>

                            </section>
                        )
    );
}
