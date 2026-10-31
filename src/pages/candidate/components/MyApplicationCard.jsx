import "./MyApplicationCard.css";
import { fmtDate } from "../../../utils/date";
import { initialsOf } from "../../../utils/initials";

/* ================= HELPERS ================= */

export function applicationStats(list = []) {
    const count = (status) =>
        list.filter((app) => app.status === status).length;

    return {
        total: list.length,
        active: count("Applied") + count("Shortlisted"),
        shortlisted: count("Shortlisted"),
        selected: count("Selected"),
        rejected: count("Rejected"),
    };
}

/* ================= ICONS ================= */

const PATHS = {
    pin: (
        <>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),

    brief: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
        </>
    ),

    salary: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7v10M15 9.2c-.7-.8-1.6-1.2-3-1.2-1.7 0-2.8.8-2.8 2s1.1 2 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.4 0-2.4-.4-3-1.2" />
        </>
    ),

    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </>
    ),

    phone: (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    ),

    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
    ),

    check: <path d="m5 12 5 5 9-10" />,

    close: <path d="M6 6l12 12M18 6 6 18" />,
};

const Ic = ({ n, s = 16 }) => (
    <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {PATHS[n]}
    </svg>
);

/* ================= APPLICATION CARD ================= */

export default function MyApplicationCard({ app }) {
    const status = app.status || "Applied";

    const rejected = status === "Rejected";

    const reviewed = status !== "Applied" || !!app.reviewed_at;

    const companyName = app.company_name || "Company";

    const jobTitle = app.job_title || "Job Application";

    // Company initials instead of question mark
    const initials = initialsOf(app.company_name || "CO", "");

    const reviewedBy = app.reviewed_by_name
        ? ` by ${app.reviewed_by_name}`
        : "";

    /* Timeline */

    const events = [
        {
            key: "applied",
            state: "done",
            title: "Application Submitted",
            note: fmtDate(app.applied_at) || "Date unavailable",
        },
        {
            key: "review",
            state: reviewed ? "done" : "wait",
            title: reviewed ? `Reviewed${reviewedBy}` : "Awaiting Review",
            note: reviewed
                ? fmtDate(app.reviewed_at || app.updated_at) || "Under review"
                : "The company has not reviewed your application yet",
        },
    ];

    if (status === "Shortlisted") {
        events.push({
            key: "shortlisted",
            state: "done",
            title: "Shortlisted",
            note: fmtDate(app.updated_at),
        });
    }

    if (status === "Selected") {
        events.push({
            key: "selected",
            state: "done",
            title: "Selected for the Role",
            note: fmtDate(app.updated_at),
        });
    }

    if (rejected) {
        events.push({
            key: "rejected",
            state: "bad",
            title: "Application Not Selected",
            note: fmtDate(app.updated_at),
        });
    }

    /* Progress */

    const reached =
        status === "Selected"
            ? 2
            : status === "Shortlisted"
                ? 1
                : 0;

    const steps = [
        { label: "Applied", on: true },
        { label: "Shortlisted", on: reached >= 1 },
        rejected
            ? { label: "Not Selected", on: true, bad: true }
            : { label: "Selected", on: reached >= 2 },
    ];

    /* Company Contact */

    // Demo contact details — frontend preview only
    const email =
        app.company_email || "hr@acmetechnologies.demo";

    const phone =
        app.company_phone || "+91 90000 12345";

    const site = app.company_website;

    const siteHref =
        site && /^https?:\/\//i.test(site)
            ? site
            : site
                ? `https://${site}`
                : null;

    const subject = encodeURIComponent(
        `Regarding my application for ${app.job_title || "the role"}`
    );

    return (
        <article className={`ap-card st-${status.toLowerCase()}`}>
            <div className="ap-bar" />

            {/* Company and Job Header */}

            <div className="ap-top">
                <div className="ap-av" title={companyName}>
                    {initials || "CO"}
                </div>

                <div className="ap-who">
                    <h3 className="ap-title">{jobTitle}</h3>
                    <p className="ap-co">{companyName}</p>
                </div>

                <span className="ap-pill">
                    <i />
                    {status}
                </span>
            </div>

            <div className="ap-date-row">
                <span>
                    <b>Applied on:</b>{" "}
                    {app.applied_at
                        ? new Date(
                            String(app.applied_at).replace(" ", "T")
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "Date unavailable"}
                </span>

                {app.updated_at && (
                    <span>
                        <b>Last updated:</b>{" "}
                        {new Date(
                            String(app.updated_at).replace(" ", "T")
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                )}
            </div>

            {/* Job Details */}

            <div className="ap-chips">
                {app.location && (
                    <span>
                        <Ic n="pin" /> {app.location}
                    </span>
                )}

                {app.job_type && (
                    <span>
                        <Ic n="brief" /> {app.job_type}
                    </span>
                )}

                {app.salary && (
                    <span>
                        <Ic n="salary" /> {app.salary}
                    </span>
                )}
            </div>

            {/* Application Activity */}

            <ul className="ap-log">
                {events.map((event) => (
                    <li
                        key={event.key}
                        className={`ev-${event.state}`}
                    >
                        <span className="ap-dot">
                            {event.state === "done" && (
                                <Ic n="check" s={11} />
                            )}

                            {event.state === "bad" && (
                                <Ic n="close" s={11} />
                            )}
                        </span>

                        <div>
                            <b>{event.title}</b>
                            <small>{event.note}</small>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Application Progress */}

            <div className="ap-steps">
                {steps.map((step, index) => (
                    <div
                        key={step.label}
                        className={`ap-step ${step.on ? "on" : ""} ${step.bad ? "bad" : ""
                            }`}
                    >
                        <span className="ap-node" />

                        <small>{step.label}</small>

                        {index < steps.length - 1 && (
                            <em
                                className={
                                    steps[index + 1].on ? "fill" : ""
                                }
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* ---------- Contact ---------- */}
            <div className="ap-contact">
                <div className="ap-contact-heading">
                    <div>
                        <span className="ap-contact-eyebrow">GET IN TOUCH</span>
                        <h4>Company Contact</h4>
                    </div>
                </div>

                <div className="ap-ct-row">
                    <a
                        className="ap-btn pri"
                        href={`mailto:${email}?subject=${subject}`}
                    >
                        <Ic n="mail" />
                        Email HR
                    </a>

                    <a
                        className="ap-btn"
                        href={`tel:${phone}`}
                    >
                        <Ic n="phone" />
                        Call Company
                    </a>

                    {siteHref && (
                        <a
                            className="ap-btn"
                            href={siteHref}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Ic n="globe" />
                            Website
                        </a>
                    )}
                </div>

                <p className="ap-contact-note">
                    Demo contact details for preview only.
                </p>
            </div>
        </article>
    );
}