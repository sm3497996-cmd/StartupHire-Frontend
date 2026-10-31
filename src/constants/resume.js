// Predefined skill suggestions used for the Skills autocomplete/tag input
export const SKILL_SUGGESTIONS = [
    "React.js", "React Native", "JavaScript", "TypeScript", "HTML5", "CSS3",
    "Node.js", "Express.js", "Next.js", "Vue.js", "Angular", "Redux",
    "Tailwind CSS", "Bootstrap", "SASS/SCSS", "REST APIs", "GraphQL",
    "MongoDB", "MySQL", "PostgreSQL", "Firebase", "SQL",
    "Python", "Django", "Flask", "Java", "Spring Boot", "PHP", "Laravel",
    "C++", "C#", ".NET", "Kotlin", "Swift", "Flutter", "Dart",
    "Git & GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "DevOps", "Linux",
    "Figma", "Adobe XD", "Photoshop", "UI Design", "UX Research", "Prototyping",
    "Excel", "Power BI", "Tableau", "Data Analysis", "Machine Learning", "Deep Learning",
    "SEO", "Digital Marketing", "Content Writing", "Social Media Marketing", "Google Ads",
    "Project Management", "Agile", "Scrum", "Team Leadership", "Communication",
    "Responsive Design", "Testing & QA", "Unit Testing", "Problem Solving",
];

export const resumeTabsList = [
    "Resume",
    "Personal Info",
    "Address",
    "Education",
    "Skills",
    "Courses & Certifications",
    "Work Experience",
    "Projects",
    "Achievements",
    "Other Links",
];

export const defaultResumeData = {
    personal: { name: "", email: "", contact: "", whatsapp: "", mother: "", father: "", gender: "Male", dob: "", intro: "" },
    address: {
        permanent: { line1: "", city: "", state: "", country: "", pincode: "" },
        current: { line1: "", city: "", state: "", country: "", pincode: "" },
    },
    education: [],
    skills: [],
    courses: [],
    experience: [],
    projects: [],
    achievements: [],
    links: [],
};

export const BLANK_TEMPLATES = {
    education: {
        degree: "", board: "", industry: "", sector: "", percentage: "",
        courseType: "", type: "Full Time", startDate: "", endDate: "",
        city: "", state: "", country: "", pincode: "",
    },
    courses: {
        title: "", institute: "", certNumber: "", link: "",
        startDate: "", endDate: "", validTill: "", details: "",
        skillsLearned: [], attachments: [],
    },
    experience: {
        role: "", company: "", type: "Full Time", location: "",
        startDate: "", endDate: "", description: "",
        refName: "", refDesignation: "", refContact: "", refEmail: "",
        attachments: [],
    },
    projects: {
        title: "", stack: [], description: "", link: "",
        refName: "", refDesignation: "", refContact: "", refEmail: "",
        attachments: [],
    },
    achievements: { title: "", desc: "", attachments: [] },
    links: { label: "", url: "" },
};

export const PAD_SECTIONS = [
    "education",
    "courses",
    "experience",
    "projects",
    "achievements",
    "links",
];
