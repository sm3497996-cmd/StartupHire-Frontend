export const JOB_COLORS = ["#5b3df5", "#12b86f", "#e83f7d", "#159fd8", "#f7a51c", "#7d2ae8", "#ff6b4a", "#3395ff"];

export const splitSkills = (text) =>
    String(text || "")
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 6);

// Converts a row from jobs.php into the shape the cards already use
export const mapJob = (j, ago) => {
    const companyName = j.company_name || "Company";
    const text = j.summary || j.description || "";
    const openings = Number(j.openings) || 0;

    return {
        id: Number(j.id),
        company: companyName,
        logo:
            companyName
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?",
        title: j.title || "Untitled role",
        location: j.location || [j.city, j.state].filter(Boolean).join(", ") || "Location not specified",
        salary: j.salary || "Not disclosed",
        posted: ago(j.created_at),
        type: j.job_type || j.work_mode || "Full Time",
        category: j.category || "General",
        color: JOB_COLORS[Number(j.company_id) % JOB_COLORS.length],
        open: openings > 0 ? `${openings} open role${openings > 1 ? "s" : ""}` : "",
        likes: 0,
        comments: 0,
        summary: text.length > 160 ? text.slice(0, 160).trim() + "…" : text,
        skills: splitSkills(j.required_skills || j.requirements),
        about: j.company_description || "",
        about: j.company_description || "",
        screening: Array.isArray(j.screening_questions) ? j.screening_questions : [],
    };
};
