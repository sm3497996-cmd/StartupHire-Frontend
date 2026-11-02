export const NAV = [
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "live", label: "Live now", icon: "live" },
    { id: "users", label: "Users", icon: "users" },
    { id: "jobs", label: "Jobs", icon: "briefcase" },
    { id: "activity", label: "Activity", icon: "activity" },
    { id: "settings", label: "Settings", icon: "settings" },
];

export const COLORS = ["#5b3df5", "#12b86f", "#e83f7d", "#159fd8", "#f7a51c", "#7d2ae8", "#ff6b4a", "#4285f4"];

export const seedUsers = [
    ["Priya Sharma", "Candidate", "Bhopal", "Chrome · Windows", 42, 12, 96, true, 0],
    ["Aman Verma", "Candidate", "Indore", "Safari · iPhone", 31, 8, 60, true, 0],
    ["Acme Technologies", "Employer", "Bhopal", "Chrome · Mac", 88, 6, 210, true, 0],
    ["Sneha Patel", "Candidate", "Remote", "Chrome · Android", 17, 5, 40, false, 25],
    ["Rohit Mehra", "Candidate", "Pune", "Firefox · Linux", 55, 14, 130, true, 0],
    ["BrightPath Labs", "Employer", "Indore", "Edge · Windows", 64, 4, 175, false, 95],
    ["Kavya Nair", "Candidate", "Bhopal", "Chrome · Android", 22, 3, 33, true, 0],
    ["Arjun Singh", "Candidate", "Hyderabad", "Chrome · Windows", 9, 2, 12, false, 340],
    ["NovaStack Pvt Ltd", "Employer", "Pune", "Chrome · Windows", 71, 9, 190, true, 0],
    ["Neha Gupta", "Candidate", "Noida", "Safari · Mac", 38, 11, 88, false, 55],
    ["Vikram Joshi", "Candidate", "Remote", "Chrome · Linux", 29, 7, 70, true, 0],
    ["Zenith Foods", "Employer", "Mumbai", "Chrome · Android", 15, 2, 22, false, 1500],
    ["Ishita Rao", "Candidate", "Bangalore", "Safari · iPhone", 47, 10, 101, true, 0],
    ["Karan Malhotra", "Candidate", "Gurgaon", "Chrome · Windows", 5, 1, 4, false, 4300],
    ["PixelCraft Studio", "Employer", "Bangalore", "Chrome · Mac", 52, 5, 118, true, 0],
    ["Ananya Iyer", "Candidate", "Remote", "Edge · Windows", 12, 3, 18, false, 210],
    ["Manish Yadav", "Candidate", "Pune", "Chrome · Android", 60, 6, 92, true, 0],
    ["Fake Recruit Co", "Employer", "Unknown", "Unknown · VPN", 2, 0, 3, false, 7200],
];

export function buildUsers() {
    const now = Date.now();
    return seedUsers.map((u, i) => {
        const [name, role, city, device, joined, count, logins, online, mins] = u;
        const parts = name.split(" ");
        return {
            id: i + 1,
            name,
            role,
            city,
            device,
            joined,
            count,
            logins,
            online,
            lastActive: now - mins * 60000,
            initials: (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1])).toUpperCase(),
            color: COLORS[i % COLORS.length],
            email: `${name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".")}@${role === "Employer" ? "company" : "mail"}.com`,
            ip: `103.${20 + i}.${(i * 37) % 250}.${(i * 91) % 250}`,
            verified: i % 3 !== 1,
            blocked: name === "Fake Recruit Co",
        };
    });
}

export function buildEvents() {
    const now = Date.now();
    const m = (x) => now - x * 60000;
    return [
        { id: 101, userId: 1, type: "login", ts: m(1) },
        { id: 102, userId: 3, type: "login", ts: m(4) },
        { id: 103, userId: 18, type: "failed", ts: m(9) },
        { id: 104, userId: 4, type: "logout", ts: m(25) },
        { id: 105, userId: 13, type: "login", ts: m(31) },
        { id: 106, userId: 16, type: "signup", ts: m(48) },
        { id: 107, userId: 10, type: "logout", ts: m(55) },
        { id: 108, userId: 5, type: "login", ts: m(62) },
        { id: 109, userId: 18, type: "blocked", ts: m(80) },
        { id: 110, userId: 6, type: "logout", ts: m(95) },
        { id: 111, userId: 9, type: "login", ts: m(130) },
        { id: 112, userId: 7, type: "login", ts: m(170) },
    ].map((e) => ({ ...e, ip: "103.20.0.1" }));
}

export const seedJobs = [
    { id: 1, title: "Frontend Developer", company: "Acme Technologies", city: "Bhopal", status: "Live", color: "#5b3df5", applicants: 48 },
    { id: 2, title: "Backend Engineer", company: "NovaStack Pvt Ltd", city: "Pune", status: "Live", color: "#12b86f", applicants: 36 },
    { id: 3, title: "UI/UX Designer", company: "PixelCraft Studio", city: "Bangalore", status: "Pending", color: "#e83f7d", },
    { id: 4, title: "Sales Executive (₹90k/week!!)", company: "Fake Recruit Co", city: "Unknown", status: "Flagged", color: "#ff6b4a", applicants: 3 },
    { id: 5, title: "Growth Marketer", company: "BrightPath Labs", city: "Indore", status: "Pending", color: "#f7a51c", },
    { id: 6, title: "DevOps Engineer", company: "NovaStack Pvt Ltd", city: "Remote", status: "Live", color: "#159fd8", applicants: 19 },
];

export const CHART = {
    "24h": {
        labels: ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"],
        values: [12, 5, 6, 30, 78, 84, 70, 88, 66, 60, 64, 30],
    },
    "7d": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [420, 510, 480, 560, 610, 380, 340],
    },
};

export const EVENT_TEXT = {
    login: "logged in",
    logout: "logged out",
    failed: "failed a login attempt",
    signup: "joined StartupHire",
    blocked: "was blocked by admin",
    forced: "was logged out by admin",
    verified: "was verified by admin",
};

export const FILTERS = ["All", "Online", "Offline", "Candidates", "Employers", "Blocked"];

export const EVENT_FILTERS = ["All", "login", "logout", "failed", "signup"];
