import { CandidateIcon as Icon } from "../../../components/ui/Icon";
import MyApplicationCard from "../components/MyApplicationCard";

export default function ApplicationsSection({
    APP_COLORS,
    appFilter,
    applications,
    appsLoading,
    setAppFilter,
}) {
    return (
        <section className="applications-v2">

                            <div className="insta-strip">
                                {applications.map((app, index) => {
                                    const companyName =
                                        app.company_name || app.company || "Company";

                                    const initials = companyName
                                        .trim()
                                        .split(/\s+/)
                                        .map((word) => word[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();

                                    const color =
                                        APP_COLORS[index % APP_COLORS.length];

                                    return (
                                        <button
                                            key={app.id}
                                            className="insta-strip-item"
                                            onClick={() =>
                                                document
                                                    .getElementById(`app-card-${app.id}`)
                                                    ?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "center",
                                                    })
                                            }
                                        >
                                            <span
                                                className="insta-ring"
                                                style={{ "--ring": color }}
                                            >
                                                <span
                                                    className="insta-avatar"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${color}, ${color}99)`,
                                                    }}
                                                >
                                                    {initials}
                                                </span>
                                            </span>

                                            <small>{companyName}</small>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="applications-v2-head">
                                <div className="app-summary-card total">
                                    <div className="app-summary-icon">
                                        <Icon name="briefcase" size={20} />
                                    </div>
                                    <div>
                                        <strong>{applications.length}</strong>
                                        <span>Total Applications</span>
                                    </div>
                                </div>

                                <div className="app-summary-card active">
                                    <div className="app-summary-icon">
                                        <Icon name="sparkle" size={20} />
                                    </div>
                                    <div>
                                        <strong>
                                            {applications.filter((a) => a.status !== "Rejected").length}
                                        </strong>
                                        <span>Active</span>
                                    </div>
                                </div>

                                <div className="app-summary-card shortlisted">
                                    <div className="app-summary-icon">
                                        <Icon name="bookmark" size={20} />
                                    </div>
                                    <div>
                                        <strong>
                                            {applications.filter((a) => a.status === "Shortlisted" || a.status === "Selected").length}
                                        </strong>
                                        <span>Shortlisted</span>
                                    </div>
                                </div>
                            </div>

                            <div className="filter-chips" style={{ marginBottom: 16 }}>
                                {["All", "Applied", "Shortlisted", "Selected", "Rejected"].map((s) => (
                                    <button
                                        key={s}
                                        className={`chip ${appFilter === s ? "active" : ""}`}
                                        onClick={() => setAppFilter(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {appsLoading && <p>Loading applications...</p>}

                            <div className="apps-blue-grid">
                                {applications
                                    .filter((a) => appFilter === "All" || a.status === appFilter)
                                    .map((a) => (
                                        <MyApplicationCard key={a.id} app={a} />
                                    ))}
                            </div>

                            {applications.length === 0 && !appsLoading && (
                                <div className="empty-state">
                                    <div>⌕</div>
                                    <h3>No applications yet</h3>
                                    <p>Apply to jobs and track their status here.</p>
                                </div>
                            )}

                        </section>
    );
}
