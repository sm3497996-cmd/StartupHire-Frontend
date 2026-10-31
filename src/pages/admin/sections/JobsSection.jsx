import { AdminIcon as Icon } from "../../../components/ui/Icon";

export default function JobsSection({
    jobs,
    pendingJobs,
    setJobStatus,
}) {
    return (
        <>
            <div className="sa-banner warn">
                <Icon name="alert" size={26} />
                <div>
                    <strong>{pendingJobs} jobs need your review</strong>
                    <p>Approve genuine listings and remove suspicious ones.</p>
                </div>
            </div>
            <div className="sa-jobs">
                {jobs.map((j) => (
                    <article className="sa-job" key={j.id}>
                        <span className="sa-job-logo" style={{ background: `linear-gradient(135deg, ${j.color}, ${j.color}99)` }}>{j.title.charAt(0)}</span>
                        <div className="sa-job-info">
                            <strong>{j.title}</strong>
                            <span>{j.company} · {j.city} · {j.applicants} applicants</span>
                        </div>
                        <span className={`sa-status job-${j.status.toLowerCase()}`}>{j.status}</span>
                        <div className="sa-job-actions">
                            {(j.status === "Pending" || j.status === "Flagged") && (
                                <button className="sa-btn sa-btn-soft" onClick={() => setJobStatus(j.id, "Live")}>
                                    <Icon name="check" size={16} /> Approve
                                </button>
                            )}
                            {j.status !== "Removed" && (
                                <button className="sa-btn sa-btn-danger-soft" onClick={() => setJobStatus(j.id, "Removed")}>
                                    <Icon name="trash" size={16} /> Remove
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </>
    );
}
