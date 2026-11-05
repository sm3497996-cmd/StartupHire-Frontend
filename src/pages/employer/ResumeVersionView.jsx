const isUrl = (s) => /^https?:\/\/\S+$/i.test(String(s || "").trim());
const has = (v) => v && String(v).trim() !== "";

const PALETTE = ["#6228d7", "#ee2a7b", "#2563eb", "#10b981", "#f59e0b", "#06b6d4", "#f97316"];

function Section({ title, color, children }) {
    return (
        <div className="rvv-sec">
            <h4 style={{ color }}>
                <i style={{ background: color }} />
                {title}
            </h4>
            <div className="rvv-grid">{children}</div>
        </div>
    );
}

function Item({ color, title, sub, meta, text, link }) {
    return (
        <div className="rvv-item" style={{ borderLeftColor: color }}>
            <strong>{title}</strong>
            {has(sub) && <div className="rvv-sub">{sub}</div>}
            {has(meta) && <div className="rvv-meta" style={{ color }}>{meta}</div>}
            {has(text) && <p>{text}</p>}
            {isUrl(link) && (
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color }}>
                    {link}
                </a>
            )}
        </div>
    );
}

export default function ResumeVersionView({ data }) {
    const d = data || {};
    const p = d.personal || {};
    const cur = (d.address && d.address.current) || {};
    const place = [cur.city, cur.state, cur.country].filter(has).join(", ");
    const dates = (a, b) => [a, b].filter(has).join(" - ");

    const education = (d.education || []).filter((x) => has(x.degree) || has(x.board));
    const experience = (d.experience || []).filter((x) => has(x.role) || has(x.company));
    const projects = (d.projects || []).filter((x) => has(x.title));
    const courses = (d.courses || []).filter((x) => has(x.title) || has(x.institute));
    const achievements = (d.achievements || []).filter((x) => has(x.title));
    const links = (d.links || []).filter((x) => has(x.label) || has(x.url));
    const skills = [
        ...new Map(
            (d.skills || [])
                .filter(has)
                .map((s) => [String(s).trim().toLowerCase(), String(s).trim()])
        ).values(),
    ];

    const contacts = [p.email, p.contact, place].filter(has);

    return (
        <div className="rvv">
            <div className="rvv-head">
                <div className="rvv-avatar">{(p.name || "?").trim().charAt(0).toUpperCase()}</div>
                <div className="rvv-head-text">
                    <h3>{p.name}</h3>
                    {has(p.headline) && <div className="rvv-headline">{p.headline}</div>}
                    {contacts.length > 0 && (
                        <div className="rvv-contacts">
                            {contacts.map((c) => <span key={c}>{c}</span>)}
                        </div>
                    )}
                </div>
                {has(p.intro) && <p className="rvv-intro">{p.intro}</p>}
            </div>

            {skills.length > 0 && (
                <Section title="Skills" color="#6228d7">
                    <div className="rvv-chips">
                        {skills.map((s, i) => {
                            const c = PALETTE[i % PALETTE.length];
                            return (
                                <span key={s} style={{ background: `${c}1f`, color: c, borderColor: `${c}55` }}>
                                    {s}
                                </span>
                            );
                        })}
                    </div>
                </Section>
            )}

            {experience.length > 0 && (
                <Section title="Work Experience" color="#2563eb">
                    {experience.map((x, i) => (
                        <Item key={i} color="#2563eb" title={x.role}
                            sub={[x.company, x.type].filter(has).join(" · ")}
                            meta={[dates(x.startDate, x.endDate), x.location].filter(has).join(" · ")}
                            text={x.description} />
                    ))}
                </Section>
            )}

            {projects.length > 0 && (
                <Section title="Projects" color="#ee2a7b">
                    {projects.map((x, i) => (
                        <Item key={i} color="#ee2a7b" title={x.title}
                            sub={Array.isArray(x.stack) ? x.stack.join(", ") : x.stack}
                            text={x.description} link={x.link} />
                    ))}
                </Section>
            )}

            {education.length > 0 && (
                <Section title="Education" color="#f59e0b">
                    {education.map((x, i) => (
                        <Item key={i} color="#f59e0b" title={x.degree} sub={x.board}
                            meta={[dates(x.startDate, x.endDate), has(x.percentage) ? `${x.percentage}` : ""].filter(has).join(" · ")} />
                    ))}
                </Section>
            )}

            {courses.length > 0 && (
                <Section title="Courses & Certifications" color="#10b981">
                    {courses.map((x, i) => (
                        <Item key={i} color="#10b981" title={x.title} sub={x.institute}
                            meta={dates(x.startDate, x.endDate)} text={x.details} link={x.link} />
                    ))}
                </Section>
            )}

            {achievements.length > 0 && (
                <Section title="Achievements" color="#f97316">
                    {achievements.map((x, i) => (
                        <Item key={i} color="#f97316" title={x.title} text={x.desc} />
                    ))}
                </Section>
            )}

            {links.length > 0 && (
                <Section title="Links" color="#06b6d4">
                    {links.map((x, i) => <Item key={i} color="#06b6d4" title={x.label} link={x.url} />)}
                </Section>
            )}

            <style>{`
                .rvv-head { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; padding: 22px; margin-bottom: 24px;
                    border-radius: 20px; color: #fff;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #d946ef 100%);
                    box-shadow: 0 10px 30px rgba(139, 92, 246, .3); }
                .rvv-avatar { width: 58px; height: 58px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
                    font-size: 24px; font-weight: 800; background: rgba(255,255,255,.22); border: 2px solid rgba(255,255,255,.55); }
                .rvv-head-text { flex: 1; min-width: 200px; }
                .rvv-head h3 { margin: 0; font-size: 22px; }
                .rvv-headline { opacity: .9; margin-top: 2px; font-size: 14px; }
                .rvv-contacts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
                .rvv-contacts span { font-size: 12px; padding: 4px 12px; border-radius: 14px; background: rgba(255,255,255,.2); }
                .rvv-intro { flex-basis: 100%; margin: 4px 0 0; font-size: 14px; line-height: 1.55; white-space: pre-line; opacity: .95; }
                .rvv-sec { margin-bottom: 24px; }
                .rvv-sec h4 { display: flex; align-items: center; gap: 10px; margin: 0 0 12px; font-size: 15px; letter-spacing: .02em; }
                .rvv-sec h4 i { width: 5px; height: 18px; border-radius: 4px; display: inline-block; }
                .rvv-grid { display: grid; gap: 10px; }
                .rvv-item { padding: 12px 16px; border-radius: 14px; background: rgba(127,127,127,.07); border-left: 4px solid; }
                .rvv-item strong { font-size: 14px; }
                .rvv-sub { font-size: 13px; opacity: .8; margin-top: 2px; }
                .rvv-meta { font-size: 12px; font-weight: 600; margin-top: 3px; }
                .rvv-item p { font-size: 13px; margin: 8px 0 0; white-space: pre-line; line-height: 1.5; }
                .rvv-item a { display: inline-block; margin-top: 6px; font-size: 13px; font-weight: 600; word-break: break-all; }
                .rvv-chips { display: flex; flex-wrap: wrap; gap: 8px; }
                .rvv-chips span { padding: 5px 13px; border-radius: 16px; font-size: 13px; font-weight: 600; border: 1px solid; }
            `}</style>
        </div>
    );
}