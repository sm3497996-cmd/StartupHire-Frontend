import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CandidateResumeView from "./CandidateResumeView";
import { downloadResume } from "../../utils/resumePdf";
import { API_LARAVEL, LARAVEL_ORIGIN } from "../../config/env";

const API = `${API_LARAVEL}/resume`;

const fmtD = (d) => (d ? String(d).slice(0, 10).split("-").reverse().join("-") : "");
const fmtM = (d) => {
    if (!d) return "";
    const [y, m] = String(d).slice(0, 10).split("-");
    return `${m}-${y}`;
};

// API ka resume -> Resumepdf ke liye (candidate dashboard jaisa) shape
const toPdfShape = (r) => {
    const p = r.personal || {};
    return {
        personal: {
            name: p.name || "",
            email: p.email || "",
            contact: p.contact || "",
            whatsapp: p.whatsapp || "",
            mother: "",
            father: "",
            gender: p.gender || "",
            dob: fmtD(p.dob),
            intro: p.profile_summary || "",
            headline: p.resume_headline || "",
            photo: (() => {
                const v = p.photo_url || p.profile_photo || p.photo || p.avatar || "";
                return v && !v.startsWith("http") ? `${LARAVEL_ORIGIN}/${v.replace(/^\/+/, "")}` : v;
            })(),
        },
        address: {
            permanent: { line1: "", city: "", state: "", country: "", pincode: "" },
            current: {
                line1: p.address || "", city: p.city || "", state: p.state || "",
                country: p.country || "", pincode: p.pincode || "",
            },
        },
        skills: (r.skills || []).map((s) => s.skill_name),
        education: (r.education || []).map((e) => ({
            id: String(e.id), degree: e.degree_name || "", board: e.board_university || "",
            industry: e.specialization || "", sector: "", percentage: e.percentage_cgpa ?? "",
            courseType: "", type: e.education_level || "Full Time",
            startDate: e.start_year ? `01-${e.start_year}` : "",
            endDate: e.end_year ? `01-${e.end_year}` : "",
            city: "", state: "", country: "", pincode: "",
        })),
        courses: (r.courses || []).map((c) => ({
            id: String(c.id), title: c.title || "", institute: c.issued_by || "",
            certNumber: c.credential_id || "", link: c.certificate_url || "",
            startDate: fmtD(c.issue_date), endDate: fmtD(c.expiry_date),
            validTill: "", details: c.details || "", skillsLearned: [],
        })),
        experience: (r.experience || []).map((e) => ({
            id: String(e.id), role: e.designation || "", company: e.company_name || "",
            type: e.employment_type || "Full Time", location: e.location || "",
            startDate: fmtM(e.start_date),
            endDate: e.currently_working ? "Present" : fmtM(e.end_date),
            description: e.job_description || "",
        })),
        projects: (r.projects || []).map((x) => ({
            id: String(x.id), title: x.project_title || "",
            stack: x.technologies_used ? x.technologies_used.split(",").map((s) => s.trim()).filter(Boolean) : [],
            description: x.description || "", link: x.project_url || "",
        })),
        achievements: (r.achievements || []).map((x) => ({ title: x.title || "", desc: x.description || "" })),
        links: [],
    };
};

