import { useEffect, useState } from "react";
import { API_LARAVEL } from "../../config/env";
import { safeLink } from "../../utils/safeLink";

const API = `${API_LARAVEL}/resume`;

const fmtMonth = (d) => {
    if (!d) return "";
    const [y, m] = String(d).slice(0, 10).split("-");
    const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return m ? `${names[Number(m) - 1] || m} ${y}` : y || "";
};

const fmtDate = (d) => (d ? String(d).slice(0, 10).split("-").reverse().join("-") : "");

function Row({ label, value }) {
    if (!value) return null;
    return (
        <div className="crv-row">
            <small>{label}</small>
            <strong>{value}</strong>
        </div>
    );
}

function Files({ items }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="crv-files">
            {items.map((a) => (
                <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="crv-file">
                    {/^image\//.test(a.mime || "") ? <img src={a.url} alt="" /> : <span className="crv-pdf">PDF</span>}
                    <span>{a.name}</span>
                </a>
            ))}
        </div>
    );
}

function Reference({ item }) {
    if (!item.reference_name && !item.reference_contact && !item.reference_email) return null;
    return (
        <div className="crv-ref">
            <b>Reference</b>
            <span>
                {item.reference_name}
                {item.reference_designation ? `, ${item.reference_designation}` : ""}
            </span>
            {item.reference_contact && (
                <a href={`tel:${item.reference_contact}`}>{item.reference_contact}</a>
            )}
            {item.reference_email && (
                <a href={`mailto:${item.reference_email}`}>{item.reference_email}</a>
            )}
        </div>
    );
}

