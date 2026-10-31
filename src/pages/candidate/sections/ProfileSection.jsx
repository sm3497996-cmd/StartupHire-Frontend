import { resumeTabsList } from "../../../constants/resume";
import { downloadResume } from "../../../utils/resumePdf";
import { safeLink } from "../../../utils/safeLink";
import { CandidateIcon as Icon } from "../../../components/ui/Icon";
import { AttachmentField } from "../../../components/resume/AttachmentField";
import { ReferenceFields } from "../../../components/resume/ReferenceFields";

export default function ProfileSection({
    addNewItem,
    addressCurrEditing,
    addressPermEditing,
    addSkill,
    avatarContent,
    candidateRole,
    cleanedResume,
    clearItemDetails,
    handleSaveResume,
    isItemEditing,
    personalEditing,
    photoBusy,
    photoInputRef,
    removeAttachment,
    removeListItem,
    removePhoto,
    resumeData,
    resumeTab,
    savingResume,
    setAddressCurrEditing,
    setAddressPermEditing,
    setPersonalEditing,
    setResumeData,
    setResumeTab,
    setSkillInput,
    shownPhoto,
    skillInput,
    skillSuggestions,
    toggleItemEditing,
    updateAddressField,
    updateListItemField,
    uploadAttachment,
    uploadPhoto,
}) {
    return (
        <section className="resume-profile-section">

                            <div className="resume-cover">
                                <div className="resume-cover-avatar">{avatarContent}</div>

                                <div className="resume-cover-info">
                                    <h2>{resumeData.personal.name}</h2>
                                    <p>{candidateRole}</p>
                                    <span className="resume-cover-location">📍 {resumeData.address.current.city}, {resumeData.address.current.state}</span>
                                </div>

                                <div className="resume-cover-actions">

                                    <button
                                        className="resume-action-btn"
                                        onClick={() => setResumeTab("Personal Info")}
                                    >
                                        <Icon name="edit" size={16} /> Edit
                                    </button>

                                    <button
                                        className="resume-action-btn"
                                        onClick={() => window.print()}
                                    >
                                        <Icon name="share" size={16} /> Print
                                    </button>

                                    <button
                                        className="resume-action-btn primary"
                                        onClick={handleSaveResume}
                                        disabled={savingResume}
                                    >
                                        <Icon name="send" size={16} />
                                        {savingResume ? "Saving..." : "Save Resume"}
                                    </button>

                                    <button className="resume-action-btn primary" onClick={() => downloadResume(cleanedResume(), candidateRole)}>
                                        <Icon name="download" size={16} /> Download
                                    </button>

                                </div>
                            </div>

                            <div className="resume-tabs">
                                {resumeTabsList.map((tab) => (
                                    <button
                                        key={tab}
                                        className={`resume-tab-btn ${resumeTab === tab ? "active" : ""}`}
                                        onClick={() => setResumeTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="resume-content" key={resumeTab}>

                                {(resumeTab === "Resume" || resumeTab === "Personal Info") && (
                                    <div className="resume-block accent-indigo">
                                        <div className="resume-block-head">
                                            <h3 className="resume-block-title">Personal Information</h3>
                                            <button
                                                type="button"
                                                className={personalEditing ? "resume-save-btn" : "resume-edit-btn"}
                                                onClick={() => setPersonalEditing((v) => !v)}
                                            >
                                                {personalEditing ? (
                                                    <>
                                                        <Icon name="send" size={13} /> Save
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon name="edit" size={13} /> Edit
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className={`resume-inline-form ${personalEditing ? "is-editing" : ""}`}>
                                            <div className="photo-col">
                                                <div className="photo-avatar-wrap">
                                                    <div className="resume-inline-photo photo-round">
                                                        {shownPhoto ? (
                                                            <img className="avatar-img" src={shownPhoto} alt="" />
                                                        ) : (
                                                            (resumeData.personal.name || "JD")
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .slice(0, 2)
                                                                .toUpperCase()
                                                        )}
                                                    </div>

                                                    {photoBusy && <div className="photo-spinner" />}

                                                    <button
                                                        type="button"
                                                        className="photo-camera-btn"
                                                        title="Change photo"
                                                        aria-label="Change profile photo"
                                                        disabled={photoBusy}
                                                        onClick={() => photoInputRef.current?.click()}
                                                    >
                                                        <Icon name="camera" size={15} />
                                                    </button>
                                                </div>

                                                <input
                                                    ref={photoInputRef}
                                                    type="file"
                                                    hidden
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    disabled={photoBusy}
                                                    onChange={(e) => {
                                                        const f = e.target.files && e.target.files[0];
                                                        if (f) uploadPhoto(f);
                                                        e.target.value = "";
                                                    }}
                                                />

                                                <small className="photo-hint">JPG, PNG or WEBP · max 2 MB</small>

                                                {resumeData.personal.photo && (
                                                    <button
                                                        type="button"
                                                        className="photo-btn danger"
                                                        disabled={photoBusy}
                                                        onClick={removePhoto}
                                                    >
                                                        {photoBusy ? "Please wait..." : "Remove photo"}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="resume-inline-fields resume-grid-3">
                                                <div className="resume-field-group resume-field-full">
                                                    <label>Full Name</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.name}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))
                                                        }
                                                    />
                                                </div>

                                                <div className="resume-field-group">
                                                    <label>Email</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.email}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))
                                                        }
                                                    />
                                                </div>
                                                <div className="resume-field-group">
                                                    <label>Phone Number</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.contact}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, contact: e.target.value } }))
                                                        }
                                                    />
                                                </div>
                                                <div className="resume-field-group">
                                                    <label>WhatsApp Number</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.whatsapp}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, whatsapp: e.target.value } }))
                                                        }
                                                    />
                                                </div>

                                                <div className="resume-field-group">
                                                    <label>Mother's Name</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.mother}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, mother: e.target.value } }))
                                                        }
                                                    />
                                                </div>
                                                <div className="resume-field-group">
                                                    <label>Father's Name</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.father}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, father: e.target.value } }))
                                                        }
                                                    />
                                                </div>
                                                <div className="resume-field-group">
                                                    <label>Gender</label>
                                                    <select
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.gender}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, gender: e.target.value } }))
                                                        }
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>

                                                <div className="resume-field-group resume-field-full">
                                                    <label>DOB (DD-MM-YYYY)</label>
                                                    <input
                                                        disabled={!personalEditing}
                                                        value={resumeData.personal.dob}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, dob: e.target.value } }))
                                                        }
                                                    />
                                                </div>

                                                <div className="resume-field-group resume-field-full">
                                                    <label>Short Introduction</label>
                                                    <textarea
                                                        disabled={!personalEditing}
                                                        rows={3}
                                                        value={resumeData.personal.intro}
                                                        onChange={(e) =>
                                                            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, intro: e.target.value } }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Address") && (
                                    <div className="resume-block accent-teal">
                                        <h3 className="resume-block-title">Address Information</h3>
                                        <div className="resume-address-grid">
                                            <div className={`resume-address-card resume-address-form ${addressPermEditing ? "is-editing" : ""}`}>
                                                <div className="resume-block-head">
                                                    <h4>Permanent Address</h4>
                                                    <button
                                                        type="button"
                                                        className={addressPermEditing ? "resume-save-btn" : "resume-edit-btn"}
                                                        onClick={() => setAddressPermEditing((v) => !v)}
                                                    >
                                                        {addressPermEditing ? (
                                                            <><Icon name="send" size={12} /> Save</>
                                                        ) : (
                                                            <><Icon name="edit" size={12} /> Edit</>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="resume-field-group">
                                                    <label>Address Line</label>
                                                    <textarea
                                                        disabled={!addressPermEditing}
                                                        rows={2}
                                                        value={resumeData.address.permanent.line1}
                                                        onChange={(e) => updateAddressField("permanent", "line1", e.target.value)}
                                                    />
                                                </div>
                                                <div className="resume-grid-3">
                                                    <div className="resume-field-group">
                                                        <label>City</label>
                                                        <input
                                                            disabled={!addressPermEditing}
                                                            value={resumeData.address.permanent.city}
                                                            onChange={(e) => updateAddressField("permanent", "city", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="resume-field-group">
                                                        <label>State</label>
                                                        <input
                                                            disabled={!addressPermEditing}
                                                            value={resumeData.address.permanent.state}
                                                            onChange={(e) => updateAddressField("permanent", "state", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="resume-field-group">
                                                        <label>Country</label>
                                                        <input
                                                            disabled={!addressPermEditing}
                                                            value={resumeData.address.permanent.country}
                                                            onChange={(e) => updateAddressField("permanent", "country", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="resume-field-group">
                                                        <label>Pincode</label>
                                                        <input
                                                            disabled={!addressPermEditing}
                                                            value={resumeData.address.permanent.pincode}
                                                            onChange={(e) => updateAddressField("permanent", "pincode", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`resume-address-card resume-address-form ${addressCurrEditing ? "is-editing" : ""}`}>
                                                <div className="resume-block-head">
                                                    <h4>Current Address</h4>
                                                    <button
                                                        type="button"
                                                        className={addressCurrEditing ? "resume-save-btn" : "resume-edit-btn"}
                                                        onClick={() => setAddressCurrEditing((v) => !v)}
                                                    >
                                                        {addressCurrEditing ? (
                                                            <><Icon name="send" size={12} /> Save</>
                                                        ) : (
                                                            <><Icon name="edit" size={12} /> Edit</>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="resume-field-group">
                                                    <label>Address Line</label>
                                                    <textarea
                                                        disabled={!addressCurrEditing}
                                                        rows={2}
                                                        value={resumeData.address.current.line1}
                                                        onChange={(e) => updateAddressField("current", "line1", e.target.value)}
                                                    />
                                                </div>
                                                <div className="resume-grid-3">
                                                    <div className="resume-field-group">
                                                        <label>City</label>
                                                        <input
                                                            disabled={!addressCurrEditing}
                                                            value={resumeData.address.current.city}
                                                            onChange={(e) => updateAddressField("current", "city", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="resume-field-group">
                                                        <label>State</label>
                                                        <input
                                                            disabled={!addressCurrEditing}
                                                            value={resumeData.address.current.state}
                                                            onChange={(e) => updateAddressField("current", "state", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="resume-field-group">
                                                        <label>Country</label>
                                                        <input
                                                            disabled={!addressCurrEditing}
                                                            value={resumeData.address.current.country}
                                                            onChange={(e) => updateAddressField("current", "country", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="resume-field-group">
                                                        <label>Pincode</label>
                                                        <input
                                                            disabled={!addressCurrEditing}
                                                            value={resumeData.address.current.pincode}
                                                            onChange={(e) => updateAddressField("current", "pincode", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {(resumeTab === "Resume" || resumeTab === "Education") && (
                                    <div className="resume-block accent-orange">
                                        <h3 className="resume-block-title">Education Information</h3>

                                        {resumeData.education.map((edu, i) => {
                                            const editing = isItemEditing("education", i);
                                            return (
                                                <div className="resume-item-card" key={edu.id} style={{ animationDelay: `${i * 0.08}s` }}>
                                                    <div className="resume-item-top">
                                                        <span className="resume-item-id">#{edu.id}</span>
                                                        <div className="resume-item-actions">
                                                            <button
                                                                type="button"
                                                                className={editing ? "resume-save-btn" : "resume-edit-btn"}
                                                                onClick={() => toggleItemEditing("education", i)}
                                                            >
                                                                {editing ? (
                                                                    <><Icon name="send" size={13} /> Save</>
                                                                ) : (
                                                                    <><Icon name="edit" size={13} /> Edit</>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="resume-delete-btn"
                                                                onClick={() => {
                                                                    if (window.confirm("Are you sure you want to clear all details in this card?")) {
                                                                        clearItemDetails("education", i);
                                                                    }
                                                                }}
                                                            >
                                                                <Icon name="trash" size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={`resume-inline-form ${editing ? "is-editing" : ""}`}>
                                                        <div className="resume-grid-3">
                                                            <div className="resume-field-group">
                                                                <label>Degree</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.degree || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "degree", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Board / College Name</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.board || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "board", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Stream / Industry</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.industry || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "industry", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group">
                                                                <label>Sector</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.sector || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "sector", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Percentage / CGPA</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.percentage || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "percentage", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Course Type</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.courseType || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "courseType", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group">
                                                                <label>Mode</label>
                                                                <select
                                                                    disabled={!editing}
                                                                    value={edu.type || "Full Time"}
                                                                    onChange={(e) => updateListItemField("education", i, "type", e.target.value)}
                                                                >
                                                                    <option value="Full Time">Full Time</option>
                                                                    <option value="Part Time">Part Time</option>
                                                                    <option value="Distance">Distance</option>
                                                                </select>
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Start Date (MM-YYYY)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.startDate || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "startDate", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>End Date (MM-YYYY)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.endDate || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "endDate", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group">
                                                                <label>City</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.city || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "city", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>State</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.state || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "state", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Country</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.country || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "country", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group resume-field-full">
                                                                <label>Pincode</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={edu.pincode || ""}
                                                                    onChange={(e) => updateListItemField("education", i, "pincode", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            className="resume-add-btn resume-add-btn-center"
                                            onClick={() => addNewItem("education")}
                                        >
                                            <Icon name="plus" size={16} /> Add Education
                                        </button>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Skills") && (
                                    <div className="resume-block accent-pink">
                                        <h3 className="resume-block-title">Skills</h3>

                                        <div className="resume-skill-autocomplete">
                                            <div className="resume-skill-add-row">
                                                <input
                                                    type="text"
                                                    value={skillInput}
                                                    placeholder="Type a skill (e.g. React, SQL, Figma)..."
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addSkill(skillInput);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="resume-skill-add-btn"
                                                    onClick={() => addSkill(skillInput)}
                                                >
                                                    <Icon name="plus" size={15} /> Add
                                                </button>
                                            </div>

                                            {skillSuggestions.length > 0 && (
                                                <div className="resume-skill-suggestions">
                                                    {skillSuggestions.map((s) => (
                                                        <button
                                                            type="button"
                                                            key={s}
                                                            className="resume-skill-suggestion-chip"
                                                            onClick={() => addSkill(s)}
                                                        >
                                                            <Icon name="plus" size={12} /> {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="resume-skills-grid" style={{ marginTop: 18 }}>
                                            {resumeData.skills.map((skill, i) => (
                                                <span
                                                    className="resume-skill-chip"
                                                    key={skill + i}
                                                    style={{ animationDelay: `${i * 0.05}s` }}
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        className="resume-skill-remove"
                                                        onClick={() => removeListItem("skills", i)}
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Courses & Certifications") && (
                                    <div className="resume-block accent-blue">
                                        <h3 className="resume-block-title">Courses and Certifications</h3>

                                        {resumeData.courses.map((course, i) => {
                                            const editing = isItemEditing("courses", i);
                                            return (
                                                <div className="resume-item-card" key={course.id} style={{ animationDelay: `${i * 0.08}s` }}>
                                                    <div className="resume-item-top">
                                                        <span className="resume-item-id">#{course.id}</span>
                                                        <div className="resume-item-actions">
                                                            <button
                                                                type="button"
                                                                className={editing ? "resume-save-btn" : "resume-edit-btn"}
                                                                onClick={() => toggleItemEditing("courses", i)}
                                                            >
                                                                {editing ? (
                                                                    <><Icon name="send" size={13} /> Save</>
                                                                ) : (
                                                                    <><Icon name="edit" size={13} /> Edit</>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="resume-delete-btn"
                                                                onClick={() => {
                                                                    if (window.confirm("Are you sure you want to clear all details in this card?")) {
                                                                        clearItemDetails("courses", i);
                                                                    }
                                                                }}
                                                            >
                                                                <Icon name="trash" size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={`resume-inline-form ${editing ? "is-editing" : ""}`}>
                                                        <div className="resume-grid-3">
                                                            <div className="resume-field-group">
                                                                <label>Course Title</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.title || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "title", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Institute</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.institute || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "institute", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Certification Number</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.certNumber || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "certNumber", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group">
                                                                <label>Start Date (DD-MM-YYYY)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.startDate || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "startDate", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>End Date (DD-MM-YYYY)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.endDate || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "endDate", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Valid Till</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.validTill || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "validTill", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group resume-field-full">
                                                                <label>Certificate Link</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={course.link || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "link", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group resume-field-full">
                                                                <label>Details</label>
                                                                <textarea
                                                                    disabled={!editing}
                                                                    rows={3}
                                                                    value={course.details || ""}
                                                                    onChange={(e) => updateListItemField("courses", i, "details", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group resume-field-full">
                                                                <label>Skills Learned (comma separated)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={(course.skillsLearned || []).join(", ")}
                                                                    onChange={(e) =>
                                                                        updateListItemField(
                                                                            "courses",
                                                                            i,
                                                                            "skillsLearned",
                                                                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            <AttachmentField
                                                                items={course.attachments}
                                                                editing={editing}
                                                                onUpload={(f) => uploadAttachment("course", "courses", i, f)}
                                                                onRemove={(a) => removeAttachment("courses", i, a)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            className="resume-add-btn resume-add-btn-center"
                                            onClick={() => addNewItem("courses")}
                                        >
                                            <Icon name="plus" size={16} /> Add Course / Certification
                                        </button>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Work Experience") && (
                                    <div className="resume-block accent-green">
                                        <h3 className="resume-block-title">Work Experience</h3>

                                        {resumeData.experience.map((exp, i) => {
                                            const editing = isItemEditing("experience", i);
                                            return (
                                                <div className="resume-item-card" key={exp.id} style={{ animationDelay: `${i * 0.08}s` }}>
                                                    <div className="resume-item-top">
                                                        <span className="resume-item-id">#{exp.id}</span>
                                                        <div className="resume-item-actions">
                                                            <button
                                                                type="button"
                                                                className={editing ? "resume-save-btn" : "resume-edit-btn"}
                                                                onClick={() => toggleItemEditing("experience", i)}
                                                            >
                                                                {editing ? (
                                                                    <><Icon name="send" size={13} /> Save</>
                                                                ) : (
                                                                    <><Icon name="edit" size={13} /> Edit</>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="resume-delete-btn"
                                                                onClick={() => {
                                                                    if (window.confirm("Is card ki saari details clear karni hain?")) {
                                                                        clearItemDetails("experience", i);
                                                                    }
                                                                }}
                                                            >
                                                                <Icon name="trash" size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={`resume-inline-form ${editing ? "is-editing" : ""}`}>
                                                        <div className="resume-grid-3">
                                                            <div className="resume-field-group">
                                                                <label>Role / Designation</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={exp.role || ""}
                                                                    onChange={(e) => updateListItemField("experience", i, "role", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Company</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={exp.company || ""}
                                                                    onChange={(e) => updateListItemField("experience", i, "company", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Type</label>
                                                                <select
                                                                    disabled={!editing}
                                                                    value={exp.type || "Full Time"}
                                                                    onChange={(e) => updateListItemField("experience", i, "type", e.target.value)}
                                                                >
                                                                    <option value="Full Time">Full Time</option>
                                                                    <option value="Internship">Internship</option>
                                                                    <option value="Part Time">Part Time</option>
                                                                    <option value="Freelance">Freelance</option>
                                                                </select>
                                                            </div>

                                                            <div className="resume-field-group">
                                                                <label>Location</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={exp.location || ""}
                                                                    onChange={(e) => updateListItemField("experience", i, "location", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>Start Date (MM-YYYY)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={exp.startDate || ""}
                                                                    onChange={(e) => updateListItemField("experience", i, "startDate", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group">
                                                                <label>End Date (MM-YYYY or Present)</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    value={exp.endDate || ""}
                                                                    onChange={(e) => updateListItemField("experience", i, "endDate", e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="resume-field-group resume-field-full">
                                                                <label>Description</label>
                                                                <textarea
                                                                    disabled={!editing}
                                                                    rows={3}
                                                                    value={exp.description || ""}
                                                                    onChange={(e) => updateListItemField("experience", i, "description", e.target.value)}
                                                                />
                                                            </div>
                                                            <ReferenceFields
                                                                item={exp}
                                                                editing={editing}
                                                                onChange={(k, v) => updateListItemField("experience", i, k, v)}
                                                            />
                                                            <AttachmentField
                                                                items={exp.attachments}
                                                                editing={editing}
                                                                onUpload={(f) => uploadAttachment("experience", "experience", i, f)}
                                                                onRemove={(a) => removeAttachment("experience", i, a)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            className="resume-add-btn resume-add-btn-center"
                                            onClick={() => addNewItem("experience")}
                                        >
                                            <Icon name="plus" size={16} /> Add Work Experience
                                        </button>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Projects") && (
                                    <div className="resume-block accent-purple">
                                        <h3 className="resume-block-title">Project Works</h3>

                                        <div className="resume-projects-grid">
                                            {resumeData.projects.map((proj, i) => {
                                                const editing = isItemEditing("projects", i);
                                                return (
                                                    <div className="resume-project-card" key={proj.id} style={{ animationDelay: `${i * 0.08}s` }}>
                                                        <div className="resume-item-top">
                                                            <span className="resume-item-id">#{proj.id}</span>
                                                            <div className="resume-item-actions">
                                                                <button
                                                                    type="button"
                                                                    className={editing ? "resume-save-btn" : "resume-edit-btn"}
                                                                    onClick={() => toggleItemEditing("projects", i)}
                                                                >
                                                                    {editing ? (
                                                                        <><Icon name="send" size={13} /> Save</>
                                                                    ) : (
                                                                        <><Icon name="edit" size={13} /> Edit</>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="resume-delete-btn"
                                                                    onClick={() => {
                                                                        if (window.confirm("Are you sure you want to clear all details in this card?")) {
                                                                            clearItemDetails("projects", i);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Icon name="trash" size={14} /> Delete
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {editing ? (
                                                            <div className="resume-inline-form is-editing">
                                                                <div className="resume-field-group resume-field-full">
                                                                    <label>Project Title</label>
                                                                    <input
                                                                        value={proj.title || ""}
                                                                        onChange={(e) => updateListItemField("projects", i, "title", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="resume-field-group resume-field-full">
                                                                    <label>Tech Stack (comma separated)</label>
                                                                    <input
                                                                        value={Array.isArray(proj.stack) ? proj.stack.join(", ") : (proj.stack || "")}
                                                                        onChange={(e) =>
                                                                            updateListItemField(
                                                                                "projects",
                                                                                i,
                                                                                "stack",
                                                                                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="resume-field-group resume-field-full">
                                                                    <label>Description</label>
                                                                    <textarea
                                                                        rows={3}
                                                                        value={proj.description || ""}
                                                                        onChange={(e) => updateListItemField("projects", i, "description", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="resume-field-group resume-field-full">
                                                                    <label>Project Link</label>
                                                                    <input
                                                                        type="url"
                                                                        placeholder="https://github.com/username/project"
                                                                        value={proj.link || ""}
                                                                        onChange={(e) => updateListItemField("projects", i, "link", e.target.value)}
                                                                    />
                                                                </div>
                                                                <ReferenceFields
                                                                    item={proj}
                                                                    editing={true}
                                                                    onChange={(k, v) => updateListItemField("projects", i, k, v)}
                                                                />
                                                                <AttachmentField
                                                                    items={proj.attachments}
                                                                    editing={true}
                                                                    onUpload={(f) => uploadAttachment("project", "projects", i, f)}
                                                                    onRemove={(a) => removeAttachment("projects", i, a)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <h4>{proj.title}</h4>
                                                                <div className="resume-skills-grid small">
                                                                    {(proj.stack || []).map((s) => (
                                                                        <span className="resume-skill-chip" key={s}>{s}</span>
                                                                    ))}
                                                                </div>
                                                                <p className="resume-item-details">{proj.description}</p>
                                                                {safeLink(proj.link) ? (
                                                                    <a
                                                                        href={safeLink(proj.link)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="resume-project-link"
                                                                    >
                                                                        View Project <Icon name="arrow" size={14} />
                                                                    </a>
                                                                ) : (
                                                                    <span className="resume-project-link" style={{ opacity: 0.5, cursor: "default" }}>
                                                                        No link added
                                                                    </span>
                                                                )}
                                                                {(proj.refName || proj.refContact || proj.refEmail) && (
                                                                    <p className="resume-item-details">
                                                                        <strong>Reference:</strong> {proj.refName}
                                                                        {proj.refDesignation ? `, ${proj.refDesignation}` : ""}
                                                                        {proj.refContact ? ` · ${proj.refContact}` : ""}
                                                                        {proj.refEmail ? ` · ${proj.refEmail}` : ""}
                                                                    </p>
                                                                )}
                                                                <AttachmentField items={proj.attachments} editing={false} />
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            type="button"
                                            className="resume-add-btn resume-add-btn-center"
                                            onClick={() => addNewItem("projects")}
                                        >
                                            <Icon name="plus" size={16} /> Add Project
                                        </button>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Achievements") && (
                                    <div className="resume-block accent-amber">
                                        <h3 className="resume-block-title">Achievements</h3>

                                        <div className="resume-achievements-list">
                                            {resumeData.achievements.map((ach, i) => {
                                                const editing = isItemEditing("achievements", i);
                                                return (
                                                    <div className="resume-achievement-item" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                                                        {editing ? (
                                                            <div className="resume-inline-form is-editing" style={{ flex: 1 }}>
                                                                <div className="resume-field-group resume-field-full">
                                                                    <label>Achievement Title</label>
                                                                    <input
                                                                        value={ach.title || ""}
                                                                        onChange={(e) => updateListItemField("achievements", i, "title", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="resume-field-group resume-field-full">
                                                                    <label>Description</label>
                                                                    <textarea
                                                                        rows={2}
                                                                        value={ach.desc || ""}
                                                                        onChange={(e) => updateListItemField("achievements", i, "desc", e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className="resume-achievement-icon"><Icon name="sparkle" size={18} /></span>
                                                                <div style={{ flex: 1 }}>
                                                                    <h4>{ach.title}</h4>
                                                                    <p>{ach.desc}</p>
                                                                    <AttachmentField items={ach.attachments} editing={false} />
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="resume-item-actions">
                                                            <button
                                                                type="button"
                                                                className={editing ? "resume-save-btn" : "resume-edit-btn"}
                                                                onClick={() => toggleItemEditing("achievements", i)}
                                                            >
                                                                {editing ? <Icon name="send" size={13} /> : <Icon name="edit" size={13} />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="resume-delete-btn"
                                                                onClick={() => {
                                                                    if (window.confirm("Are you sure you want to clear all details in this card?")) {
                                                                        clearItemDetails("achievements", i);
                                                                    }
                                                                }}
                                                            >
                                                                <Icon name="trash" size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            type="button"
                                            className="resume-add-btn resume-add-btn-center"
                                            onClick={() => addNewItem("achievements")}
                                        >
                                            <Icon name="plus" size={16} /> Add Achievement
                                        </button>
                                    </div>
                                )}

                                {(resumeTab === "Resume" || resumeTab === "Other Links") && (
                                    <div className="resume-block accent-cyan">
                                        <h3 className="resume-block-title">Other Links</h3>

                                        {resumeData.links.map((link, i) => {
                                            const editing = isItemEditing("links", i);
                                            return (
                                                <div className="resume-item-card" key={link.id || i} style={{ animationDelay: `${i * 0.08}s` }}>
                                                    <div className="resume-item-top">
                                                        <span className="resume-item-id">#{link.id || i + 1}</span>
                                                        <div className="resume-item-actions">
                                                            <button
                                                                type="button"
                                                                className={editing ? "resume-save-btn" : "resume-edit-btn"}
                                                                onClick={() => toggleItemEditing("links", i)}
                                                            >
                                                                {editing ? (
                                                                    <><Icon name="send" size={13} /> Save</>
                                                                ) : (
                                                                    <><Icon name="edit" size={13} /> Edit</>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="resume-delete-btn"
                                                                onClick={() => {
                                                                    if (window.confirm("Are you sure you want to clear all details in this card?")) {
                                                                        clearItemDetails("links", i);
                                                                    }
                                                                }}
                                                            >
                                                                <Icon name="trash" size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={`resume-inline-form ${editing ? "is-editing" : ""}`}>
                                                        <div className="resume-grid-3">
                                                            <div className="resume-field-group">
                                                                <label>Link Label</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    placeholder="e.g. LinkedIn, GitHub, Portfolio"
                                                                    value={link.label || ""}
                                                                    onChange={(e) => updateListItemField("links", i, "label", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="resume-field-group resume-field-full">
                                                                <label>URL</label>
                                                                <input
                                                                    disabled={!editing}
                                                                    placeholder="https://..."
                                                                    value={link.url || ""}
                                                                    onChange={(e) => updateListItemField("links", i, "url", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            className="resume-add-btn resume-add-btn-center"
                                            onClick={() => addNewItem("links")}
                                        >
                                            <Icon name="plus" size={16} /> Add Link
                                        </button>
                                    </div>
                                )}

                            </div>

                        </section>
    );
}
