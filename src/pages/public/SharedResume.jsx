import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadResume } from "../../utils/resumePdf";
import { API_LARAVEL } from "../../config/env";

const normalize = (r = {}) => ({
    personal: { mother: "", father: "", dob: "", whatsapp: "", ...(r.personal || {}) },
    address: r.address || {},
    skills: r.skills || [],
    education: r.education || [],
    courses: r.courses || [],
    experience: r.experience || [],
    projects: r.projects || [],
    achievements: r.achievements || [],
    links: r.links || [],
});

const skillName = (s) => (typeof s === "string" ? s : s?.name || s?.skill_name || "");

function Section({ title, children }) {
    return (
        <section className="sr-sec">
            <h2>{title}</h2>
            {children}
        </section>
    );
}

export default function SharedResume() {
    const { token } = useParams();
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`${API_LARAVEL}/shared-resume/${token}`, { headers: { Accept: "application/json" } })
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => setInfo({ title: d.title, field: d.field, data: normalize(d.resume) }))
            .catch(() => setError(true));
    }, [token]);

    if (error) return <div className="sr-msg">This link is closed or invalid.</div>;
    if (!info) return <div className="sr-msg">Loading...</div>;

    const { data, field } = info;
    const p = data.personal;
    const addr = data.address.current?.city ? data.address.current : data.address.permanent || {};
    const place = [addr.city, addr.state, addr.country].filter(Boolean).join(", ");
    const uniqueSkills = [
        ...new Map(
            data.skills
                .map(skillName)
                .filter(Boolean)
                .map((s) => [s.trim().toLowerCase(), s.trim()])
        ).values(),
    ];

    return (
        <div className="sr-page">
            <div className="sr-card">
                <header className="sr-head">
                    <div>
                        <h1>{p.name || "Candidate"}</h1>
                        {p.headline && <p className="sr-sub">{p.headline}</p>}
                        {field && <span className="sr-tag">{field}</span>}
                        <p className="sr-meta">
                            {[place, p.email, p.contact].filter(Boolean).join("  ·  ")}
                        </p>
                    </div>
                    <div className="sr-dl">
                        <button onClick={() => downloadResume(data, field || "Candidate", "photo")}>Download (With Photo)</button>
                        <button onClick={() => downloadResume(data, field || "Candidate", "plain")}>Download (Without Photo)</button>
                    </div>
                </header>

                {p.intro && <Section title="About"><p>{p.intro}</p></Section>}

                {uniqueSkills.length > 0 && (
                    <Section title="Skills">
                        <div className="sr-chips">
                            {uniqueSkills.map((s) => <span key={s}>{s}</span>)}
                        </div>
                    </Section>
                )}

                {data.experience.length > 0 && (
                    <Section title="Work Experience">
                        {data.experience.map((e, i) => (
                            <div key={i} className="sr-item">
                                <strong>{e.role}</strong> · {e.company}
                                <div className="sr-dim">{[e.type, e.location, [e.startDate, e.endDate].filter(Boolean).join(" to ")].filter(Boolean).join(" · ")}</div>
                                {e.description && <p>{e.description}</p>}
                            </div>
                        ))}
                    </Section>
                )}

                {data.projects.length > 0 && (
                    <Section title="Projects">
                        {data.projects.map((x, i) => (
                            <div key={i} className="sr-item">
                                <strong>{x.title}</strong>
                                {Array.isArray(x.stack) && x.stack.length > 0 && <div className="sr-dim">{x.stack.join(", ")}</div>}
                                {x.description && <p>{x.description}</p>}
                                {x.link && <a href={x.link} target="_blank" rel="noreferrer">{x.link}</a>}
                            </div>
                        ))}
                    </Section>
                )}

                {data.education.length > 0 && (
                    <Section title="Education">
                        {data.education.map((e, i) => (
                            <div key={i} className="sr-item">
                                <strong>{e.degree}</strong> · {e.board}
                                <div className="sr-dim">
                                    {[e.industry, e.percentage && `${e.percentage}`, [e.startDate, e.endDate].filter(Boolean).join(" to ")].filter(Boolean).join(" · ")}
                                </div>
                            </div>
                        ))}
                    </Section>
                )}

                {data.courses.length > 0 && (
                    <Section title="Courses & Certifications">
                        {data.courses.map((c, i) => (
                            <div key={i} className="sr-item">
                                <strong>{c.title}</strong> · {c.institute}
                                {c.details && <p>{c.details}</p>}
                                {c.link && <a href={c.link} target="_blank" rel="noreferrer">{c.link}</a>}
                            </div>
                        ))}
                    </Section>
                )}

                {data.achievements.length > 0 && (
                    <Section title="Achievements">
                        {data.achievements.map((a, i) => (
                            <div key={i} className="sr-item">
                                <strong>{a.title}</strong>
                                {a.desc && <p>{a.desc}</p>}
                            </div>
                        ))}
                    </Section>
                )}

                {data.links.length > 0 && (
                    <Section title="Links">
                        {data.links.map((l, i) => (
                            <div key={i}><a href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a></div>
                        ))}
                    </Section>
                )}
            </div>

            <style>{`
                .sr-page { min-height: 100vh; background: #f4f5fa; padding: 28px 14px; color: #1a1a1a; }
                .sr-card { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 22px; padding: 30px;
                    box-shadow: 0 10px 40px rgba(0,0,0,.08); }
                .sr-head { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
                .sr-head h1 { margin: 0 0 4px; font-size: 28px; }
                .sr-sub { margin: 0 0 8px; opacity: .7; }
                .sr-tag { display: inline-block; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 12px;
                    background: rgba(98,40,215,.12); color: #6228d7; }
                .sr-meta { margin: 10px 0 0; font-size: 13px; opacity: .7; }
                .sr-dl { display: flex; flex-direction: column; gap: 8px; }
                .sr-dl button { border: none; cursor: pointer; padding: 10px 16px; border-radius: 20px; font-weight: 700; font-size: 13px;
                    color: #fff; background: linear-gradient(135deg, #6228d7, #ee2a7b); }
                .sr-sec { margin-top: 24px; }
                .sr-sec h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .06em; color: #6228d7;
                    border-bottom: 1px solid rgba(120,120,140,.25); padding-bottom: 6px; margin: 0 0 12px; }
                .sr-item { margin-bottom: 14px; }
                .sr-item p { margin: 4px 0 0; font-size: 14px; line-height: 1.5; }
                .sr-dim { font-size: 12.5px; opacity: .65; margin-top: 2px; }
                .sr-chips { display: flex; flex-wrap: wrap; gap: 8px; }
                .sr-chips span { font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 14px; background: rgba(98,40,215,.1); color: #6228d7; }
                .sr-item a, .sr-sec a { color: #6228d7; font-size: 13px; word-break: break-all; }
                .sr-msg { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 16px; }
            `}</style>
        </div>
    );
}