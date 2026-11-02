import { getStoredUser } from "../../utils/storage";

export const getCompanyKey = () => {
    try {
        const u = getStoredUser();
        return u?.id ? `startupHireCompany_${u.id}` : "startupHireCompany";
    } catch {
        return "startupHireCompany";
    }
};

export const MY_JOB_COLORS = ["#5b3df5", "#12b86f", "#e83f7d", "#159fd8", "#f7a51c", "#7d2ae8"];

export const agoText = (d) => {
    if (!d) return "recently";
    const days = Math.floor((Date.now() - new Date(String(d).replace(" ", "T")).getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week(s) ago`;
    return `${Math.floor(days / 30)} month(s) ago`;
};

export const mapMyJob = (j) => ({
    id: Number(j.id),
    title: j.title || "Untitled role",
    company_name: j.company_name,
    location: j.location || [j.city, j.state].filter(Boolean).join(", ") || "Location not specified",
    type: j.job_type || "Full Time",
    salary: j.salary || "Not disclosed",
    posted: agoText(j.created_at),
    applicants: Number(j.applicants ?? 0),
    views: Number(j.views ?? 0),
    status: j.status === "Inactive" ? "Paused" : j.status || "Active",
    color: MY_JOB_COLORS[Number(j.id) % MY_JOB_COLORS.length],
    summary: j.summary || j.description || "",
    skills: String(j.required_skills || j.requirements || "")
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
});

export const emptyForm = {
    title: "",
    headline: "",
    location: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    address: "",

    type: "Full Time",
    workMode: "Onsite",
    paymentType: "Paid",
    paymentDuration: "",
    qualification: "",
    rules: "",

    salaryStart: "",
    salaryEnd: "",
    skills: [],

    category: "General",
    jobSection: "",
    industry: "",

    experienceRequired: "No",
    experienceMonths: "",
    openings: 1,

    summary: "",
    description: "",
    otherDetails: "",
    screeningQuestions: [],
    status: "Active",

};

export const cleanSkills = (skills = []) => {
    const seen = new Set();
    return skills.filter((s) => {
        const k = String(s).trim().toLowerCase();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
    });
};

export const hasValue = (v) =>
    v && String(v).trim().toLowerCase() !== "not specified";

export const isIncomplete = (c) =>
    !c.role ||
    c.role === "Candidate" ||
    String(c.summary || "").toLowerCase().includes("not added");
