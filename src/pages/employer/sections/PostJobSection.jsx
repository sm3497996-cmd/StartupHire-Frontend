import { emptyForm } from "../employerHelpers";
import { EmployerIcon as Icon } from "../../../components/ui/Icon";

export default function PostJobSection({
    addQuestion,
    addSkill,
    form,
    formatExperience,
    handleFormChange,
    handlePostJob,
    qualificationSearch,
    qualificationSuggestions,
    removeQuestion,
    removeSkill,
    setActive,
    setForm,
    setQualificationSearch,
    setSkillSearch,
    skillSearch,
    skillSuggestions,
    updateQuestion,
}) {
    return (
        <section className="post-job-modern">

                                    <div className="post-job-heading">
                                        <div>
                                            <span className="post-job-kicker">JOB MANAGEMENT</span>
                                            <h2>{form.id ? "Edit Job" : "Post a New Job"}</h2>
                                            <p>
                                                Add complete job details to attract the right candidates.
                                            </p>
                                        </div>

                                        <div className="job-status-pill">
                                            <span
                                                className={`status-dot ${form.status === "Active" ? "active" : "inactive"
                                                    }`}
                                            ></span>
                                            {form.status}
                                        </div>
                                    </div>

                                    <form onSubmit={handlePostJob} className="modern-job-form">

                                        {/* ================= BASIC DETAILS ================= */}
                                        <div className="job-form-section">
                                            <div className="job-section-title">
                                                <div className="section-icon">
                                                    <Icon name="briefcase" size={20} />
                                                </div>
                                                <div>
                                                    <h3>Basic Job Details</h3>
                                                    <p>Tell candidates what this opportunity is about.</p>
                                                </div>
                                            </div>

                                            <div className="job-form-grid">

                                                <div className="job-field">
                                                    <label>Job Headline</label>
                                                    <input
                                                        type="text"
                                                        name="headline"
                                                        value={form.headline}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. Frontend Developer"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>Role / Job Title *</label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={form.title}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. React Developer"
                                                        required
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>Category</label>
                                                    <select
                                                        name="category"
                                                        value={form.category}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="General">General</option>
                                                        <option value="Technology">Technology</option>
                                                        <option value="Design">Design</option>
                                                        <option value="Marketing">Marketing</option>
                                                        <option value="Finance">Finance</option>
                                                        <option value="Sales">Sales</option>
                                                        <option value="HR">HR</option>
                                                    </select>
                                                </div>

                                                <div className="job-field">
                                                    <label>Job Section</label>
                                                    <input
                                                        type="text"
                                                        name="jobSection"
                                                        value={form.jobSection}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. Engineering"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>Industry</label>
                                                    <input
                                                        type="text"
                                                        name="industry"
                                                        value={form.industry}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. Software / IT"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>Job Type</label>
                                                    <select
                                                        name="type"
                                                        value={form.type}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="Full Time">Full Time</option>
                                                        <option value="Part Time">Part Time</option>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Contract">Contract</option>
                                                    </select>
                                                </div>

                                                <div className="job-field">
                                                    <label>Work Mode</label>
                                                    <select
                                                        name="workMode"
                                                        value={form.workMode}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="Onsite">Onsite</option>
                                                        <option value="Remote">Remote</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </select>
                                                </div>

                                                <div className="job-field">
                                                    <label>Payment Type</label>
                                                    <select
                                                        name="paymentType"
                                                        value={form.paymentType}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="Paid">Paid</option>
                                                        <option value="Unpaid">Unpaid</option>
                                                    </select>
                                                </div>
                                                <div className="job-field">
                                                    <label>Payment Duration</label>
                                                    <select
                                                        name="paymentDuration"
                                                        value={form.paymentDuration}
                                                        onChange={handleFormChange}
                                                        disabled={form.paymentType !== "Paid"}
                                                    >
                                                        <option value="">Select Duration</option>
                                                        <option value="1 Week">1 Week</option>
                                                        <option value="2 Weeks">2 Weeks</option>
                                                        <option value="1 Month">1 Month</option>
                                                        <option value="2 Months">2 Months</option>
                                                        <option value="3 Months">3 Months</option>
                                                        <option value="6 Months">6 Months</option>
                                                        <option value="1 Year">1 Year</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>


                                        {/* ================= LOCATION ================= */}
                                        <div className="job-form-section">

                                            <div className="job-section-title">
                                                <div className="section-icon">
                                                    <Icon name="location" size={20} />
                                                </div>
                                                <div>
                                                    <h3>Location</h3>
                                                    <p>Add the complete workplace location.</p>
                                                </div>
                                            </div>

                                            <div className="job-form-grid">

                                                {form.workMode === "Onsite" && (
                                                    <div className="job-field">
                                                        <label>Location</label>
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={form.location}
                                                            onChange={handleFormChange}
                                                            placeholder="e.g. Vijay Nagar"
                                                        />
                                                    </div>
                                                )}

                                                <div className="job-field">
                                                    <label>City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. Jabalpur"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={form.state}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. Madhya Pradesh"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>Country</label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        value={form.country}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. India"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={form.pincode}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. 482001"
                                                    />
                                                </div>

                                                <div className="job-field full-width">
                                                    <label>Full Address</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={form.address}
                                                        onChange={handleFormChange}
                                                        placeholder="Enter complete office address"
                                                    />
                                                </div>

                                            </div>
                                        </div>


                                        {/* ================= REQUIREMENTS ================= */}
                                        <div className="job-form-section">

                                            <div className="job-section-title">
                                                <div className="section-icon">
                                                    <Icon name="star" size={20} />
                                                </div>
                                                <div>
                                                    <h3>Requirements</h3>
                                                    <p>Define skills, experience and openings.</p>
                                                </div>
                                            </div>

                                            <div className="job-form-grid">

                                                {/* Skills */}
                                                {/* Skills */}
                                                <div className="job-field full-width">
                                                    <label>Required Skills</label>

                                                    <div className="skills-input-wrapper">
                                                        <div className="skill-chips">
                                                            {form.skills.map((skill) => (
                                                                <span className="skill-chip" key={skill}>
                                                                    {skill}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSkill(skill)}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <input
                                                            type="text"
                                                            placeholder="Type a skill..."
                                                            onKeyDown={addSkill}
                                                            onChange={(e) => setSkillSearch(e.target.value)}
                                                        />
                                                    </div>

                                                    {skillSearch.trim() && (
                                                        <div className="suggestion-box">
                                                            {skillSuggestions
                                                                .filter((skill) =>
                                                                    skill.toLowerCase().includes(skillSearch.toLowerCase())
                                                                )
                                                                .filter((skill) => !form.skills.includes(skill))
                                                                .slice(0, 6)
                                                                .map((skill) => (
                                                                    <button
                                                                        type="button"
                                                                        key={skill}
                                                                        onClick={() => {
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                skills: [...prev.skills, skill],
                                                                            }));
                                                                            setSkillSearch("");
                                                                        }}
                                                                    >
                                                                        {skill}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Qualification */}
                                                <div className="job-field full-width">
                                                    <label>Qualification</label>

                                                    <input
                                                        type="text"
                                                        name="qualification"
                                                        value={form.qualification}
                                                        onChange={(e) => {
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                qualification: e.target.value,
                                                            }));
                                                            setQualificationSearch(e.target.value);
                                                        }}
                                                        placeholder="e.g. B.Tech, BCA, MCA"
                                                    />

                                                    {qualificationSearch.trim() && (
                                                        <div className="suggestion-box">
                                                            {qualificationSuggestions
                                                                .filter((qualification) =>
                                                                    qualification
                                                                        .toLowerCase()
                                                                        .includes(qualificationSearch.toLowerCase())
                                                                )
                                                                .slice(0, 6)
                                                                .map((qualification) => (
                                                                    <button
                                                                        type="button"
                                                                        key={qualification}
                                                                        onClick={() => {
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                qualification,
                                                                            }));
                                                                            setQualificationSearch("");
                                                                        }}
                                                                    >
                                                                        {qualification}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>


                                                {/* Experience Required */}
                                                <div className="job-field">
                                                    <label>Experience Required</label>

                                                    <select
                                                        name="experienceRequired"
                                                        value={form.experienceRequired}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="No">No</option>
                                                        <option value="Yes">Yes</option>
                                                    </select>
                                                </div>


                                                {/* Experience Months */}
                                                <div className="job-field">
                                                    <label>Experience in Months</label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        name="experienceMonths"
                                                        value={form.experienceMonths}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. 18"
                                                        disabled={form.experienceRequired !== "Yes"}
                                                    />

                                                    <small className="field-preview">
                                                        {formatExperience(form.experienceMonths)}
                                                    </small>
                                                </div>


                                                {/* Openings */}
                                                <div className="job-field">
                                                    <label>No. of Openings</label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        name="openings"
                                                        value={form.openings}
                                                        onChange={handleFormChange}
                                                    />
                                                </div>


                                                {/* Salary */}
                                                <div className="job-field">
                                                    <label>Start Salary</label>
                                                    <input
                                                        type="number"
                                                        name="salaryStart"
                                                        value={form.salaryStart}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. 300000"
                                                        min="0"
                                                    />
                                                </div>

                                                <div className="job-field">
                                                    <label>End Salary</label>
                                                    <input
                                                        type="number"
                                                        name="salaryEnd"
                                                        value={form.salaryEnd}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. 600000"
                                                        min="0"
                                                    />
                                                </div>

                                            </div>
                                        </div>


                                        {/* ================= DESCRIPTION ================= */}
                                        <div className="job-form-section">

                                            <div className="job-section-title">
                                                <div className="section-icon">
                                                    <Icon name="document" size={20} />
                                                </div>

                                                <div>
                                                    <h3>Job Information</h3>
                                                    <p>Give candidates a clear picture of the role.</p>
                                                </div>
                                            </div>

                                            <div className="job-form-grid">

                                                <div className="job-field full-width">
                                                    <label>Summary</label>

                                                    <textarea
                                                        name="summary"
                                                        value={form.summary}
                                                        onChange={handleFormChange}
                                                        placeholder="Write a short summary about this opportunity..."
                                                        rows="3"
                                                    ></textarea>
                                                </div>

                                                <div className="job-field full-width">
                                                    <label>Job Description *</label>

                                                    <textarea
                                                        name="description"
                                                        value={form.description}
                                                        onChange={handleFormChange}
                                                        placeholder="Describe responsibilities, work environment, expectations..."
                                                        rows="6"
                                                        required
                                                    ></textarea>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="job-field full-width">
                                            <label>Rules & Regulations</label>

                                            <textarea
                                                name="rules"
                                                value={form.rules}
                                                onChange={handleFormChange}
                                                placeholder="Mention important rules, work policies, attendance requirements, etc."
                                                rows="5"
                                            ></textarea>
                                        </div>
                                        <div className="job-field full-width">
                                            <label>Other Details</label>
                                            <textarea
                                                name="otherDetails"
                                                value={form.otherDetails}
                                                onChange={handleFormChange}
                                                placeholder="Add any other important information about this job..."
                                                rows="5"
                                            ></textarea>
                                        </div>
                                        {/* ================= SCREENING QUESTIONS ================= */}
                                        <div className="job-form-section">

                                            <div className="job-section-title">
                                                <div className="section-icon">
                                                    <Icon name="message" size={20} />
                                                </div>
                                                <div>
                                                    <h3>Screening Questions</h3>
                                                    <p>Ask candidates quick questions when they apply (max 10).</p>
                                                </div>
                                            </div>

                                            <div style={{ display: "grid", gap: 14 }}>
                                                {form.screeningQuestions.map((q, i) => (
                                                    <div
                                                        key={q.id}
                                                        style={{
                                                            border: "1.5px solid rgba(120,120,140,0.25)",
                                                            borderRadius: 16,
                                                            padding: 16,
                                                            display: "grid",
                                                            gap: 12,
                                                        }}
                                                    >
                                                        <div className="job-form-grid">
                                                            <div className="job-field full-width">
                                                                <label>Question {i + 1}</label>
                                                                <input
                                                                    type="text"
                                                                    value={q.question}
                                                                    onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                                                                    placeholder="e.g. Do you have 2+ years of React experience?"
                                                                />
                                                            </div>

                                                            <div className="job-field">
                                                                <label>Reply Type</label>
                                                                <select
                                                                    value={q.type}
                                                                    onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                                                                >
                                                                    <option value="text">Short Text</option>
                                                                    <option value="yesno">Yes / No</option>
                                                                    <option value="choice">Multiple Choice</option>
                                                                </select>
                                                            </div>

                                                            {q.type === "yesno" && (
                                                                <div className="job-field">
                                                                    <label>Expected Reply</label>
                                                                    <select
                                                                        value={q.expected}
                                                                        onChange={(e) => updateQuestion(q.id, "expected", e.target.value)}
                                                                    >
                                                                        <option value="Any">Any</option>
                                                                        <option value="Yes">Yes</option>
                                                                        <option value="No">No</option>
                                                                    </select>
                                                                </div>
                                                            )}

                                                            {q.type === "choice" && (
                                                                <div className="job-field full-width">
                                                                    <label>Reply Options (comma separated)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={q.optionsText}
                                                                        onChange={(e) => updateQuestion(q.id, "optionsText", e.target.value)}
                                                                        placeholder="e.g. 0-1 years, 1-3 years, 3+ years"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={q.required}
                                                                    onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                                                />
                                                                Required
                                                            </label>

                                                            <button
                                                                type="button"
                                                                className="job-cancel-btn"
                                                                onClick={() => removeQuestion(q.id)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button type="button" className="job-cancel-btn" onClick={addQuestion}>
                                                    + Add Screening Question
                                                </button>
                                            </div>
                                        </div>

                                        {/* ================= STATUS ================= */}
                                        <div className="job-form-section">

                                            <div className="job-section-title">
                                                <div className="section-icon">
                                                    <Icon name="settings" size={20} />
                                                </div>

                                                <div>
                                                    <h3>Job Status</h3>
                                                    <p>Control whether candidates can see this job.</p>
                                                </div>
                                            </div>

                                            <div className="status-options">

                                                <button
                                                    type="button"
                                                    className={`status-option ${form.status === "Active" ? "selected" : ""
                                                        }`}
                                                    onClick={() =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            status: "Active",
                                                        }))
                                                    }
                                                >
                                                    <span className="status-option-dot active"></span>

                                                    <div>
                                                        <strong>Active</strong>
                                                        <small>Visible to candidates</small>
                                                    </div>
                                                </button>


                                                <button
                                                    type="button"
                                                    className={`status-option ${form.status === "Inactive" ? "selected" : ""
                                                        }`}
                                                    onClick={() =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            status: "Inactive",
                                                        }))
                                                    }
                                                >
                                                    <span className="status-option-dot inactive"></span>

                                                    <div>
                                                        <strong>Inactive</strong>
                                                        <small>Hidden from candidates</small>
                                                    </div>
                                                </button>

                                            </div>
                                        </div>


                                        {/* ================= ACTIONS ================= */}
                                        <div className="job-form-actions">

                                            <button
                                                type="button"
                                                className="job-cancel-btn"
                                                onClick={() => {
                                                    setForm(emptyForm);
                                                    setActive("myjobs");
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="job-submit-btn"
                                            >
                                                <Icon name="plus" size={18} />

                                                {form.id ? "Update Job" : "Post Job"}
                                            </button>

                                        </div>

                                    </form>
                                </section>
    );
}
