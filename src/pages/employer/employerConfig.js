export const filters = ["All", "Frontend", "Backend", "Design", "Marketing", "Data"];

export const menuGroups = [
    {
        title: "MAIN",
        items: [
            { id: "dashboard", label: "Dashboard", icon: "grid" },
            { id: "postjob", label: "Post a Job", icon: "plus" },
            { id: "myjobs", label: "My Jobs", icon: "briefcase", count: 6 },
            { id: "applicants", label: "Applicants", icon: "users" },
            { id: "shortlisted", label: "Shortlisted", icon: "bookmark" },
        ],
    },
    {
        title: "ACCOUNT",
        items: [
            { id: "profile", label: "Company Profile", icon: "building" },
            { id: "users", label: "Team & Users", icon: "users" },
            {
                id: "notifications",
                label: "Notifications",
                icon: "bell",

            },
            { id: "messages", label: "Messages", icon: "message" },
            { id: "settings", label: "Settings", icon: "settings" },
        ],
    },
];

// Pages where the "Post a Job" shortcut in the header actually makes sense
// -> ab sirf Dashboard page par dikhega
export const showPostJobShortcutOn = ["dashboard"];

/* =========================================================
   ICONS
   ========================================================= */
