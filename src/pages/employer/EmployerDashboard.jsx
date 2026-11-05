import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../candidate/CandidateDashboard.css"; // same design system reuse
import "./EmployerDashboard.css"; // employer add-on styles
import "../../styles/dashboard/theme-boost.css";
import "../../styles/dashboard/addons.css";
import CompanyProfile from "../company/CompanyProfile";
import CreateCompanyPage from "../company/CreateCompanyPage";
import useInteractions from "../../hooks/useInteractions";
import { api } from "../../services/interactionsService";
import { emptyFilters, applyCandidateFilters } from "./candidates/CandidateFilters.jsx";
import CandidateCard from "./candidates/CandidateCard";
import InteractionsPanel from "./InteractionsPanel";
import MyInvitations from "../candidate/components/MyInvitations";
import ApplicantsPanel from "./ApplicantsPanel";
import CandidateResumeView from "../../components/resume/CandidateResumeView";
import ResumeActions from "../../components/resume/ResumeActions";
import { EmployerIcon as Icon } from "../../components/ui/Icon";
import { FEED_URL, feedPost } from "../../services/feedService";
import { initialJobs } from "./mockData";
import { filters, menuGroups, showPostJobShortcutOn } from "./employerConfig";
import { emptyForm, getCompanyKey, isIncomplete, mapMyJob } from "./employerHelpers";
import { API_PHP } from "../../config/env";
import { USER_KEY } from "../../config/storageKeys";
import { getStoredUser } from "../../utils/storage";
import { useTheme } from "../../hooks/useTheme";
import EmployerHomeSection from "./sections/EmployerHomeSection";
import MyJobsSection from "./sections/MyJobsSection";
import PostJobSection from "./sections/PostJobSection";
import EmployerNotificationsSection from "./sections/EmployerNotificationsSection";
import EmployerMessagesSection from "./sections/EmployerMessagesSection";
import EmployerUsersSection from "./sections/EmployerUsersSection";
import JobSocialModal from "../../components/social/JobSocialModal";
import { candidateAdapter } from "../../services/candidateSocialAdapter";
import ConnectionsPanel from "./sections/ConnectionsPanel";
function Employer({ onLogout }) {
    const navigate = useNavigate();
    const currentUser = (() => {
        try {
            return getStoredUser();
        } catch {
            return null;
        }
    })();

    // "sakshi pandey" -> "Sakshi Pandey"
    const personName = (currentUser?.name || "Employer").replace(/\b\w/g, (c) => c.toUpperCase());
    const personInitials = personName.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("");
    const { section } = useParams();
    const active = section || "dashboard";

    const setActive = (id) => {
        navigate(id === "dashboard" ? "/employer-dashboard" : `/employer-dashboard/${id}`);
    };

    const { isDark: darkMode, setDark: setDarkMode } = useTheme();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [quickCommentCandidate, setQuickCommentCandidate] = useState(null);
    const [socialModal, setSocialModal] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [myJobs, setMyJobs] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [toast, setToast] = useState("");
    const [advFilters, setAdvFilters] = useState(emptyFilters);
    const {
        liked, shortlisted,
        commentsMap, commentText, setCommentText,
        toggleLike, toggleShortlist, loadComments, addComment,
        reportCandidate, setReportCandidate,
        reportReason, setReportReason,
        reportDetails, setReportDetails,
        openReport, submitReport,
        savedResumes, toggleSaveResume,
    } = useInteractions(setToast);
    const [candidates, setCandidates] = useState([]);
    const [connMap, setConnMap] = useState({}); // userId -> connected | sent | received

    const loadConnStates = async () => {
        try {
            const [f, s, p] = await Promise.all([
                api("/connections"),
                api("/connections/sent"),
                api("/connections/pending"),
            ]);
            const m = {};
            (f.connections || []).forEach((x) => { m[x.id] = "connected"; });
            (s.sent || []).forEach((x) => { m[x.id] = "sent"; });
            (p.requests || []).forEach((x) => { m[x.id] = "received"; });
            setConnMap(m);
        } catch (e) {
            console.error("Connections state error:", e);
        }
    };

    useEffect(() => { loadConnStates(); }, []);

    useEffect(() => {
        api("/interactions/candidates")
            .then((data) => {
                console.log("Candidates API:", data);
                if (data.success) {
                    setCandidates(data.candidates.filter((c) => !isIncomplete(c)));
                } else {
                    setCandidates([]);
                    setToast(data.message || "Failed to load candidates");
                }
            })
            .catch((e) => {
                console.error("Candidates API error:", e);
                setCandidates([]);
            });
    }, []);
    const [company, setCompany] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(getCompanyKey()) || "null");
        } catch {
            return null;
        }
    });
    const [memberCompany, setMemberCompany] = useState(null);

    useEffect(() => {
        fetch(`${API_PHP}/companies.php?action=my_company`, {
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.company) setMemberCompany(data.company);
            })
            .catch(() => { });
    }, []);

    const companyName = memberCompany?.name || company?.name || "";
    const pick = (obj, keys) => {
        for (const k of keys) {
            const v = obj?.[k];
            if (v && String(v).trim() && String(v).toLowerCase() !== "not specified") return v;
        }
        return "";
    };

    const profilePercent = (() => {
        const c = company || memberCompany;
        if (!c) return 0;
        const checks = [
            pick(c, ["name"]),
            pick(c, ["industry"]),
            pick(c, ["size", "company_size"]),
            pick(c, ["website", "website_url"]),
            pick(c, ["location", "city", "address"]),
            pick(c, ["about", "description"]),
            pick(c, ["logo_url", "logo"]),
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    })();

    const commentInputRef = useRef(null);
    useEffect(() => {
        fetch(`${API_PHP}/jobs.php?mine=1`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (data.success && Array.isArray(data.jobs)) setMyJobs(data.jobs.map(mapMyJob));
            })
            .catch(() => { });
    }, []);

    const [notifications, setNotifications] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [interactions, setInteractions] = useState([]);

    const loadFeed = () => {
        const get = (action) =>
            fetch(`${FEED_URL}?action=${action}`, { credentials: "include" }).then((r) => r.json());

        get("notifications").then((d) => d.success && setNotifications(d.notifications)).catch(() => { });

        get("interactions")
            .then((d) => {
                console.log("FEED interactions:", d);
                if (d.success) setInteractions(d.interactions || []);
                else setToast(d.message || "Failed to load interactions");
            })
            .catch((e) => console.error("FEED interactions error:", e));

        get("conversations")
            .then((d) => {
                if (!d.success) return;
                setConversations(d.conversations);
                setActiveConversation((prev) => prev ?? d.conversations[0]?.id ?? null);
            })
            .catch(() => { });
    };

    useEffect(() => {
        loadFeed();
        const t = setInterval(loadFeed, 30000); // har 30 sec mein refresh
        return () => clearInterval(t);
    }, []);
    const [messageDraft, setMessageDraft] = useState("");

    useEffect(() => {
        const ping = () =>
            fetch(`${API_PHP}/me.php`, { credentials: "include" }).catch(() => { });
        ping();
        const t = setInterval(ping, 120000); // har 2 minute
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 3000);
        return () => clearTimeout(t);
    }, [toast]);


    const toggleJobStatus = (id) => {
        setMyJobs((prev) =>
            prev.map((job) =>
                job.id === id
                    ? {
                        ...job,
                        status: job.status === "Active" ? "Paused" : "Active",
                    }
                    : job
            )
        );
    };
    const connect = async (candidate) => {
        const res = await api("/connections/send", {
            method: "POST",
            body: { user_id: candidate.id },
        });
        setToast(res.message || "Connection request sent");
        loadConnStates();
    };
    const shareCandidate = async (c) => {
        const shareText = `${c.name} - ${c.role}`;

        try {
            if (navigator.share) {
                await navigator.share({ title: shareText, text: c.summary });
            } else {
                await navigator.clipboard.writeText(shareText);
                setToast("Candidate details copied");
            }
        } catch (error) {
            console.log("Share cancelled");
        }
    };

    // Card ke comment icon se ab poora side panel nahi, ek chhota
    // modern quick-comment popup turant khulta hai
    const openCommentsFor = (c) => setSocialModal({ candidate: c, tab: "comments" });

    useEffect(() => {
        if (selectedCandidate) loadComments(selectedCandidate.id);
    }, [selectedCandidate]);


    const commentCount = (c) =>
        commentsMap[c.id] ? commentsMap[c.id].length : c.comments || 0;


    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        setInteractions((prev) => prev.map((i) => ({ ...i, unread: false })));
        feedPost({ action: "mark_all_read" }).catch(() => { });
    };

    const openConversation = (id) => {
        setActiveConversation(id);
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
        feedPost({ action: "mark_read", application_id: String(id) }).catch(() => { });
    };

    const sendMessage = async () => {
        const text = messageDraft.trim();
        if (!text || !activeConversation) return;
        setMessageDraft("");
        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeConversation
                    ? { ...c, messages: [...c.messages, { from: "me", text }] }
                    : c
            )
        );
        try {
            const d = await feedPost({
                action: "send_message",
                application_id: String(activeConversation),
                body: text,
            });
            if (!d.success) setToast(d.message || "Message not sent");
        } catch {
            setToast("Message not sent");
        }
    };


    const handleCreateCompany = async (data) => {
        const { logo, verified, ...fields } = data;

        let logoUrl = null;
        if (logo) {
            logoUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(logo);
            });
        }

        const newCompany = { ...fields, logo_url: logoUrl, profile_completed: 1 };

        try {
            localStorage.setItem(getCompanyKey(), JSON.stringify(newCompany));
        } catch {
            newCompany.logo_url = null;   // logo bada ho to bina logo ke save
            localStorage.setItem(getCompanyKey(), JSON.stringify(newCompany));
        }

        setCompany(newCompany);
        setToast("Company page created");
        setActive("profile");
    };


    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const addSkill = (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const skill = e.target.value.trim();

        if (!skill) return;

        if (!form.skills.includes(skill)) {
            setForm((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
            }));
        }

        e.target.value = "";
    };


    const removeSkill = (skill) => {
        setForm((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    const addQuestion = () => {
        if (form.screeningQuestions.length >= 10) {
            setToast("Maximum 10 screening questions");
            return;
        }
        setForm((prev) => ({
            ...prev,
            screeningQuestions: [
                ...prev.screeningQuestions,
                {
                    id: Date.now().toString(),
                    question: "",
                    type: "text",
                    optionsText: "",
                    expected: "Any",
                    required: true,
                },
            ],
        }));
    };

    const updateQuestion = (id, key, value) => {
        setForm((prev) => ({
            ...prev,
            screeningQuestions: prev.screeningQuestions.map((q) =>
                q.id === id ? { ...q, [key]: value } : q
            ),
        }));
    };

    const removeQuestion = (id) => {
        setForm((prev) => ({
            ...prev,
            screeningQuestions: prev.screeningQuestions.filter((q) => q.id !== id),
        }));
    };


    const formatExperience = (months) => {
        const total = Number(months);

        if (!total || total < 0) return "No experience specified";

        const years = Math.floor(total / 12);
        const remainingMonths = total % 12;

        if (years && remainingMonths) {
            return `${years} Year${years > 1 ? "s" : ""} ${remainingMonths} Month${remainingMonths > 1 ? "s" : ""}`;
        }

        if (years) {
            return `${years} Year${years > 1 ? "s" : ""}`;
        }

        return `${remainingMonths} Month${remainingMonths > 1 ? "s" : ""}`;
    };

    const [skillSearch, setSkillSearch] = useState("");

    const skillSuggestions = [
        "HTML",
        "CSS",
        "JavaScript",
        "React.js",
        "React Native",
        "Node.js",
        "Express.js",
        "MongoDB",
        "MySQL",
        "Python",
        "Java",
        "C++",
        "C",
        "PHP",
        "Laravel",
        "Git",
        "GitHub",
        "Figma",
        "UI/UX",
        "Tailwind CSS",
        "Bootstrap",
        "Machine Learning",
        "Deep Learning",
        "Data Science",
        "SQL",
        "AWS",
    ];

    const [qualificationSearch, setQualificationSearch] = useState("");

    const qualificationSuggestions = [
        "10th Pass",
        "12th Pass",
        "Diploma",
        "B.Tech",
        "B.E.",
        "BCA",
        "B.Sc",
        "BBA",
        "B.Com",
        "BA",
        "M.Tech",
        "MCA",
        "M.Sc",
        "MBA",
        "Any Graduate",
        "Any Post Graduate",
    ];


    const handlePostJob = async (e) => {
        e.preventDefault();

        if (!company && !memberCompany) {
            setToast("Create your company page before posting a job");
            setActive("profile");
            return;
        }

        if (!form.title.trim()) {
            setToast("Job title is required");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("action", form.id ? "update" : "create");

            if (form.id) {
                formData.append("job_id", form.id);
            }

            // Basic details
            formData.append("title", form.title);
            formData.append("headline", form.headline);

            // Location
            formData.append("location", form.location);
            formData.append("city", form.city);
            formData.append("state", form.state);
            formData.append("country", form.country);
            formData.append("pincode", form.pincode);
            formData.append("address", form.address);

            // Job details
            formData.append("category", form.category || "General");
            formData.append("job_section", form.jobSection);
            formData.append("industry", form.industry);
            formData.append("work_mode", form.workMode);
            formData.append("job_type", form.type);
            formData.append("payment_type", form.paymentType);
            formData.append("payment_duration", form.paymentDuration);

            // Salary
            formData.append(
                "salary",
                form.salaryStart || form.salaryEnd
                    ? `₹${Number(form.salaryStart || 0).toLocaleString("en-IN")} - ₹${Number(form.salaryEnd || 0).toLocaleString("en-IN")}`
                    : ""
            );

            // Experience
            formData.append("experience_required", form.experienceRequired);
            formData.append(
                "experience_months",
                form.experienceRequired === "Yes"
                    ? Number(form.experienceMonths || 0)
                    : 0
            );

            // Openings
            formData.append("openings", Number(form.openings || 1));

            // Skills
            const skillsString = Array.isArray(form.skills)
                ? form.skills.join(", ")
                : form.skills || "";

            formData.append("required_skills", skillsString);
            formData.append("requirements", skillsString);
            formData.append("qualification", form.qualification);

            // Description
            formData.append("summary", form.summary);
            formData.append("description", form.description);
            formData.append("rules", form.rules);
            formData.append("other_details", form.otherDetails);
            // Screening questions
            const screening = form.screeningQuestions
                .filter((q) => q.question.trim())
                .map((q) => ({
                    question: q.question.trim(),
                    type: q.type,
                    options:
                        q.type === "choice"
                            ? q.optionsText.split(",").map((s) => s.trim()).filter(Boolean)
                            : [],
                    expected: q.type === "yesno" ? q.expected : "Any",
                    required: !!q.required,
                }));
            formData.append("screening_questions", JSON.stringify(screening));


            // Status
            formData.append("status", form.status);

            const response = await fetch(
                `${API_PHP}/jobs.php`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );

            const data = await response.json();

            console.log("Job API:", data);

            if (!data.success) {
                setToast(data.message || "Failed to save job");
                return;
            }

            // Refresh My Jobs from backend
            const jobsResponse = await fetch(
                `${API_PHP}/jobs.php?mine=1`,
                {
                    credentials: "include",
                }
            );

            const jobsData = await jobsResponse.json();

            if (jobsData.success && Array.isArray(jobsData.jobs)) {
                setMyJobs(jobsData.jobs.map(mapMyJob));
            }

            setForm(emptyForm);

            setToast(
                form.id
                    ? "Job updated successfully"
                    : "Job posted successfully"
            );

            setActive("myjobs");

        } catch (error) {
            console.error("Post Job Error:", error);
            setToast("Something went wrong while saving the job");
        }
    };

    const loggedInUser = JSON.parse(
        localStorage.getItem(USER_KEY) || "{}"
    );

    const employerName = loggedInUser.name || "Employer";


    const shortlistedCandidates = candidates.filter((c) =>
        shortlisted.includes(c.id)
    );
    const shortlistedFiltered = shortlistedCandidates.filter(
        (c) => filter === "All" || c.category === filter
    );

    const baseFiltered = candidates.filter(
        (c) =>
            (filter === "All" || c.category === filter) &&
            (c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.role.toLowerCase().includes(search.toLowerCase()) ||
                c.location.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredCandidates = applyCandidateFilters(baseFiltered, advFilters);

    // Sidebar / account panel ke options ab HAMESHA naye browser tab mein khulte hain
    const handleMenu = (id) => {
        setMobileMenu(false);
        setProfileOpen(false);

        const path =
            id === "dashboard"
                ? "/employer-dashboard"
                : `/employer-dashboard/${id}`;

        window.open(path, "_blank", "noopener,noreferrer");
    };

    const titles = {
        dashboard: "Hire your next star.",
        postjob: "Post a Job",
        myjobs: "My Jobs",
        applicants: "Applicants",
        shortlisted: "Shortlisted",
        notifications: "Notifications",
        messages: "Messages",
        settings: "Settings",
        profile: "Company Profile",
        users: "Team & Users",
        connections: "My Network",
    };

    const connectButton = (person) => {
        const s = connMap[person.id];
        if (s === "connected")
            return <button className="conn-btn connected" disabled>✓ Connected</button>;
        if (s === "sent")
            return <button className="conn-btn pending" disabled>⏳ Pending</button>;
        if (s === "received")
            return <button className="conn-btn respond" onClick={() => setActive("connections")}>Respond</button>;
        return <button className="conn-btn connect" onClick={() => connect(person)}>+ Connect</button>;
    };

    /* ---------- Candidate cards grid ---------- */
    const renderCandidates = (list) => (
        <>

            {list.map((c) => (
                <div key={c.id}>
                    <CandidateCard
                        c={c}
                        liked={liked.includes(c.id)}
                        saved={shortlisted.includes(c.id)}
                        comments={commentCount(c)}
                        onOpen={() => setSelectedCandidate(c)}
                        onLike={() => toggleLike(c.id)}
                        onLikeCount={() => setSocialModal({ candidate: c, tab: "likes" })}
                        onSave={() => toggleShortlist(c.id)}
                        onComment={() => openCommentsFor(c)}
                        onShare={() => shareCandidate(c)}
                        onReport={() => openReport(c)}
                    />
                    <ResumeActions
                        candidateId={c.id}
                        name={c.name}
                        role={c.role}
                        saved={savedResumes.includes(c.id)}
                        onSave={() => toggleSaveResume(c.id)}
                        compact
                    />
                    <div className="conn-wrap">{connectButton(c)}</div>
                </div>
            ))}
            {list.length === 0 && (
                <div className="empty-state">
                    <div>⌕</div>
                    <h3>No candidates found</h3>
                    <p>Try another skill, role or city.</p>
                </div>
            )}
        </>
    );
    const renderCandidatesWithPanel = (list) => (
        <div className="tc-layout">
            <div className="tc-main">{renderCandidates(list)}</div>
            <InteractionsPanel items={interactions} onMarkAllRead={markAllRead} />

        </div>
    );

    return (
        <div className={`candidate-app employer-app ${darkMode ? "dark" : ""}`}>

            {/* TOPBAR */}
            <header className="candidate-topbar">

                <div className="brand-area">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div className="candidate-logo">
                        <span>Startup</span>
                        <b>Hire</b>
                        <i>.</i>
                        <em className="role-tag">Employer</em>
                    </div>
                </div>

                <div className="top-actions">

                    <div className="notification-wrapper">
                        <button
                            className="theme-btn"
                            onClick={() => {
                                setToolsOpen(!toolsOpen);
                                setNotificationsOpen(false);
                            }}
                            title="Search & Filter"
                        >
                            <Icon name="search" size={20} />
                        </button>

                        {toolsOpen && (
                            <div className="notification-dropdown tools-dropdown">
                                <div className="notification-head">
                                    <h3>Search &amp; Filter</h3>
                                </div>

                                <div style={{ padding: "0 16px 6px" }}>
                                    <div className="top-search" style={{ width: "100%", margin: "0 0 12px" }}>
                                        <Icon name="search" size={18} />
                                        <input
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search candidates, skills or cities..."
                                        />
                                    </div>

                                    <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.7 }}>
                                        Filter by category
                                    </p>

                                    <div className="filter-chips" style={{ margin: 0 }}>
                                        {filters.map((f) => (
                                            <button
                                                key={f}
                                                className={`chip ${filter === f ? "active" : ""}`}
                                                onClick={() => {
                                                    setFilter(f);
                                                    if (active !== "applicants") setActive("applicants");
                                                }}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="all-notifications"
                                        style={{ marginTop: 12 }}
                                        onClick={() => {
                                            setToolsOpen(false);
                                            setActive("applicants");
                                        }}
                                    >
                                        Apply &amp; view results
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="theme-btn"
                        onClick={onLogout}
                        title="Back to Home"
                    >
                        <Icon name="home" size={20} />
                    </button>

                    <button
                        className="theme-btn"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        <Icon name={darkMode ? "sun" : "moon"} size={20} />
                    </button>

                    <div className="notification-wrapper">

                        <button
                            className="notification-btn"
                            onClick={() => {
                                setNotificationsOpen(!notificationsOpen);
                                setToolsOpen(false);
                            }}
                        >
                            <Icon name="bell" size={22} />
                            <span>
                                {notifications.filter((n) => n.unread).length}
                            </span>
                        </button>

                        {notificationsOpen && (
                            <div className="notification-dropdown">

                                <div className="notification-head">
                                    <h3>Notifications</h3>
                                    <small>
                                        {notifications.filter((n) => n.unread).length} new
                                    </small>
                                </div>

                                {notifications.slice(0, 2).map((n) => (
                                    <div className="notification-item" key={n.id}>
                                        <div
                                            className={`notif-dot ${n.unread ? "" : "purple"}`}
                                        ></div>

                                        <div>
                                            <strong>{n.title}</strong>
                                            <p>{n.desc}</p>
                                            <small>{n.time}</small>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    className="all-notifications"
                                    onClick={() => {
                                        setNotificationsOpen(false);
                                        handleMenu("notifications");
                                    }}
                                >
                                    View all notifications
                                </button>

                            </div>
                        )}
                    </div>

                    <button
                        className="top-profile"
                        onClick={() => handleMenu("profile")}
                    >
                        <div className="profile-avatar">
                            {employerName
                                .split(" ")
                                .filter(Boolean)
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div className="top-profile-text">
                            <strong>{employerName}</strong>
                            <span>{loggedInUser.role === "employer" ? "Employer" : "Account"}</span>
                        </div>

                        <span className="profile-arrow">⌄</span>
                    </button>

                </div>
            </header>

            <div className="candidate-layout">

                {/* SIDEBAR */}
                <aside
                    className={`candidate-sidebar ${mobileMenu ? "mobile-open" : ""}`}
                >

                    <div className="sidebar-profile">
                        <div className="large-avatar">
                            {(employerName || "Employer")
                                .trim()
                                .split(" ")
                                .filter(Boolean)
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                        </div>

                        <div>
                            <h3>{(employerName || "Employer").replace(/\b\w/g, (c) => c.toUpperCase())}</h3>
                            <p>{companyName || "No company yet"}</p>
                        </div>
                    </div>

                    <div className="profile-progress">
                        <div className="progress-top">
                            <span>Company profile</span>
                            <b>{profilePercent}%</b>
                        </div>

                        <div className="progress-line" style={{ width: "100%", overflow: "hidden" }}>
                            <span
                                style={{
                                    display: "block",
                                    height: "100%",
                                    width: `${profilePercent}%`,
                                    minWidth: 0,
                                    padding: 0,
                                    flex: "none",
                                    transition: "width .4s ease",
                                }}
                            ></span>
                        </div>
                    </div>

                    <nav className="side-navigation">

                        {menuGroups.map((group) => (
                            <div className="menu-group" key={group.title}>

                                <p className="menu-title">{group.title}</p>

                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`side-item ${active === item.id ? "active" : ""
                                            }`}
                                        onClick={() => handleMenu(item.id)}
                                    >

                                        <span className="side-icon">
                                            <Icon name={item.icon} size={21} />
                                        </span>

                                        <span className="side-label">{item.label}</span>

                                        {item.id === "myjobs" ? (
                                            <span className="side-count">{myJobs.length}</span>
                                        ) : item.id === "shortlisted" &&
                                            shortlisted.length > 0 ? (
                                            <span className="side-count">
                                                {shortlisted.length}
                                            </span>
                                        ) : item.id === "notifications" && notifications.some((n) => n.unread) ? (
                                            <span className="side-count">
                                                {notifications.filter((n) => n.unread).length}
                                            </span>
                                        ) : item.count && item.id !== "myjobs" ? (
                                            <span className="side-count">{item.count}</span>
                                        ) : null}

                                        {active === item.id && (
                                            <span className="active-line"></span>
                                        )}

                                    </button>
                                ))}

                            </div>
                        ))}

                    </nav>

                    <div className="sidebar-bottom">

                        <button
                            className="help-card home-card"
                            onClick={onLogout}
                        >
                            <div className="help-icon">
                                <Icon name="home" size={18} />
                            </div>

                            <div>
                                <strong>Back to Home</strong>
                                <p>Return to StartupHire.in</p>
                            </div>
                        </button>

                    </div>

                </aside>

                {mobileMenu && (
                    <div
                        className="sidebar-overlay"
                        onClick={() => setMobileMenu(false)}
                    ></div>
                )}

                {/* MAIN */}
                <main className="candidate-main">
                    <MyInvitations onAccepted={() => window.location.reload()} />

                    {!company && !memberCompany && active === "profile" ? (
                        <CreateCompanyPage onCreate={handleCreateCompany} />
                    ) : (
                        <>

                            {!company && !memberCompany && (
                                <div className="setup-banner">
                                    <div>
                                        <strong>Set up your company page</strong>
                                        <p>Candidates need to see who is hiring before you post a job.</p>
                                    </div>
                                    <button className="primary-btn" onClick={() => setActive("profile")}>
                                        Set up now
                                    </button>
                                </div>
                            )}

                            <div className="page-heading">

                                <div>
                                    <span className="welcome-text">
                                        WELCOME BACK, {(employerName || "EMPLOYER").toUpperCase()}
                                    </span>

                                    <h1>{titles[active] || "Dashboard"}</h1>

                                    <p>
                                        Find, shortlist and hire the right talent for your
                                        startup.
                                    </p>
                                </div>

                                {showPostJobShortcutOn.includes(active) && (
                                    <button
                                        className="edit-profile-btn"
                                        onClick={() => setActive("postjob")}
                                    >
                                        <Icon name="plus" size={18} />
                                        Post a Job
                                    </button>
                                )}

                            </div>

                            {/* DASHBOARD */}
                            {active === "dashboard" ? (
                                <EmployerHomeSection
                                    advFilters={advFilters}
                                    candidates={candidates}
                                    filter={filter}
                                    filteredCandidates={filteredCandidates}
                                    myJobs={myJobs}
                                    renderCandidatesWithPanel={renderCandidatesWithPanel}
                                    setActive={setActive}
                                    setAdvFilters={setAdvFilters}
                                    setFilter={setFilter}
                                    shortlisted={shortlisted}
                                />
                            ) : active === "applicants" ? (
                                <ApplicantsPanel onToast={setToast} />
                            ) : active === "shortlisted" ? (
                                <ApplicantsPanel initialStatus="Shortlisted" onToast={setToast} />
                            ) : active === "myjobs" ? (
                                <MyJobsSection
                                    company={company}
                                    employerName={employerName}
                                    myJobs={myJobs}
                                    setActive={setActive}
                                    toggleJobStatus={toggleJobStatus}
                                />
                            ) : active === "postjob" ? (
                                <PostJobSection
                                    addQuestion={addQuestion}
                                    addSkill={addSkill}
                                    form={form}
                                    formatExperience={formatExperience}
                                    handleFormChange={handleFormChange}
                                    handlePostJob={handlePostJob}
                                    qualificationSearch={qualificationSearch}
                                    qualificationSuggestions={qualificationSuggestions}
                                    removeQuestion={removeQuestion}
                                    removeSkill={removeSkill}
                                    setActive={setActive}
                                    setForm={setForm}
                                    setQualificationSearch={setQualificationSearch}
                                    setSkillSearch={setSkillSearch}
                                    skillSearch={skillSearch}
                                    skillSuggestions={skillSuggestions}
                                    updateQuestion={updateQuestion}
                                />
                            ) : active === "notifications" ? (

                                <EmployerNotificationsSection
                                    markAllRead={markAllRead}
                                    notifications={notifications}
                                />

                            ) : active === "messages" ? (

                                <EmployerMessagesSection
                                    activeConversation={activeConversation}
                                    conversations={conversations}
                                    messageDraft={messageDraft}
                                    openConversation={openConversation}
                                    sendMessage={sendMessage}
                                    setMessageDraft={setMessageDraft}
                                />

                            ) : active === "profile" ? (
                                <CompanyProfile
                                    company={company || memberCompany}
                                    jobs={myJobs}
                                    onEdit={() => setProfileOpen(true)}
                                    onPostJob={() => setActive("postjob")}
                                    onViewJobs={() => setActive("myjobs")}
                                    onToast={setToast}
                                />
                            ) : active === "connections" ? (
                                <ConnectionsPanel />
                            ) : active === "users" ? (
                                <EmployerUsersSection
                                    setToast={setToast}
                                />
                            ) : (
                                <section className="content-panel">

                                    <div className="big-panel-icon blue-bg">
                                        <Icon name="settings" size={35} />
                                    </div>

                                    <h2>Settings</h2>

                                    <p>
                                        Manage your company preferences, notifications and
                                        billing details here.
                                    </p>

                                    <button
                                        className="primary-btn"
                                        onClick={() => setActive("dashboard")}
                                    >
                                        Back to Dashboard
                                    </button>

                                </section>
                            )}
                        </>
                    )}

                </main>
            </div>

            {/* CANDIDATE SIDE PANEL */}
            {selectedCandidate && (
                <div
                    className="profile-modal-overlay"
                    onClick={() => setSelectedCandidate(null)}
                >

                    <div
                        className="job-profile-panel"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="panel-close"
                            onClick={() => setSelectedCandidate(null)}
                        >
                            <Icon name="close" size={23} />
                        </button>

                        <div
                            className="panel-cover"
                            style={{
                                background: `linear-gradient(135deg, ${selectedCandidate.color}, #111827)`,
                            }}
                        >
                            <div
                                className="panel-company-logo"
                                style={{ background: selectedCandidate.color }}
                            >
                                {selectedCandidate.initials}
                            </div>
                        </div>

                        <div className="panel-content">

                            <div className="panel-title">

                                <div>
                                    <span className="verified-company">
                                        ✓ {selectedCandidate.match}% match
                                    </span>

                                    <h2>{selectedCandidate.name}</h2>

                                    <h3>{selectedCandidate.role}</h3>
                                </div>

                                <button
                                    className={`panel-save ${shortlisted.includes(selectedCandidate.id)
                                        ? "saved"
                                        : ""
                                        }`}
                                    onClick={() => toggleShortlist(selectedCandidate.id)}
                                >
                                    <Icon name="bookmark" size={27} />
                                </button>

                            </div>

                            <div className="panel-meta">
                                <span>
                                    <Icon name="location" size={18} />
                                    {selectedCandidate.location}
                                </span>
                                <span>
                                    <Icon name="salary" size={18} />
                                    Expected {selectedCandidate.salary}
                                </span>
                                <span>
                                    <Icon name="mail" size={18} />
                                    {selectedCandidate.email}
                                </span>
                            </div>

                            <div className="panel-info-grid">
                                <div>
                                    <small>Experience</small>
                                    <strong>{selectedCandidate.experience.replace(" experience", "")}</strong>
                                </div>
                                <div>
                                    <small>Availability</small>
                                    <strong>{selectedCandidate.availability.replace("Available ", "")}</strong>
                                </div>
                                <div>
                                    <small>Education</small>
                                    <strong>{selectedCandidate.education}</strong>
                                </div>
                            </div>

                            <div className="panel-actions">

                                <button
                                    className={`large-social ${liked.includes(selectedCandidate.id) ? "liked" : ""
                                        }`}
                                    onClick={() => toggleLike(selectedCandidate.id)}
                                >
                                    <Icon name="heart" size={28} />
                                    <span>
                                        {liked.includes(selectedCandidate.id)
                                            ? selectedCandidate.likes + 1
                                            : selectedCandidate.likes}
                                    </span>
                                    <small>Likes</small>
                                </button>

                                <button
                                    className="large-social"
                                    onClick={() => {
                                        commentInputRef.current?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                        });
                                        commentInputRef.current?.focus();
                                    }}
                                >
                                    <Icon name="comment" size={28} />
                                    <span>{commentCount(selectedCandidate)}</span>
                                    <small>Comments</small>
                                </button>

                                <button
                                    className="large-social"
                                    onClick={() => shareCandidate(selectedCandidate)}
                                >
                                    <Icon name="share" size={27} />
                                    <span>Share</span>
                                </button>

                                {/* NAYA: Report */}
                                <button
                                    className="large-social"
                                    onClick={() => openReport(selectedCandidate)}
                                >
                                    <Icon name="flag" size={27} />
                                    <span>Report</span>
                                </button>

                            </div>

                            <div className="panel-section">
                                <CandidateResumeView candidateId={selectedCandidate.id} />
                            </div>

                            <div className="panel-section comments-section">

                                <h3>Comments ({commentCount(selectedCandidate)})</h3>

                                <div className="comments-list">
                                    {(commentsMap[selectedCandidate.id] || []).length === 0 && (
                                        <p className="no-comments">
                                            No comments yet. Add a note about this candidate.
                                        </p>
                                    )}

                                    {(commentsMap[selectedCandidate.id] || []).map((c, i) => (
                                        <div className="comment-item" key={i}>
                                            <div className="comment-avatar">
                                                {(c.employer_name || "?").slice(0, 2).toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>{c.employer_name}</strong>
                                                <small> · {c.time_ago}</small>
                                                <p>{c.comment_text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="comment-input-row">
                                    <input
                                        ref={commentInputRef}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment (candidate will see this)..."
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            addComment(selectedCandidate.id)
                                        }
                                    />

                                    <button
                                        onClick={() => addComment(selectedCandidate.id)}
                                    >
                                        <Icon name="send" size={18} />
                                    </button>
                                </div>

                            </div>
                            <ResumeActions
                                candidateId={selectedCandidate.id}
                                name={selectedCandidate.name}
                                role={selectedCandidate.role}
                                saved={savedResumes.includes(selectedCandidate.id)}
                                onSave={() => toggleSaveResume(selectedCandidate.id)}
                            />

                            <div className="panel-btn-row">
                                <button
                                    className="apply-btn"
                                    onClick={() => toggleShortlist(selectedCandidate.id)}
                                >
                                    {shortlisted.includes(selectedCandidate.id)
                                        ? "✓ Shortlisted"
                                        : "Shortlist Candidate"}
                                </button>

                                <a
                                    className="secondary-btn panel-contact"
                                    href={`mailto:${selectedCandidate.email}`}
                                >
                                    <Icon name="mail" size={18} />
                                    Contact
                                </a>
                                {connectButton(selectedCandidate)}
                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* QUICK COMMENT POPUP — turant comment/note karne ke liye */}
            {quickCommentCandidate && (
                <div
                    className="quick-comment-overlay"
                    onClick={() => setQuickCommentCandidate(null)}
                >
                    <div
                        className="quick-comment-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="quick-comment-head">
                            <div className="quick-comment-title">
                                <div
                                    className="quick-comment-logo"
                                    style={{
                                        background: `linear-gradient(135deg, ${quickCommentCandidate.color}, ${quickCommentCandidate.color}99)`,
                                    }}
                                >
                                    {quickCommentCandidate.initials}
                                </div>

                                <div>
                                    <strong>{quickCommentCandidate.name}</strong>
                                    <span>{quickCommentCandidate.role}</span>
                                </div>
                            </div>

                            <button
                                className="quick-comment-close"
                                onClick={() => setQuickCommentCandidate(null)}
                            >
                                <Icon name="close" size={18} />
                            </button>
                        </div>

                        <div className="quick-comment-list">
                            {(commentsMap[quickCommentCandidate.id] || []).length === 0 && (
                                <p className="no-comments">
                                    No comments yet. Add a note about this candidate.
                                </p>
                            )}

                            {(commentsMap[quickCommentCandidate.id] || []).map((c, i) => (
                                <div className="comment-item" key={i}>
                                    <div className="comment-avatar">
                                        {(c.employer_name || "?").slice(0, 2).toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>{c.employer_name}</strong>
                                        <small> · {c.time_ago}</small>
                                        <p>{c.comment_text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="comment-input-row quick-comment-input">
                            <input
                                autoFocus
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment (candidate will see this)..."
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    addComment(quickCommentCandidate.id)
                                }
                            />

                            <button
                                onClick={() => addComment(quickCommentCandidate.id)}
                            >
                                <Icon name="send" size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* COMPANY PROFILE PANEL */}
            {profileOpen && (
                <div
                    className="profile-modal-overlay"
                    onClick={() => setProfileOpen(false)}
                >

                    <div
                        className="candidate-profile-panel"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="panel-close"
                            onClick={() => setProfileOpen(false)}
                        >
                            <Icon name="close" size={23} />
                        </button>

                        <div className="candidate-profile-cover">
                            <div className="profile-photo-big">
                                {(companyName || employerName)
                                    .split(" ")
                                    .filter(Boolean)
                                    .map((w) => w[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                            </div>
                        </div>

                        <div className="candidate-profile-body">

                            <span className="profile-badge">HIRING NOW</span>

                            <h2>{companyName || employerName}</h2>

                            <p className="profile-role">Software & Product Startup</p>

                            <p className="profile-location">📍 Bhopal, Madhya Pradesh</p>

                            <div className="profile-stats">
                                <div>
                                    <strong>{myJobs.length}</strong>
                                    <span>Jobs</span>
                                </div>
                                <div>
                                    <strong>248</strong>
                                    <span>Applicants</span>
                                </div>
                                <div>
                                    <strong>{profilePercent}%</strong>
                                    <span>Profile</span>
                                </div>
                            </div>

                            <div className="panel-section">
                                <h3>About</h3>
                                <p>
                                    We build modern digital products for fast-growing
                                    startups. Our team of 40+ engineers and designers loves
                                    solving real problems.
                                </p>
                            </div>

                            <div className="panel-section">
                                <h3>We hire for</h3>

                                <div className="panel-skills">
                                    <span>React</span>
                                    <span>Node.js</span>
                                    <span>UI/UX</span>
                                    <span>Marketing</span>
                                    <span>DevOps</span>
                                </div>
                            </div>

                            <button
                                className="apply-btn"
                                onClick={() => {
                                    setProfileOpen(false);
                                    setActive("postjob");
                                }}
                            >
                                Post a New Job
                            </button>

                        </div>

                    </div>

                </div>
            )}
            {reportCandidate && (
                <div className="quick-comment-overlay" onClick={() => setReportCandidate(null)}>
                    <div className="quick-comment-box" onClick={(e) => e.stopPropagation()}>
                        <div className="quick-comment-head">
                            <div className="quick-comment-title">
                                <div>
                                    <strong>Report {reportCandidate.name}</strong>
                                    <span>Admin will review this report</span>
                                </div>
                            </div>
                            <button className="quick-comment-close" onClick={() => setReportCandidate(null)}>
                                <Icon name="close" size={18} />
                            </button>
                        </div>

                        <div style={{ padding: "0 16px 16px", display: "grid", gap: 10 }}>
                            <select
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                style={{ padding: 10, borderRadius: 10 }}
                            >
                                <option value="">Select reason</option>
                                <option>Fake profile</option>
                                <option>Spam / misleading</option>
                                <option>Inappropriate content</option>
                                <option>Abusive behaviour</option>
                                <option>Other</option>
                            </select>

                            <textarea
                                rows="3"
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                                placeholder="Details (optional)"
                                style={{ padding: 10, borderRadius: 10 }}
                            />

                            <button className="apply-btn" onClick={submitReport}>
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {socialModal && (
                <JobSocialModal
                    jobId={socialModal.candidate.id}
                    title={socialModal.candidate.name}
                    initialTab={socialModal.tab}
                    adapter={candidateAdapter}
                    onClose={() => setSocialModal(null)}
                    onChange={() => loadComments(socialModal.candidate.id)}
                />
            )}


            {/* TOAST */}
            {toast && <div className="toast">{toast}</div>}

        </div>
    );
}

export default Employer;