export default function CandidateResumeView({ candidateId }) {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!candidateId) return;
        let cancelled = false;
        setLoading(true);
        setError("");
        setResume(null);

        fetch(`${API}/${candidateId}`, {
            credentials: "include",
            headers: { Accept: "application/json" },
        })
            .then((r) => r.json())
            .then((d) => {
                if (cancelled) return;
                if (d.success) setResume(d.resume);
                else setError(d.message || "Resume could not be loaded");
            })
            .catch(() => !cancelled && setError("Resume could not be loaded"))
            .finally(() => !cancelled && setLoading(false));

        return () => {
            cancelled = true;
        };
    }, [candidateId]);

    if (loading) return <p className="crv-muted">Loading resume...</p>;
    if (error) return <p className="crv-muted">{error}</p>;
    if (!resume) return null;

    const p = resume.personal || {};
    const atts = resume.attachments || [];
    const attFor = (section, id) =>
        atts.filter((a) => a.section === section && Number(a.item_id) === Number(id));

    const address = [p.address, p.city, p.state, p.country, p.pincode].filter(Boolean).join(", ");
    const hasPersonal = p.contact || p.whatsapp || p.gender || p.dob || address;

    return (
        <div className="crv">
            <style>{`
                .crv { display: grid; gap: 14px; margin-top: 6px; }
                .crv-muted { opacity: .6; font-size: 13.5px; }
                .crv-block {
                    border: 1.5px solid rgba(120,120,140,.22);
                    border-radius: 16px; padding: 16px 18px;
                    background: rgba(120,120,140,.04);
                }
                .crv-block h3 {
                    margin: 0 0 12px; font-size: 13px; font-weight: 800;
                    text-transform: uppercase; letter-spacing: .6px;
                    background: linear-gradient(135deg, #f7971e, #ee2a7b, #6228d7);
                    -webkit-background-clip: text; background-clip: text; color: transparent;
                }
                .crv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 16px; }
                .crv-row small { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; opacity: .55; letter-spacing: .4px; }
                .crv-row strong { font-size: 14px; font-weight: 600; word-break: break-word; }
                .crv-item { padding: 12px 0; border-top: 1px dashed rgba(120,120,140,.28); }
                .crv-item:first-of-type { border-top: none; padding-top: 0; }
                .crv-item h4 { margin: 0; font-size: 15px; }
                .crv-sub { font-size: 13px; opacity: .7; margin: 2px 0 6px; }
                .crv-desc { font-size: 13.5px; line-height: 1.55; margin: 6px 0 0; white-space: pre-line; opacity: .9; }
                .crv-chips { display: flex; flex-wrap: wrap; gap: 8px; }
                .crv-chip {
                    padding: 5px 12px; border-radius: 16px; font-size: 12.5px; font-weight: 600;
                    background: rgba(98,40,215,.1); color: #6228d7;
                }
                .crv-link { font-size: 13px; font-weight: 700; color: #ee2a7b; text-decoration: none; }
                .crv-ref {
                    margin-top: 10px; padding: 9px 12px; border-radius: 12px;
                    background: rgba(238,42,123,.07); border: 1px dashed rgba(238,42,123,.35);
                    display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 13px; align-items: center;
                }
                .crv-ref b { color: #ee2a7b; font-size: 11.5px; text-transform: uppercase; letter-spacing: .4px; }
                .crv-ref a { color: inherit; font-weight: 600; text-decoration: none; }
                .crv-files { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
                .crv-file {
                    display: inline-flex; align-items: center; gap: 8px; max-width: 200px;
                    border: 1.5px solid rgba(120,120,140,.25); border-radius: 10px;
                    padding: 5px 8px; color: inherit; text-decoration: none; font-size: 12px;
                }
                .crv-file img { width: 30px; height: 30px; border-radius: 6px; object-fit: cover; }
                .crv-file span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .crv-pdf {
                    width: 30px; height: 30px; border-radius: 6px; background: #ef4444; color: #fff;
                    display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;
                }
                @media (max-width: 480px) { .crv-grid { grid-template-columns: 1fr; } }
            `}</style>

            {p.profile_summary && (
                <div className="crv-block">
                    <h3>About</h3>
                    <p className="crv-desc" style={{ margin: 0 }}>{p.profile_summary}</p>
                </div>
            )}

            {hasPersonal && (
                <div className="crv-block">
                    <h3>Personal Information</h3>
                    <div className="crv-grid">
                        <Row label="Phone" value={p.contact} />
                        <Row label="WhatsApp" value={p.whatsapp} />
                        <Row label="Gender" value={p.gender} />
                        <Row label="Date of Birth" value={fmtDate(p.dob)} />
                        <div style={{ gridColumn: "1 / -1" }}>
                            <Row label="Address" value={address} />
                        </div>
                    </div>
                </div>
            )}

            {resume.education?.length > 0 && (
                <div className="crv-block">
                    <h3>Education</h3>
                    {resume.education.map((e) => (
                        <div className="crv-item" key={e.id}>
                            <h4>{e.degree_name}{e.specialization ? `, ${e.specialization}` : ""}</h4>
                            <div className="crv-sub">
                                {[e.board_university, e.education_level].filter(Boolean).join(" · ")}
                            </div>
                            <div className="crv-sub">
                                {[
                                    e.start_year || e.end_year ? `${e.start_year || ""} - ${e.end_year || ""}` : "",
                                    e.percentage_cgpa ? `Score: ${e.percentage_cgpa}` : "",
                                ].filter(Boolean).join(" · ")}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {resume.skills?.length > 0 && (
                <div className="crv-block">
                    <h3>Skills</h3>
                    <div className="crv-chips">
                        {resume.skills.map((s) => (
                            <span className="crv-chip" key={s.id}>{s.skill_name}</span>
                        ))}
                    </div>
                </div>
            )}

            {resume.experience?.length > 0 && (
                <div className="crv-block">
                    <h3>Work Experience</h3>
                    {resume.experience.map((e) => (
                        <div className="crv-item" key={e.id}>
                            <h4>{e.designation}</h4>
                            <div className="crv-sub">
                                {[e.company_name, e.employment_type, e.location].filter(Boolean).join(" · ")}
                            </div>
                            <div className="crv-sub">
                                {fmtMonth(e.start_date)} - {e.currently_working ? "Present" : fmtMonth(e.end_date)}
                            </div>
                            {e.job_description && <p className="crv-desc">{e.job_description}</p>}
                            <Reference item={e} />
                            <Files items={attFor("experience", e.id)} />
                        </div>
                    ))}
                </div>
            )}

            {resume.projects?.length > 0 && (
                <div className="crv-block">
                    <h3>Projects</h3>
                    {resume.projects.map((x) => (
                        <div className="crv-item" key={x.id}>
                            <h4>{x.project_title}</h4>
                            {x.technologies_used && (
                                <div className="crv-chips" style={{ margin: "6px 0" }}>
                                    {x.technologies_used.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                                        <span className="crv-chip" key={t}>{t}</span>
                                    ))}
                                </div>
                            )}
                            {x.description && <p className="crv-desc">{x.description}</p>}
                            {safeLink(x.project_url) && (
                                <p style={{ margin: "8px 0 0" }}>
                                    <a className="crv-link" href={safeLink(x.project_url)} target="_blank" rel="noopener noreferrer">
                                        View Project →
                                    </a>
                                </p>
                            )}
                            <Reference item={x} />
                            <Files items={attFor("project", x.id)} />
                        </div>
                    ))}
                </div>
            )}

            {resume.courses?.length > 0 && (
                <div className="crv-block">
                    <h3>Courses & Certifications</h3>
                    {resume.courses.map((c) => (
                        <div className="crv-item" key={c.id}>
                            <h4>{c.title}</h4>
                            <div className="crv-sub">
                                {[c.issued_by, c.credential_id ? `ID: ${c.credential_id}` : ""].filter(Boolean).join(" · ")}
                            </div>
                            {(c.issue_date || c.expiry_date) && (
                                <div className="crv-sub">
                                    {fmtDate(c.issue_date)}{c.expiry_date ? ` - ${fmtDate(c.expiry_date)}` : ""}
                                </div>
                            )}
                            {c.details && <p className="crv-desc">{c.details}</p>}
                            {safeLink(c.certificate_url) && (
                                <p style={{ margin: "8px 0 0" }}>
                                    <a className="crv-link" href={safeLink(c.certificate_url)} target="_blank" rel="noopener noreferrer">
                                        View Certificate →
                                    </a>
                                </p>
                            )}
                            <Files items={attFor("course", c.id)} />
                        </div>
                    ))}
                </div>
            )}

            {resume.achievements?.length > 0 && (
                <div className="crv-block">
                    <h3>Achievements</h3>
                    {resume.achievements.map((a) => (
                        <div className="crv-item" key={a.id}>
                            <h4>{a.title}</h4>
                            {a.description && <p className="crv-desc">{a.description}</p>}
                            <Files items={attFor("achievement", a.id)} />
                        </div>
                    ))}
                </div>
            )}

            {!resume.education?.length &&
                !resume.skills?.length &&
                !resume.experience?.length &&
                !resume.projects?.length &&
                !p.profile_summary && (
                    <p className="crv-muted">This candidate has not filled in their resume yet.</p>
                )}
        </div>
    );
}