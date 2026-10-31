export const emptyCompany = {
    name: "", tagline: "", industry: "", size: "", type: "", founded: "",
    website: "", city: "", state: "", location: "", description: "", logo_url: "",
};

export const TABS = [
    { id: "overview", label: "Overview" },
    { id: "jobs", label: "Open roles" },
];

export const EMPTY_EXTRA = {
    cover_url: "", mission: "", vision: "",
    benefits: [], tech: [], steps: [], socials: [],
    email: "", phone: "", facts: {},
};

export const BENEFITS = [
    { icon: "health", title: "Health cover", text: "Medical insurance for you and your family from day one." },
    { icon: "home", title: "Hybrid work", text: "Three days at the office, two from wherever you focus best." },
    { icon: "book", title: "Learning budget", text: "₹30,000 a year for courses, books and conferences." },
    { icon: "clock", title: "Flexible hours", text: "Pick your start time. We track outcomes, not hours." },
    { icon: "trend", title: "ESOP pool", text: "Every full-time hire shares in the company's growth." },
    { icon: "cup", title: "Team offsites", text: "Two team trips a year, planned by the team." },
];

export const HIRING_STEPS = [
    { title: "Apply", text: "Send your profile. We reply within 3 working days." },
    { title: "Intro call", text: "A 20-minute chat about you and the role." },
    { title: "Skills round", text: "A practical task or pairing session, no trick questions." },
    { title: "Team meet", text: "Meet the people you'd work with every day." },
    { title: "Offer", text: "Written offer within 48 hours of the final round." },
];

export const VALUES = [
    { emoji: "🚀", title: "Ship small, ship often", text: "We prefer a working version today over a perfect one next month." },
    { emoji: "🤝", title: "Own it together", text: "Everyone owns the outcome, from the intern to the founders." },
    { emoji: "🌱", title: "Grow on purpose", text: "Every person has a growth plan reviewed every quarter." },
    { emoji: "🔍", title: "Be honest early", text: "Bad news travels fast here, because that's how we fix it." },
];

export const GALLERY = [
    { label: "Our Bhopal studio", g: "linear-gradient(135deg,#5b3df5,#8b7bff)", tall: true },
    { label: "Friday demo day", g: "linear-gradient(135deg,#e83f7d,#ff8fb1)" },
    { label: "Hack night", g: "linear-gradient(135deg,#159fd8,#6fd3ff)" },
    { label: "Team lunch", g: "linear-gradient(135deg,#f7a51c,#ffd27a)" },
    { label: "Annual offsite", g: "linear-gradient(135deg,#12b86f,#7be3b2)", tall: true },
];

export const TEAM = [
    { name: "Rahul Sharma", role: "HR Manager", initials: "RS", color: "#5b3df5" },
    { name: "Meera Kulkarni", role: "Co-founder & CEO", initials: "MK", color: "#e83f7d" },
    { name: "Aditya Rao", role: "Co-founder & CTO", initials: "AR", color: "#159fd8" },
    { name: "Simran Kaur", role: "Head of Design", initials: "SK", color: "#f7a51c" },
    { name: "Nikhil Jain", role: "Engineering Manager", initials: "NJ", color: "#12b86f" },
    { name: "Tanya Bose", role: "Talent Partner", initials: "TB", color: "#7d2ae8" },
];

export const REVIEWS = [
    {
        name: "Former engineer",
        role: "Frontend Developer · 2 yrs",
        rating: 5,
        text: "Real ownership from week one. I shipped a feature to production in my first month and the team backed me the whole way.",
    },
    {
        name: "Current designer",
        role: "Product Designer · 1 yr",
        rating: 5,
        text: "Design has a seat at the table. Founders listen, and feedback is specific instead of vague.",
    },
    {
        name: "Current employee",
        role: "Backend Engineer · 3 yrs",
        rating: 4,
        text: "Fast-paced and sometimes chaotic around launches, but the learning curve is steep and the people are great.",
    },
];

export const RATING_SPLIT = [
    { star: 5, pct: 68 },
    { star: 4, pct: 21 },
    { star: 3, pct: 8 },
    { star: 2, pct: 2 },
    { star: 1, pct: 1 },
];

export const TECH = ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "AWS", "Docker", "Figma", "React Native"];

export const SOCIALS = [
    { icon: "linkedin", label: "LinkedIn", value: "linkedin.com/company/acmetech" },
    { icon: "twitter", label: "X / Twitter", value: "@acmetech" },
    { icon: "insta", label: "Instagram", value: "@acme.tech" },
    { icon: "github", label: "GitHub", value: "github.com/acmetech" },
];

export const CHECKLIST = [
    { label: "Company logo", weight: 10, done: true },
    { label: "Cover banner", weight: 10, done: true },
    { label: "About & mission", weight: 15, done: true },
    { label: "Company facts", weight: 15, done: true },
    { label: "Benefits & perks", weight: 12, done: true },
    { label: "Social links", weight: 12, done: true },
    { label: "Office photos", weight: 14, done: false },
    { label: "Culture video", weight: 12, done: false },
];
