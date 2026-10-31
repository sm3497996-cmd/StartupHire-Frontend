export default function FindJobsSection({
    categoryFilter,
    findJobs,
    jobCategories,
    jobsLoading,
    renderJobCard,
    setCategoryFilter,
}) {
    return (
        <section className="jobs-section">

                            <div className="section-heading">
                                <div>
                                    <span className="section-kicker">
                                        ALL OPPORTUNITIES
                                    </span>

                                    <h2>Find your next job</h2>

                                    <p>
                                        Browse and filter through every
                                        opportunity on StartupHire.
                                    </p>
                                </div>
                            </div>

                            <div className="filter-chips">
                                {jobCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`chip ${categoryFilter === cat ? "active" : ""
                                            }`}
                                        onClick={() => setCategoryFilter(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="extra-jobs-grid">
                                {findJobs.map(renderJobCard)}
                            </div>

                            {findJobs.length === 0 && !jobsLoading && (
                                <div className="empty-state">
                                    <div>⌕</div>
                                    <h3>No jobs found</h3>
                                    <p>Try another keyword or category.</p>
                                </div>
                            )}

                        </section>
    );
}
