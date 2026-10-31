import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CompanyProfile.css";
import "./CompanyProfile.dark.css";
import { API_PHP } from "../../config/env";

const API_BASE = API_PHP;
const API_ROOT = API_BASE.replace(/\/routes$/, "");
const img = (u) => (!u ? null : /^(data:|https?:)/.test(u) ? u : `${API_ROOT}/${u}`);

export default function PublicCompany() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE}/public_company.php?id=${id}`)
            .then((r) => r.json())
            .then((d) => (d.success ? setData(d) : setError(d.message || "Not found")))
            .catch(() => setError("Could not load company"));
    }, [id]);

    if (error) return <p style={{ padding: 40 }}>{error}</p>;
    if (!data) return <p style={{ padding: 40 }}>Loading...</p>;

    const { company: c, extra: x, jobs } = data;
    const logo = img(c.logo_url);
    const cover = img(x.cover_url);

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
            <section className="cp-page">
                <div className="cp-hero">
                    <div
                        className="cp-cover"
                        style={cover
                            ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : { background: "linear-gradient(120deg,#3b22c9,#5b3df5 45%,#e83f7d)" }}
                    />
                    <div className="cp-hero-body">
                        <div className="cp-logo-wrap">
                            <div className="cp-logo" style={logo ? { backgroundImage: `url(${logo})` } : undefined}>
                                {!logo && (c.name || "C").slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <div className="cp-identity">
                            <div className="cp-name-row"><h2>{c.name}</h2></div>
                            {c.tagline && <p className="cp-tagline">{c.tagline}</p>}
                            <div className="cp-chips">
                                {c.location && <span>{c.location}</span>}
                                {c.industry && <span>{c.industry}</span>}
                                {c.size && <span>{c.size} employees</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {c.description && (
                    <article className="cp-card" style={{ marginTop: 20 }}>
                        <header className="cp-card-head"><h3>About</h3></header>
                        <p className="cp-about">{c.description}</p>
                        {(x.mission || x.vision) && (
                            <div className="cp-mission">
                                {x.mission && <div><b>Our mission</b><p>{x.mission}</p></div>}
                                {x.vision && <div><b>Our vision</b><p>{x.vision}</p></div>}
                            </div>
                        )}
                    </article>
                )}

                {(x.benefits || []).length > 0 && (
                    <article className="cp-card" style={{ marginTop: 20 }}>
                        <header className="cp-card-head"><h3>Perks &amp; benefits</h3></header>
                        <div className="cp-benefits">
                            {x.benefits.map((b, i) => (
                                <div className="cp-benefit" key={i}><strong>{b.title}</strong><p>{b.text}</p></div>
                            ))}
                        </div>
                    </article>
                )}

                <article className="cp-card" style={{ marginTop: 20 }}>
                    <header className="cp-card-head"><h3>Open roles ({jobs.length})</h3></header>
                    {jobs.length === 0 ? <p className="cp-about">No open roles right now.</p> : (
                        <div className="cp-jobs">
                            {jobs.map((j) => (
                                <div className="cp-job" key={j.id}>
                                    <div className="cp-job-info">
                                        <strong>{j.title}</strong>
                                        <span>{j.location} · {j.job_type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                {(x.email || c.website) && (
                    <article className="cp-card" style={{ marginTop: 20 }}>
                        <header className="cp-card-head"><h3>Contact</h3></header>
                        {x.email && <p className="cp-about">{x.email}</p>}
                        {x.phone && <p className="cp-about">{x.phone}</p>}
                        {c.website && <p className="cp-about">{c.website}</p>}
                    </article>
                )}
            </section>
        </div>
    );
}