export default function ResumeActions({
    candidateId, name = "Candidate", role = "Candidate",
    saved = false, onSave, hideSave = false, compact = false,
    versionData = null, previewNode = null, disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [menu, setMenu] = useState(false);

    const download = async (template = "photo") => {
        setMenu(false);

        // Employer ke liye: jis version se apply hua, wahi download ho (current profile resume fetch hi nahi hoga)
        if (versionData) {
            const data = {
                ...versionData,
                personal: { ...(versionData.personal || {}), mother: "", father: "" },
            };
            if (!data.personal.name) data.personal.name = name;
            downloadResume(data, role, template);
            return;
        }

        setBusy(true);
        try {
            const res = await fetch(`${API}/${candidateId}`, {
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            const d = await res.json();
            if (d.success) {
                const data = toPdfShape(d.resume);
                if (!data.personal.name) data.personal.name = name;
                downloadResume(data, role, template);
            }
        } catch (e) {
            console.error("Download resume error:", e);
        }
        setBusy(false);
    };

    const stop = (e) => e.stopPropagation();
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    const dark = typeof document !== "undefined" && !!document.querySelector(".candidate-app.dark");

    return (
        <>
            <style>{`
                .ra-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; margin:14px 6px 30px; }
                .ra-row.compact { margin:14px 6px 30px; }
                .ra-btn {
                    display:inline-flex; align-items:center; justify-content:center; gap:6px; cursor:pointer;
                    border:1.5px solid #5b3df5; color:#5b3df5; background:#fff;
                    border-radius:14px; padding:11px 10px; font:inherit; font-size:13.5px; font-weight:700;
                }
                .ra-btn:focus, .ra-btn:focus-visible { outline: none; }
                .ra-btn:hover { background:rgba(91,61,245,.08); }
                .ra-btn.on { background:#12b86f; border-color:#12b86f; color:#fff; }
                .ra-btn:disabled { opacity:.6; cursor:default; }
                .ra-overlay {
                    position:fixed; inset:0; z-index:5000; background:rgba(15,15,25,.6);
                    backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:20px;
                }
                .ra-modal {
                    width:100%; max-width:760px; max-height:90vh; display:flex; flex-direction:column;
                    background:#fff; color:#1a1a1a; border-radius:22px; overflow:hidden;
                    box-shadow:0 25px 70px rgba(0,0,0,.4);
                }
                .candidate-app.dark .ra-modal { background:#1c1e2b; color:#f2f2f7; }
                .ra-head {
                    display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:16px 20px;
                    border-bottom:1px solid rgba(120,120,140,.2);
                }
                .ra-head h3 { margin:0; flex:1; min-width:140px; font-size:17px; }
                .ra-body { padding:16px 20px 24px; overflow-y:auto; }
                .ra-x { border:none; background:rgba(120,120,140,.15); color:inherit; width:32px; height:32px; border-radius:50%; cursor:pointer; }
                .ra-dl { position:relative; display:flex; }
                .ra-dl .ra-btn { width:100%; }
                .ra-menu {
                    position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:50;
                    background:#fff; border:1px solid rgba(91,61,245,.25); border-radius:12px;
                    box-shadow:0 12px 30px rgba(0,0,0,.18); overflow:hidden;
                }
                .ra-menu button {
                    display:block; width:100%; padding:11px 12px; border:none; background:transparent;
                    font:inherit; font-size:13px; font-weight:600; color:#5b3df5; cursor:pointer; text-align:left;
                }
                .ra-menu button:hover { background:rgba(91,61,245,.08); }
            `}</style>

            <div className={`ra-row ${compact ? "compact" : ""}`} onClick={stop}>
                {!hideSave && (
                    <button className={`ra-btn ${saved ? "on" : ""}`} onClick={() => onSave && onSave()}>
                        {saved ? "✓ Saved" : "Save Resume"}
                    </button>
                )}
                <button className="ra-btn" onClick={() => setOpen(true)} disabled={disabled}>View Resume</button>
                <div className="ra-dl">
                    <button className="ra-btn" onClick={() => setMenu((m) => !m)} disabled={busy || disabled}>
                        {busy ? "Preparing..." : "Download ▾"}
                    </button>
                    {menu && (
                        <div className="ra-menu">
                            <button onClick={() => download("photo")}>With Photo</button>
                            <button onClick={() => download("plain")}>Without Photo</button>
                        </div>
                    )}
                </div>
            </div>

            {open &&
                createPortal(
                    <div className="ra-overlay" onClick={() => setOpen(false)}>
                        <div
                            className="ra-modal"
                            onClick={stop}
                            style={dark ? { background: "#1c1e2b", color: "#f2f2f7" } : undefined}
                        >
                            <div className="ra-head">
                                <h3>{name} · Resume</h3>
                                {!hideSave && (
                                    <button className={`ra-btn ${saved ? "on" : ""}`} onClick={() => onSave && onSave()}>
                                        {saved ? "✓ Saved" : "Save Resume"}
                                    </button>
                                )}
                                <button className="ra-btn" onClick={() => download("photo")} disabled={busy || disabled}>
                                    {busy ? "Preparing..." : "Download"}
                                </button>
                                <button className="ra-x" onClick={() => setOpen(false)}>✕</button>
                            </div>
                            <div className="ra-body">
                                {previewNode || <CandidateResumeView candidateId={candidateId} />}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}