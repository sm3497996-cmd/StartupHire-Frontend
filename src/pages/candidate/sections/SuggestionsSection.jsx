export default function SuggestionsSection({
    allJobs,
    renderJobCard,
}) {
    return (
        <section className="jobs-section">

                            <div className="section-heading">
                                <div>
                                    <span className="section-kicker">
                                        JUST FOR YOU
                                    </span>

                                    <h2>Suggested opportunities</h2>

                                    <p>
                                        Based on your skills and recent
                                        activity on StartupHire.
                                    </p>
                                </div>
                            </div>

                            <div className="extra-jobs-grid">
                                {allJobs.slice(0, 6).map(renderJobCard)}
                            </div>

                        </section>
    );
}
