import { useEffect, useState } from "react";
import "./CreateCompanyPage.css";
import "./CreateCompanyPage.dark.css";
import { initialsOf } from "../../utils/initials";

const INDUSTRIES = [
    "Information Technology", "Software / SaaS", "E-commerce", "Fintech",
    "EdTech", "HealthTech", "Marketing & Advertising", "Manufacturing",
    "Logistics", "Consulting", "Media & Entertainment", "Other",
];

const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

const TYPES = [
    "Startup", "Private Limited", "Public Limited", "LLP",
    "Proprietorship", "NGO / Non-profit", "Government",
];

const MAX_TAGLINE = 120;
const MAX_ABOUT = 500;

const emptyForm = {
    name: "",
    tagline: "",
    industry: "",
    size: "",
    type: "",
    founded: "",
    website: "",
    city: "",
    state: "",
    about: "",
    verified: false,
};

function CreateCompanyPage({ onCreate }) {
    const [form, setForm] = useState(emptyForm);
    const [logoFile, setLogoFile] = useState(null);
    const [logoUrl, setLogoUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        return () => {
            if (logoUrl) URL.revokeObjectURL(logoUrl);
        };
    }, [logoUrl]);

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleLogo = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setErrors((p) => ({ ...p, logo: "Upload a JPG or PNG image." }));
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setErrors((p) => ({ ...p, logo: "Logo must be under 2 MB." }));
            return;
        }

        setErrors((p) => ({ ...p, logo: undefined }));
        setLogoFile(file);
        setLogoUrl(URL.createObjectURL(file));
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoUrl("");
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Enter your company name.";
        if (!form.industry) e.industry = "Select an industry.";
        if (!form.size) e.size = "Select company size.";
        if (!form.type) e.type = "Select company type.";
        if (!form.city.trim()) e.city = "Enter the city of your head office.";
        if (form.website && !/^(https?:\/\/|www\.)/i.test(form.website.trim())) {
            e.website = "Start with http://, https:// or www.";
        }
        if (form.founded && !/^\d{4}$/.test(form.founded)) {
            e.founded = "Enter a 4-digit year.";
        }
        if (!form.verified) e.verified = "Confirm that you can act for this company.";
        return e;
    };

    const canSubmit =
        form.name.trim() && form.industry && form.size && form.type &&
        form.city.trim() && form.verified;

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setSaving(true);
        try {
            // Parent decides what to do (API call etc.)
            await onCreate?.({ ...form, logo: logoFile });
        } finally {
            setSaving(false);
        }
    };

    const initials = initialsOf(form.name || "Company", "");

    const location = [form.city, form.state].filter(Boolean).join(", ");

    const err = (key) =>
        errors[key] ? <span className="cp-error">{errors[key]}</span> : null;

    return (
        <div className="cp-wrap">
            <div className="cp-intro">
                <h1>Set up your Company Profile</h1>
                <p>
                    Candidates see this page when they view your jobs. Add the basics now,
                    you can edit everything later.
                </p>
            </div>

            <form className="cp-layout" onSubmit={handleSubmit} noValidate>
                {/* LEFT: FORM */}
                <div className="cp-form-card">
                    <p className="cp-required-note">* indicates required</p>

                    <div className="cp-field">
                        <label htmlFor="cp-name">Company name*</label>
                        <input
                            id="cp-name"
                            value={form.name}
                            placeholder="e.g. Pixel Forge Studio"
                            onChange={(e) => setField("name", e.target.value)}
                        />
                        {err("name")}
                    </div>

                    <div className="cp-field">
                        <label htmlFor="cp-tagline">Tagline</label>
                        <textarea
                            id="cp-tagline"
                            rows={2}
                            maxLength={MAX_TAGLINE}
                            value={form.tagline}
                            placeholder="e.g. We build clean, fast products for growing startups."
                            onChange={(e) => setField("tagline", e.target.value)}
                        />
                        <span className="cp-hint">
                            One line about what you do.
                            <b>{form.tagline.length}/{MAX_TAGLINE}</b>
                        </span>
                    </div>

                    <div className="cp-field">
                        <label>Logo</label>
                        {logoUrl ? (
                            <div className="cp-logo-picked">
                                <img src={logoUrl} alt="Logo preview" />
                                <div>
                                    <strong>{logoFile?.name}</strong>
                                    <button type="button" onClick={removeLogo}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="cp-dropzone">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    onChange={handleLogo}
                                    hidden
                                />
                                <span className="cp-drop-title">Choose file</span>
                                <span className="cp-hint">Upload to see it in the preview</span>
                            </label>
                        )}
                        <span className="cp-hint">300 x 300 px recommended. JPG or PNG, up to 2 MB.</span>
                        {err("logo")}
                    </div>

                    <div className="cp-row">
                        <div className="cp-field">
                            <label htmlFor="cp-industry">Industry*</label>
                            <select
                                id="cp-industry"
                                value={form.industry}
                                onChange={(e) => setField("industry", e.target.value)}
                            >
                                <option value="">Select industry</option>
                                {INDUSTRIES.map((i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                            {err("industry")}
                        </div>

                        <div className="cp-field">
                            <label htmlFor="cp-type">Company type*</label>
                            <select
                                id="cp-type"
                                value={form.type}
                                onChange={(e) => setField("type", e.target.value)}
                            >
                                <option value="">Select type</option>
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {err("type")}
                        </div>
                    </div>

                    <div className="cp-row">
                        <div className="cp-field">
                            <label htmlFor="cp-size">Company size*</label>
                            <select
                                id="cp-size"
                                value={form.size}
                                onChange={(e) => setField("size", e.target.value)}
                            >
                                <option value="">Select size</option>
                                {SIZES.map((s) => (
                                    <option key={s} value={s}>{s} employees</option>
                                ))}
                            </select>
                            {err("size")}
                        </div>

                        <div className="cp-field">
                            <label htmlFor="cp-founded">Founded in</label>
                            <input
                                id="cp-founded"
                                inputMode="numeric"
                                maxLength={4}
                                value={form.founded}
                                placeholder="e.g. 2021"
                                onChange={(e) => setField("founded", e.target.value.replace(/\D/g, ""))}
                            />
                            {err("founded")}
                        </div>
                    </div>

                    <div className="cp-row">
                        <div className="cp-field">
                            <label htmlFor="cp-city">Head office city*</label>
                            <input
                                id="cp-city"
                                value={form.city}
                                placeholder="e.g. Bhopal"
                                onChange={(e) => setField("city", e.target.value)}
                            />
                            {err("city")}
                        </div>

                        <div className="cp-field">
                            <label htmlFor="cp-state">State</label>
                            <input
                                id="cp-state"
                                value={form.state}
                                placeholder="e.g. Madhya Pradesh"
                                onChange={(e) => setField("state", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cp-field">
                        <label htmlFor="cp-website">Website</label>
                        <input
                            id="cp-website"
                            value={form.website}
                            placeholder="Begin with http://, https:// or www."
                            onChange={(e) => setField("website", e.target.value)}
                        />
                        {err("website")}
                    </div>

                    <div className="cp-field">
                        <label htmlFor="cp-about">About the company</label>
                        <textarea
                            id="cp-about"
                            rows={4}
                            maxLength={MAX_ABOUT}
                            value={form.about}
                            placeholder="What does your company do, and what is it like to work there?"
                            onChange={(e) => setField("about", e.target.value)}
                        />
                        <span className="cp-hint">
                            <span></span>
                            <b>{form.about.length}/{MAX_ABOUT}</b>
                        </span>
                    </div>

                    <label className="cp-check">
                        <input
                            type="checkbox"
                            checked={form.verified}
                            onChange={(e) => setField("verified", e.target.checked)}
                        />
                        <span>
                            I confirm that I am authorised to create and manage this page on
                            behalf of this company.
                        </span>
                    </label>
                    {err("verified")}
                </div>

                {/* RIGHT: LIVE PREVIEW */}
                <aside className="cp-preview-col">
                    <div className="cp-preview-card">
                        <div className="cp-preview-title">Page preview</div>

                        <div className="cp-preview-stage">
                            <div className="cp-company-card">
                                <div className="cp-company-logo">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="" />
                                    ) : (
                                        <span>{initials}</span>
                                    )}
                                </div>

                                <h2 className={form.name ? "" : "is-empty"}>
                                    {form.name || "Company name"}
                                </h2>

                                <p className={`cp-p-tagline ${form.tagline ? "" : "is-empty"}`}>
                                    {form.tagline || "Tagline"}
                                </p>

                                <p className={`cp-p-meta ${form.industry ? "" : "is-empty"}`}>
                                    {form.industry || "Industry"}
                                </p>

                                <div className="cp-p-chips">
                                    {location && <span>{location}</span>}
                                    {form.size && <span>{form.size} employees</span>}
                                    {form.type && <span>{form.type}</span>}
                                    {form.founded && <span>Since {form.founded}</span>}
                                </div>

                                <button type="button" className="cp-follow" tabIndex={-1}>
                                    + Follow
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="cp-actions">
                    <button
                        type="submit"
                        className="cp-submit"
                        disabled={!canSubmit || saving}
                    >
                        {saving ? "Creating..." : "Create page"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCompanyPage;