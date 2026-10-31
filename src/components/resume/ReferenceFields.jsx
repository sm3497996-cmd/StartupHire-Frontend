export function ReferenceFields({ item, editing, onChange }) {
    const val = (k) => item[k] || "";
    return (
        <>
            <div className="resume-field-group resume-field-full">
                <label style={{ opacity: 0.9, color: "#ee2a7b" }}>Reference (optional)</label>
            </div>
            <div className="resume-field-group">
                <label>Person Name</label>
                <input
                    disabled={!editing}
                    value={val("refName")}
                    placeholder="e.g. Rahul Sharma"
                    onChange={(e) => onChange("refName", e.target.value)}
                />
            </div>
            <div className="resume-field-group">
                <label>Designation</label>
                <input
                    disabled={!editing}
                    value={val("refDesignation")}
                    placeholder="e.g. HR Manager"
                    onChange={(e) => onChange("refDesignation", e.target.value)}
                />
            </div>
            <div className="resume-field-group">
                <label>Contact</label>
                <input
                    type="tel"
                    disabled={!editing}
                    value={val("refContact")}
                    placeholder="e.g. 9876543210"
                    onChange={(e) =>
                        onChange("refContact", e.target.value.replace(/[^0-9+]/g, "").slice(0, 13))
                    }
                />
            </div>
            <div className="resume-field-group resume-field-full">
                <label>Email</label>
                <input
                    type="email"
                    disabled={!editing}
                    value={val("refEmail")}
                    placeholder="e.g. rahul@company.com"
                    onChange={(e) => onChange("refEmail", e.target.value)}
                />
            </div>
        </>
    );
}
