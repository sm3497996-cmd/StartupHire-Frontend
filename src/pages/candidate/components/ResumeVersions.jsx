import { useEffect, useState } from "react";
import { api } from "../../../services/interactionsService";

const FIELDS = ["Frontend", "Backend", "Full Stack", "Design", "Marketing", "Data", "Other"];

export default function ResumeVersions({ resumeData, setResumeData, notify }) {
    const [versions, setVersions] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [title, setTitle] = useState("");
    const [field, setField] = useState("Frontend");
    const [busy, setBusy] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const load = async () => {
        const d = await api("/resume-versions");
        setVersions(d.versions || []);
    };
    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!title.trim()) return notify("Enter a version name", "error");
        setBusy(true);
        const d = await api("/resume-versions", {
            method: "POST",
            body: { title: title.trim(), target_field: field, data: resumeData },
        });
        setBusy(false);
        if (!d.success) return notify(d.message || "Could not save version", "error");
        notify("Version saved", "success");
        setTitle("");
        setActiveId(d.id ?? d.version?.id ?? null);
        load();
    };

    const openVersion = async (id) => {
        const d = await api(`/resume-versions/${id}`);
        if (!d.success) return notify(d.message || "Could not load version", "error");
        setResumeData(d.version.data);
        setActiveId(id);
        notify(`Loaded "${d.version.title}"`, "success");
    };

    const updateCurrent = async () => {
        if (!activeId) return;
        const d = await api(`/resume-versions/${activeId}`, { method: "PUT", body: { data: resumeData } });
        if (!d.success) return notify(d.message || "Could not update version", "error");
        notify("Version updated", "success");
        load();
    };

    const makeDefault = async (id) => {
        await api(`/resume-versions/${id}/default`, { method: "POST" });
        load();
    };

    const remove = async (id) => {
        if (!window.confirm("Delete this version?")) return;
        await api(`/resume-versions/${id}`, { method: "DELETE" });
        if (activeId === id) setActiveId(null);
        load();
    };

    // ---------- Share ----------
    const linkFor = (token) => `${window.location.origin}/shared-resume/${token}`;

    const copyLink = async (v) => {
        const link = linkFor(v.share_token);
        try {
            await navigator.clipboard.writeText(link);
            setCopiedId(v.id);
            setTimeout(() => setCopiedId((cur) => (cur === v.id ? null : cur)), 2000);
            notify("Link copied. Ab ise kahin bhi paste karke bhej sakte ho", "success");
        } catch {
            window.prompt("Copy this link:", link);
        }
    };

    const share = async (v) => {
        const d = await api(`/resume-versions/${v.id}/share`, { method: "POST" });
        if (!d.share_token) return notify(d.message || "Could not create share link", "error");
        const updated = { ...v, share_token: d.share_token };
        setVersions((prev) => prev.map((x) => (x.id === v.id ? updated : x)));
        copyLink(updated);
    };

    const unshare = async (v) => {
        if (!window.confirm("Stop sharing? The old link will stop working.")) return;
        const d = await api(`/resume-versions/${v.id}/share`, { method: "DELETE" });
        if (!d.success) return notify(d.message || "Could not stop sharing", "error");
        setVersions((prev) => prev.map((x) => (x.id === v.id ? { ...x, share_token: null } : x)));
        notify("Sharing stopped", "success");
    };

    const shareVia = async (v, how) => {
        const link = linkFor(v.share_token);
        const text = `My resume (${v.title}): ${link}`;
        if (how === "whatsapp") {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        } else if (how === "email") {
            window.location.href = `mailto:?subject=${encodeURIComponent(v.title)}&body=${encodeURIComponent(text)}`;
        } else if (navigator.share) {
            try { await navigator.share({ title: v.title, text, url: link }); } catch { /* cancelled */ }
        } else {
            copyLink(v);
        }
    };

    return (
        <section className="rv">
            <div className="rv-head">
                <div>
                    <h3>Resume Versions</h3>
                    <p>Create a separate resume for each job field, then pick one when you apply.</p>
                </div>
            </div>

            <div className="rv-create">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Version name, e.g. Frontend Resume" />
                <select value={field} onChange={(e) => setField(e.target.value)}>
                    {FIELDS.map((f) => <option key={f}>{f}</option>)}
                </select>
                <button className="rv-btn primary" onClick={create} disabled={busy}>
                    + Save current resume as new version
                </button>
            </div>

            {versions.length === 0 ? (
                <p className="rv-empty">No versions yet. Fill your resume below, then save it as a version.</p>
            ) : (
                <div className="rv-list">
                    {versions.map((v) => (
                        <div key={v.id} className={`rv-item ${activeId === v.id ? "active" : ""}`}>
                            <div className="rv-info">
                                <strong>{v.title}</strong>
                                <span>{v.target_field || "General"}</span>
                                {Number(v.is_default) === 1 && <em>Default</em>}
                                {v.share_token && <em className="shared">Link active</em>}
                            </div>
                            <div className="rv-actions">
                                <button className="rv-btn" onClick={() => openVersion(v.id)}>Edit</button>
                                {activeId === v.id && (
                                    <button className="rv-btn success" onClick={updateCurrent}>Save changes</button>
                                )}
                                {Number(v.is_default) !== 1 && (
                                    <button className="rv-btn" onClick={() => makeDefault(v.id)}>Set default</button>
                                )}
                                {!v.share_token && (
                                    <button className="rv-btn" onClick={() => share(v)}>Share</button>
                                )}
                                <button className="rv-btn danger" onClick={() => remove(v.id)}>Delete</button>
                            </div>

                            {v.share_token && (
                                <div className="rv-link">
                                    <p>Anyone with this link can view this resume. Copy it and send it anywhere.</p>
                                    <div className="rv-link-row">
                                        <input
                                            readOnly
                                            value={linkFor(v.share_token)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        <button className={`rv-btn ${copiedId === v.id ? "success" : "primary"}`} onClick={() => copyLink(v)}>
                                            {copiedId === v.id ? "Copied ✓" : "Copy link"}
                                        </button>
                                    </div>
                                    <div className="rv-link-actions">
                                        <button className="rv-btn" onClick={() => shareVia(v, "whatsapp")}>WhatsApp</button>
                                        <button className="rv-btn" onClick={() => shareVia(v, "email")}>Email</button>
                                        {typeof navigator !== "undefined" && navigator.share && (
                                            <button className="rv-btn" onClick={() => shareVia(v, "native")}>More...</button>
                                        )}
                                        <button className="rv-btn danger" onClick={() => unshare(v)}>Stop sharing</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .rv { margin-bottom: 24px; padding: 20px; border-radius: 18px;
                    background: rgba(120,120,140,0.07); border: 1px solid rgba(120,120,140,0.18); }
                .rv-head h3 { margin: 0 0 4px; }
                .rv-head p { margin: 0 0 14px; font-size: 13px; opacity: .65; }
                .rv-create { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
                .rv-create input, .rv-create select { padding: 10px 14px; border-radius: 12px; font-size: 14px; color: inherit;
                    border: 1.5px solid rgba(120,120,140,0.25); background: rgba(120,120,140,0.06); }
                .rv-create input { flex: 1; min-width: 200px; }
                .rv-btn { border: 1.5px solid rgba(120,120,140,0.35); background: transparent; color: inherit; cursor: pointer;
                    padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; }
                .rv-btn.primary { border: none; color: #fff; background: linear-gradient(135deg, #6228d7, #ee2a7b); }
                .rv-btn.success { border: none; color: #fff; background: linear-gradient(135deg, #22c55e, #16a34a); }
                .rv-btn.danger:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
                .rv-btn:disabled { opacity: .6; cursor: default; }
                .rv-list { display: grid; gap: 10px; }
                .rv-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
                    padding: 12px 16px; border-radius: 14px; background: rgba(120,120,140,0.07); border: 1.5px solid transparent; }
                .rv-item.active { border-color: #ee2a7b; }
                .rv-info { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
                .rv-info span { font-size: 12px; padding: 3px 10px; border-radius: 12px; background: rgba(98,40,215,0.12); color: #6228d7; font-weight: 700; }
                .rv-info em { font-style: normal; font-size: 11px; padding: 3px 10px; border-radius: 12px; background: #22c55e; color: #fff; font-weight: 700; }
                .rv-info em.shared { background: #6228d7; }
                .rv-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .rv-link { flex-basis: 100%; padding-top: 12px; border-top: 1px dashed rgba(120,120,140,0.3); }
                .rv-link p { margin: 0 0 8px; font-size: 12.5px; opacity: .7; }
                .rv-link-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
                .rv-link-row input { flex: 1; min-width: 220px; padding: 9px 14px; border-radius: 12px; font-size: 13px; color: inherit;
                    border: 1.5px solid rgba(120,120,140,0.25); background: rgba(120,120,140,0.06); }
                .rv-link-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .rv-empty { opacity: .6; font-size: 14px; margin: 0; }
            `}</style>
        </section>
    );
}