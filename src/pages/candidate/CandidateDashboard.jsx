import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CandidateDashboard.css";
import "../../styles/dashboard/theme-boost.css";
import "../../styles/dashboard/addons.css";
import "../../components/resume/resume-profile.css";
import { applicationStats } from "./components/MyApplicationCard";
import { downloadResume } from "../../utils/resumePdf";
import { CandidateIcon as Icon } from "../../components/ui/Icon";
import { timeAgoInDays } from "../../utils/date";
import { SOCIAL_API, socialPost } from "../../services/socialService";
import { safeLink } from "../../utils/safeLink";
import { mapJob } from "./candidateHelpers";
import { menuGroups } from "./candidateMenu";
import { BLANK_TEMPLATES, PAD_SECTIONS, SKILL_SUGGESTIONS, defaultResumeData } from "../../constants/resume";
import { hasText, makeBlank } from "../../utils/resumeHelpers";
import { API_LARAVEL, API_PHP } from "../../config/env";
import { getStoredUser } from "../../utils/storage";
import { useTheme } from "../../hooks/useTheme";
import DashboardHomeSection from "./sections/DashboardHomeSection";
import FindJobsSection from "./sections/FindJobsSection";
import SavedJobsSection from "./sections/SavedJobsSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import SuggestionsSection from "./sections/SuggestionsSection";
import CompaniesSection from "./sections/CompaniesSection";
import NotificationsSection from "./sections/NotificationsSection";
import MessagesSection from "./sections/MessagesSection";
import ProfileSection from "./sections/ProfileSection";


function Candidate({ onLogout }) {
    const navigate = useNavigate();
    const { section } = useParams();
    const active = section || "dashboard";
    const loggedInUser = (() => {
        try {
            return getStoredUser() || {};
        } catch {
            return {};
        }
    })();
    const candidateName = loggedInUser.name || "Candidate";
    const firstName = candidateName.trim().split(" ")[0];
    const candidateInitials =
        candidateName
            .split(" ")
            .filter(Boolean)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "?";

    const setActive = (id) => {
        navigate(id === "dashboard" ? "/candidate-dashboard" : `/candidate-dashboard/${id}`);
    };

    const { isDark: darkMode, setDark: setDarkMode } = useTheme();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [liked, setLiked] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [saved, setSaved] = useState([]);
    const [applications, setApplications] = useState([]);
    const [appsLoading, setAppsLoading] = useState(true);
    const [appFilter, setAppFilter] = useState("All");
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const notify = (message, type) => {
        const t =
            type ||
            (/fail|could not|wrong|error|nahi|invalid|not found/i.test(message) ? "error" : "success");
        setToast({ message, type: t });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    };

    const APP_COLORS = ["#5b3df5", "#12b86f", "#e83f7d", "#159fd8", "#f7a51c", "#7d2ae8"];

    const [allJobs, setAllJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_PHP}/jobs.php`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setAllJobs((data.jobs || []).map((j) => mapJob(j, timeAgoInDays)));
            })
            .catch((e) => console.error("Load jobs error:", e))
            .finally(() => setJobsLoading(false));
    }, []);
    useEffect(() => {
        const ping = () =>
            fetch(`${API_PHP}/me.php`, {
                credentials: "include",
            }).catch(() => { });

        ping();
        const t = setInterval(ping, 30000); // har 2 minute
        return () => clearInterval(t);
    }, []);

    const jobCategories = [
        "All",
        ...Array.from(new Set(allJobs.map((j) => j.category).filter(Boolean))),
    ];

    const companiesList = Array.from(new Map(allJobs.map((j) => [j.company, j])).values()).map((j) => ({
        name: j.company,
        logo: j.logo,
        color: j.color,
        openRoles: allJobs.filter((x) => x.company === j.company).length,
        location: j.location,
        about: j.about || `${j.company} is hiring on StartupHire. Explore open positions and apply directly.`,
    }));
    useEffect(() => {
        const loadSavedJobs = async () => {
            try {
                const response = await fetch(
                    `${API_PHP}/saved_jobs.php`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                console.log("Saved Jobs API:", data);

                if (!data.success) {
                    console.error(data.message);
                    return;
                }

                setSaved(data.jobs.map((job) => Number(job.id)));
            } catch (error) {
                console.error("Load Saved Jobs Error:", error);
            }
        };

        loadSavedJobs();
    }, []);

    useEffect(() => {
        fetch(`${SOCIAL_API}?action=summary`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => {
                if (!d.success) return;
                setLiked((d.liked || []).map(Number));
                setLikeCounts(d.likes || {});
                setCommentCounts(d.comments || {});
            })
            .catch((e) => console.error("Social summary error:", e));
    }, []);

    useEffect(() => {
        fetch(`${API_PHP}/applications.php?mine=1`, {
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (!data.success) return;
                setApplications(data.applications);
            })
            .catch((e) => console.error("Load applications error:", e))
            .finally(() => setAppsLoading(false));
    }, []);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyJob, setApplyJob] = useState(null);
    const [answers, setAnswers] = useState({});
    const [quickCommentJob, setQuickCommentJob] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [resumeTab, setResumeTab] = useState("Resume");
    const [savingResume, setSavingResume] = useState(false);
    const [resumeData, setResumeData] = useState({
        ...defaultResumeData,
        personal: {
            ...defaultResumeData.personal,
            name: loggedInUser.name || "",
            email: loggedInUser.email || "",
            contact: loggedInUser.phone || "",
            whatsapp: "",
            mother: "",
            father: "",
            gender: "Male",
            dob: "",
            intro: "",
        },
    });
    const [loadingResume, setLoadingResume] = useState(false);
    const [resumeLoaded, setResumeLoaded] = useState(false);
    const [photoPreview, setPhotoPreview] = useState("");
    const candidateRole = resumeData.personal.headline || "Candidate";
    const shownPhoto = photoPreview || resumeData.personal.photo;
    const avatarContent = shownPhoto
        ? <img className="avatar-img" src={shownPhoto} alt="" />
        : candidateInitials;

    // Personal Info & Address inline-edit toggles (fields stay disabled until "Edit" is clicked)
    const [personalEditing, setPersonalEditing] = useState(false);
    const [addressPermEditing, setAddressPermEditing] = useState(false);
    const [addressCurrEditing, setAddressCurrEditing] = useState(false);
    const photoInputRef = useRef(null);
    const [photoBusy, setPhotoBusy] = useState(false);

    // Skills autocomplete/tag input
    const [skillInput, setSkillInput] = useState("");
    const skillSuggestions = skillInput.trim()
        ? SKILL_SUGGESTIONS.filter(
            (s) =>
                s.toLowerCase().includes(skillInput.trim().toLowerCase()) &&
                !resumeData.skills.some((sk) => sk.toLowerCase() === s.toLowerCase())
        ).slice(0, 6)
        : [];

    const addSkill = (value) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        if (resumeData.skills.some((sk) => sk.toLowerCase() === trimmed.toLowerCase())) {
            setSkillInput("");
            return;
        }
        setResumeData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setSkillInput("");
    };

    useEffect(() => {
        const loadResume = async () => {
            try {
                const user = getStoredUser();
                const candidateId = user?.id;
                if (!candidateId) return;

                setLoadingResume(true);

                const response = await fetch(`${API_LARAVEL}/resume/${candidateId}`, {
                    credentials: "include",
                });
                const data = await response.json();

                if (data.success && data.resume) {
                    const r = data.resume;
                    const atts = r.attachments || [];
                    const attFor = (section, id) =>
                        atts.filter((a) => a.section === section && Number(a.item_id) === Number(id));
                    const p = r.personal || {};
                    const fmtD = (d) => (d ? String(d).slice(0, 10).split("-").reverse().join("-") : "");
                    const fmtM = (d) => {
                        if (!d) return "";
                        const [y, m] = String(d).slice(0, 10).split("-");
                        return `${m}-${y}`;
                    };

                    setResumeData((prev) => ({
                        ...prev,
                        personal: {
                            ...prev.personal,
                            headline: p.resume_headline || prev.personal.headline,
                            photo: p.profile_photo || "",
                            intro: p.profile_summary || prev.personal.intro,
                            whatsapp: p.whatsapp ?? prev.personal.whatsapp,
                            mother: p.mother ?? prev.personal.mother,
                            father: p.father ?? prev.personal.father,
                            contact: p.contact ?? prev.personal.contact,
                            gender: p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase() : prev.personal.gender,
                            dob: p.dob ? fmtD(p.dob) : prev.personal.dob,
                        },
                        address: {
                            ...prev.address,
                            current: {
                                line1: p.address || "",
                                city: p.city || "",
                                state: p.state || "",
                                country: p.country || "",
                                pincode: p.pincode || "",
                            },
                        },
                        skills: (r.skills || []).map((s) => s.skill_name),
                        education: (r.education || []).map((e) => ({
                            id: String(e.id), degree: e.degree_name || "", board: e.board_university || "",
                            industry: e.specialization || "", sector: "", percentage: e.percentage_cgpa ?? "",
                            courseType: "", type: e.education_level || "Full Time",
                            startDate: e.start_year ? `01-${e.start_year}` : "", endDate: e.end_year ? `01-${e.end_year}` : "",
                            city: "", state: "", country: "", pincode: "",
                        })),
                        courses: (r.courses || []).map((c) => ({
                            id: String(c.id), title: c.title || "", institute: c.issued_by || "", certNumber: c.credential_id || "",
                            link: c.certificate_url || "", startDate: fmtD(c.issue_date), endDate: fmtD(c.expiry_date),
                            validTill: "", details: c.details || "", skillsLearned: [],
                            attachments: attFor("course", c.id),
                        })),
                        experience: (r.experience || []).map((e) => ({
                            id: String(e.id), role: e.designation || "", company: e.company_name || "",
                            type: e.employment_type || "Full Time", location: e.location || "",
                            startDate: fmtM(e.start_date), endDate: e.currently_working ? "Present" : fmtM(e.end_date),
                            description: e.job_description || "",
                            description: e.job_description || "",
                            refName: e.reference_name || "",
                            refDesignation: e.reference_designation || "",
                            refContact: e.reference_contact || "",
                            refEmail: e.reference_email || "",
                            attachments: attFor("experience", e.id),
                        })),
                        projects: (r.projects || []).map((x) => ({
                            id: String(x.id), title: x.project_title || "",
                            stack: x.technologies_used ? x.technologies_used.split(",").map((s) => s.trim()).filter(Boolean) : [],
                            description: x.description || "", link: x.project_url || "",
                            refName: x.reference_name || "",
                            refDesignation: x.reference_designation || "",
                            refContact: x.reference_contact || "",
                            refEmail: x.reference_email || "",
                            attachments: attFor("project", x.id),
                        })),
                        achievements: (r.achievements || []).map((x) => ({
                            title: x.title || "",
                            desc: x.description || "",
                            attachments: attFor("achievement", x.id),
                        })),
                        links: (r.links || []).map((link) => ({
                            label: link.label || "",
                            url: link.url || "",
                        })),
                    }));
                }
            } catch (error) {
                console.error("Load Resume Error:", error);
            } finally {
                setLoadingResume(false);
                setResumeLoaded(true);
            }
        };

        loadResume();
    }, []);

    const cleanedResume = () => ({
        ...resumeData,
        education: resumeData.education.filter((e) => hasText(e, ["degree", "board"])),
        courses: resumeData.courses.filter((c) => hasText(c, ["title", "institute"])),
        experience: resumeData.experience.filter((e) => hasText(e, ["role", "company"])),
        projects: resumeData.projects.filter((p) => hasText(p, ["title"])),
        achievements: resumeData.achievements.filter((a) => hasText(a, ["title"])),
        links: resumeData.links.filter((l) => hasText(l, ["label", "url"])),
    });

    const handleSaveResume = async () => {
        const cleaned = cleanedResume();
        try {
            const user = getStoredUser();

            const candidateId = user?.id;

            if (!candidateId) {
                notify("Candidate login information not found.");
                return;
            }

            setSavingResume(true);

            const response = await fetch(
                `${API_LARAVEL}/resume`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        candidate_id: candidateId,

                        personal: {
                            ...resumeData.personal,
                            headline: resumeData.personal.headline || "",
                            summary: resumeData.personal.intro,
                            dob: resumeData.personal.dob
                                ? resumeData.personal.dob.split("-").reverse().join("-")
                                : null,

                            address: resumeData.address.current.line1,
                            city: resumeData.address.current.city,
                            state: resumeData.address.current.state,
                            country: resumeData.address.current.country,
                            pincode: resumeData.address.current.pincode,
                        },

                        education: cleaned.education.map((item) => ({
                            candidate_id: candidateId,
                            education_level: item.type,
                            degree_name: item.degree,
                            specialization: item.industry,
                            institution_name: null,
                            board_university: item.board,
                            start_year: item.startDate
                                ? item.startDate.split("-")[1]
                                : null,
                            end_year: item.endDate
                                ? item.endDate.split("-")[1]
                                : null,
                            percentage_cgpa: item.percentage
                                ? parseFloat(String(item.percentage).replace("%", "").trim())
                                : null,
                            is_pursuing: false,
                            city: item.city,
                            state: item.state,
                            country: item.country,
                            pincode: item.pincode,
                            status: "active",
                        })),

                        skills: resumeData.skills.map((skill) => ({
                            skill_name: skill,
                            proficiency_level: "Intermediate",
                            experience_years: 0,
                        })),

                        courses: cleaned.courses.map((item) => ({
                            ...item,
                            issue_date: item.startDate
                                ? item.startDate.split("-").reverse().join("-")
                                : null,
                            expiry_date:
                                item.endDate && item.endDate !== "Lifetime"
                                    ? item.endDate.split("-").reverse().join("-")
                                    : null,
                        })),

                        experience: cleaned.experience.map((item) => ({
                            ...item,
                            currently_working:
                                item.endDate === "Present",
                        })),

                        projects: cleaned.projects.map((project) => ({
                            ...project,
                            link: safeLink(project.link),
                            technologies_used: Array.isArray(project.stack)
                                ? project.stack.join(", ")
                                : project.stack,
                        })),

                        achievements: cleaned.achievements,
                    }),
                }
            );

            const data = await response.json();

            console.log("Resume API:", data);

            if (!response.ok || !data.success) {
                notify(data.message || "Resume could not be saved.", "error");
                return;
            }

            notify("Resume saved successfully!", "success");
        } catch (error) {
            console.error("Save Resume Error:", error);
            notify("Something went wrong while saving the resume.", "error");
        } finally {
            setSavingResume(false);
        }
    };

    const [commentsMap, setCommentsMap] = useState({});
    const [commentText, setCommentText] = useState("");
    const commentInputRef = useRef(null);


    const MSG_API = `${API_PHP}/messages.php`;
    const [threads, setThreads] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageDraft, setMessageDraft] = useState("");

    const readKey = `candNotifRead_${loggedInUser.id || "x"}`;
    const [readIds, setReadIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem(readKey) || "[]"); } catch { return []; }
    });

    const ago = (d) => {
        if (!d) return "";
        const mins = Math.floor((Date.now() - new Date(String(d).replace(" ", "T")).getTime()) / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins} min ago`;
        if (mins < 1440) return `${Math.floor(mins / 60)} hour(s) ago`;
        if (mins < 43200) return `${Math.floor(mins / 1440)} day(s) ago`;
        return `${Math.floor(mins / 43200)} month(s) ago`;
    };

    const notifications = useMemo(() => {
        const list = [];
        applications.forEach((a) => {
            const company = a.company_name || "the company";
            list.push({
                id: `a${a.id}-applied`, type: "application", title: "Application submitted",
                desc: `You applied for ${a.job_title} at ${company}`, at: a.applied_at,
            });
            if (a.status && a.status !== "Applied") {
                list.push({
                    id: `a${a.id}-${a.status}`, type: "application", title: `Application ${a.status}`,
                    desc: `${company} marked your application for ${a.job_title} as ${a.status}`, at: a.updated_at || a.applied_at,
                });
            }
        });
        threads.filter((t) => t.unread > 0).forEach((t) => {
            list.push({
                id: `m${t.application_id}-${t.last_at}`, type: "message", title: "New message",
                desc: `${t.company_name} sent you a message`, at: t.last_at,
            });
        });
        return list
            .sort((x, y) => String(y.at).localeCompare(String(x.at)))
            .map((n) => ({ ...n, time: ago(n.at), unread: !readIds.includes(n.id) }));
    }, [applications, threads, readIds]);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const loadThreads = () =>
        fetch(`${MSG_API}?action=threads`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => {
                if (d.success) {
                    setThreads(d.threads);
                    setActiveConversation((cur) => cur ?? (d.threads[0] ? d.threads[0].application_id : null));
                }
            })
            .catch(() => { });

    useEffect(() => {
        loadThreads();
        const t = setInterval(loadThreads, 15000);
        return () => clearInterval(t);
    }, []);

    const loadChat = (id) =>
        fetch(`${MSG_API}?action=messages&application_id=${id}`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => d.success && setChatMessages(d.messages))
            .catch(() => { });

    useEffect(() => {
        if (!activeConversation) return;
        loadChat(activeConversation);
        const t = setInterval(() => loadChat(activeConversation), 5000);
        return () => clearInterval(t);
    }, [activeConversation]);

    const activeThread = threads.find((t) => t.application_id === activeConversation);

    const profilePct = (() => {
        const p = resumeData.personal;
        const checks = [
            p.contact,
            p.headline,
            p.intro,
            p.dob,
            resumeData.address.current.city,
            resumeData.skills.length > 0,
            resumeData.education.some((e) => e.degree),
            resumeData.experience.some((e) => e.role || e.company),
            resumeData.projects.some((p) => p.title),
            resumeData.courses.some((c) => c.title),
            resumeData.achievements.some((a) => a.title),
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    })();

    const toggleLike = async (id) => {
        try {
            const d = await socialPost({ action: "toggle_like", job_id: String(id) });
            if (!d.success) {
                notify(d.message || "Could not update like", "error");
                return;
            }
            setLiked((prev) =>
                d.liked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)
            );
            setLikeCounts((prev) => ({ ...prev, [id]: d.likes }));
        } catch {
            notify("Something went wrong while liking.", "error");
        }
    };

    const toggleSave = async (id) => {
        try {
            const isSaved = saved.includes(id);

            const formData = new FormData();
            formData.append("action", isSaved ? "unsave" : "save");
            formData.append("job_id", id);

            const response = await fetch(
                `${API_PHP}/saved_jobs.php`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );

            const data = await response.json();

            console.log("Save Job API:", data);

            if (!data.success) {
                notify(data.message || "Could not update saved job", "error");
                return;
            }

            setSaved((prev) =>
                isSaved
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
            );

        } catch (error) {
            console.error("Save Job Error:", error);
            notify("Something went wrong while saving the job.", "error");
        }
    };
    const shareJob = async (job) => {
        const shareText = `${job.title} at ${job.company}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: shareText,
                    text: job.summary,
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                notify("Job details copied!", "success");
            }
        } catch (error) {
            console.log("Share cancelled");
        }
    };

    const handleApplyJob = async (job, screeningAnswers = []) => {
        try {
            const formData = new FormData();

            formData.append("action", "apply");
            formData.append("job_id", job.id);
            formData.append("screening_answers", JSON.stringify(screeningAnswers));

            const response = await fetch(
                `${API_PHP}/applications.php`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!data.success) {
                notify(data.message || "Could not apply for this job", "error");
                return false;
            }

            notify("Application submitted successfully!", "success");
            return true;
        } catch (error) {
            console.error("Apply Error:", error);
            notify("Something went wrong while applying.", "error");
            return false;
        }
    };

    const startApply = (job) => {
        if (job.screening && job.screening.length > 0) {
            setAnswers({});
            setApplyJob(job);
        } else {
            handleApplyJob(job);
        }
    };

    const submitScreening = async () => {
        const qs = applyJob.screening;
        for (let i = 0; i < qs.length; i++) {
            if (qs[i].required && !String(answers[i] || "").trim()) {
                notify(`Please answer question ${i + 1}`, "error");
                return;
            }
        }
        const payload = qs.map((q, i) => ({
            question: q.question,
            type: q.type,
            answer: answers[i] || "",
        }));
        const ok = await handleApplyJob(applyJob, payload);
        if (ok) {
            setApplyJob(null);
            setAnswers({});
        }
    };

    // Card ke comment icon se ab poora side panel nahi, ek chhota
    // modern quick-comment popup turant khulta hai
    const loadJobComments = (jobId) =>
        fetch(`${SOCIAL_API}?action=comments&job_id=${jobId}`, { credentials: "include" })
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setCommentsMap((prev) => ({ ...prev, [jobId]: d.comments }));
            })
            .catch(() => { });

    const openCommentsFor = (job) => {
        setQuickCommentJob(job);
        setCommentText("");
        loadJobComments(job.id);
    };

    useEffect(() => {
        if (selectedJob) loadJobComments(selectedJob.id);
    }, [selectedJob]);

    const addComment = async (jobId) => {
        const text = commentText.trim();
        if (!text) return;
        try {
            const d = await socialPost({ action: "comment", job_id: String(jobId), body: text });
            if (!d.success) {
                notify(d.message || "Comment could not be added", "error");
                return;
            }
            setCommentText("");
            setCommentsMap((prev) => ({ ...prev, [jobId]: [...(prev[jobId] || []), d.comment] }));
            setCommentCounts((prev) => ({ ...prev, [jobId]: (prev[jobId] || 0) + 1 }));
        } catch {
            notify("Something went wrong while commenting.", "error");
        }
    };

    const commentCount = (job) => commentCounts[job.id] ?? 0;
    const likeCount = (job) => likeCounts[job.id] ?? 0;

    const markAllRead = () => {
        const ids = [...new Set([...readIds, ...notifications.map((n) => n.id)])];
        setReadIds(ids);
        try { localStorage.setItem(readKey, JSON.stringify(ids)); } catch { }
    };

    const sendMessage = async () => {
        const text = messageDraft.trim();
        if (!text || !activeConversation) return;
        const fd = new FormData();
        fd.append("action", "send");
        fd.append("application_id", activeConversation);
        fd.append("body", text);
        try {
            const r = await fetch(MSG_API, { method: "POST", body: fd, credentials: "include" });
            const d = await r.json();
            if (!d.success) { alert(d.message || "Message nahi gaya"); return; }
            setMessageDraft("");
            loadChat(activeConversation);
            loadThreads();
        } catch {
            alert("Server se connect nahi ho paya");
        }
    };


    const matchesSearch = (job) => {
        const value = search.toLowerCase();

        return (
            job.title.toLowerCase().includes(value) ||
            job.company.toLowerCase().includes(value) ||
            job.location.toLowerCase().includes(value)
        );
    };

    const dashboardJobs = allJobs.filter(matchesSearch).slice(0, 6);

    const findJobs = allJobs.filter(
        (job) =>
            matchesSearch(job) &&
            (categoryFilter === "All" || job.category === categoryFilter)
    );

    // Sidebar / account panel ke options ab HAMESHA naye browser tab mein khulte hain
    const handleMenu = (id) => {
        setMobileMenu(false);
        setProfileOpen(false);

        const path =
            id === "dashboard"
                ? "/candidate-dashboard"
                : `/candidate-dashboard/${id}`;

        window.open(path, "_blank", "noopener,noreferrer");
    };
    const stats = applicationStats(applications);

    const pageTitles = {
        dashboard: "Find your next opportunity.",
        find: "Find Jobs",
        saved: "Saved Jobs",
        applications: "My Applications",
        suggestions: "Job Suggestions",
        companies: "Companies",
        notifications: "Notifications",
        messages: "Messages",
        settings: "Settings",
        profile: "My Profile",
    };

    // ---------- Resume Edit Modal (generic form for every resume section) ----------
    // editModal = null OR { section, mode: "edit" | "add", index, values }
    const [editModal, setEditModal] = useState(null);
    // Per-item inline edit toggle for list sections
    // (education, courses, experience, projects, achievements)
    const [editingItems, setEditingItems] = useState({});
    useEffect(() => {
        if (!resumeLoaded) return;
        const empty = PAD_SECTIONS.filter((s) => (resumeData[s] || []).length === 0);
        if (!empty.length) return;

        setResumeData((prev) => {
            const next = { ...prev };
            empty.forEach((s) => {
                if ((next[s] || []).length === 0) next[s] = [makeBlank(s)];
            });
            return next;
        });
        setEditingItems((prev) => {
            const n = { ...prev };
            empty.forEach((s) => { n[`${s}_0`] = true; });
            return n;
        });
    }, [
        resumeLoaded,
        resumeData.education.length,
        resumeData.courses.length,
        resumeData.experience.length,
        resumeData.projects.length,
        resumeData.achievements.length,
        resumeData.links.length,
    ]);

    const isItemEditing = (section, index) => !!editingItems[`${section}_${index}`];

    const toggleItemEditing = (section, index) => {
        setEditingItems((prev) => ({ ...prev, [`${section}_${index}`]: !prev[`${section}_${index}`] }));
    };

    const updateListItemField = (section, index, key, value) => {
        setResumeData((prev) => {
            const list = [...prev[section]];
            list[index] = { ...list[index], [key]: value };
            return { ...prev, [section]: list };
        });
    };

    // Naya blank entry seedha card ke andar add hota hai, turant editing mode mein khul jata hai
    const addNewItem = (section) => {
        const nextIndex = resumeData[section].length;
        setResumeData((prev) => ({
            ...prev,
            [section]: [...prev[section], { ...BLANK_TEMPLATES[section], id: Date.now().toString() }],
        }));
        setEditingItems((prev) => ({ ...prev, [`${section}_${nextIndex}`]: true }));
    };

    // Field definitions per section - drives what the modal form shows.
    // type: "text" | "textarea" | "select" | "arrayText" (comma separated list stored as array)
    const FIELD_CONFIGS = {
        personal: [
            { key: "name", label: "Full Name", type: "text" },
            { key: "email", label: "Email", type: "text" },
            { key: "contact", label: "Phone Number", type: "text" },
            { key: "whatsapp", label: "WhatsApp Number", type: "text" },
            { key: "mother", label: "Mother's Name", type: "text" },
            { key: "father", label: "Father's Name", type: "text" },
            { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { key: "dob", label: "DOB (DD-MM-YYYY)", type: "text" },
            { key: "intro", label: "Short Introduction", type: "textarea" },
        ],
        addressPermanent: [
            { key: "line1", label: "Address Line", type: "textarea" },
            { key: "city", label: "City", type: "text" },
            { key: "state", label: "State", type: "text" },
            { key: "country", label: "Country", type: "text" },
            { key: "pincode", label: "Pincode", type: "text" },
        ],
        addressCurrent: [
            { key: "line1", label: "Address Line", type: "textarea" },
            { key: "city", label: "City", type: "text" },
            { key: "state", label: "State", type: "text" },
            { key: "country", label: "Country", type: "text" },
            { key: "pincode", label: "Pincode", type: "text" },
        ],
        education: [
            { key: "degree", label: "Degree", type: "text" },
            { key: "board", label: "Board / University", type: "text" },
            { key: "industry", label: "Industry", type: "text" },
            { key: "sector", label: "Sector", type: "text" },
            { key: "percentage", label: "Percentage / CGPA", type: "text" },
            { key: "courseType", label: "Course Type", type: "text" },
            { key: "type", label: "Mode", type: "select", options: ["Full Time", "Part Time", "Distance"] },
            { key: "startDate", label: "Start Date (MM-YYYY)", type: "text" },
            { key: "endDate", label: "End Date (MM-YYYY)", type: "text" },
            { key: "city", label: "City", type: "text" },
            { key: "state", label: "State", type: "text" },
            { key: "country", label: "Country", type: "text" },
            { key: "pincode", label: "Pincode", type: "text" },
        ],
        courses: [
            { key: "title", label: "Course Title", type: "text" },
            { key: "institute", label: "Institute", type: "text" },
            { key: "certNumber", label: "Certification Number", type: "text" },
            { key: "link", label: "Certificate Link", type: "text" },
            { key: "startDate", label: "Start Date (DD-MM-YYYY)", type: "text" },
            { key: "endDate", label: "End Date (DD-MM-YYYY)", type: "text" },
            { key: "validTill", label: "Valid Till", type: "text" },
            { key: "details", label: "Details", type: "textarea" },
            { key: "skillsLearned", label: "Skills Learned (comma separated)", type: "arrayText" },

        ],
        experience: [
            { key: "role", label: "Role / Designation", type: "text" },
            { key: "company", label: "Company", type: "text" },
            { key: "type", label: "Type", type: "select", options: ["Full Time", "Internship", "Part Time", "Freelance"] },
            { key: "location", label: "Location", type: "text" },
            { key: "startDate", label: "Start Date (MM-YYYY)", type: "text" },
            { key: "endDate", label: "End Date (MM-YYYY or Present)", type: "text" },
            { key: "description", label: "Description", type: "textarea" },

        ],
        projects: [
            { key: "title", label: "Project Title", type: "text" },
            { key: "stack", label: "Tech Stack (comma separated)", type: "arrayText" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "link", label: "Project Link", type: "text" },

        ],
        achievements: [
            { key: "title", label: "Achievement Title", type: "text" },
            { key: "desc", label: "Description", type: "textarea" },

        ],
        skills: [
            { key: "value", label: "Skill Name", type: "text" },
        ],
    };


    // Convert a stored item into modal-friendly values (arrays -> comma string for arrayText fields)
    const toModalValues = (section, item) => {
        const fields = FIELD_CONFIGS[section] || [];
        const values = { ...item };
        fields.forEach((f) => {
            if (f.type === "arrayText") {
                values[f.key] = Array.isArray(item[f.key]) ? item[f.key].join(", ") : (item[f.key] || "");
            }
        });
        return values;
    };

    // Convert modal values back into the real data shape (comma string -> array for arrayText fields)
    const fromModalValues = (section, values) => {
        const fields = FIELD_CONFIGS[section] || [];
        const item = { ...values };
        fields.forEach((f) => {
            if (f.type === "arrayText") {
                item[f.key] = String(values[f.key] || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        });
        return item;
    };

    // Open modal to EDIT an existing item. index is null for singular sections (personal, address).
    const openEditModal = (section, index = null) => {
        let sourceItem;
        if (section === "personal") sourceItem = resumeData.personal;
        else if (section === "addressPermanent") sourceItem = resumeData.address.permanent;
        else if (section === "addressCurrent") sourceItem = resumeData.address.current;
        else if (section === "skills") sourceItem = { value: resumeData.skills[index] };
        else sourceItem = resumeData[section][index];

        setEditModal({
            section,
            mode: "edit",
            index,
            values: toModalValues(section, sourceItem),
        });
    };

    // Open modal to ADD a new item (array sections only)
    const openAddModal = (section) => {
        setEditModal({
            section,
            mode: "add",
            index: null,
            values: toModalValues(section, BLANK_TEMPLATES[section]),
        });
    };

    const closeEditModal = () => setEditModal(null);

    const updateModalField = (key, value) => {
        setEditModal((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }));
    };

    const saveEditModal = () => {
        if (!editModal) return;
        const { section, mode, index, values } = editModal;
        const finalItem = fromModalValues(section, values);

        if (section === "personal") {
            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, ...finalItem } }));
        } else if (section === "addressPermanent") {
            setResumeData((prev) => ({ ...prev, address: { ...prev.address, permanent: { ...prev.address.permanent, ...finalItem } } }));
        } else if (section === "addressCurrent") {
            setResumeData((prev) => ({ ...prev, address: { ...prev.address, current: { ...prev.address.current, ...finalItem } } }));
        } else if (section === "skills") {
            setResumeData((prev) => {
                const updated = [...prev.skills];
                if (mode === "add") {
                    updated.push(finalItem.value);
                } else {
                    updated[index] = finalItem.value;
                }
                return { ...prev, skills: updated };
            });
        } else {
            // array sections: education, courses, experience, projects, achievements
            setResumeData((prev) => {
                const list = [...prev[section]];
                if (mode === "add") {
                    list.push({ ...finalItem, id: Date.now().toString() });
                } else {
                    list[index] = { ...list[index], ...finalItem };
                }
                return { ...prev, [section]: list };
            });
        }

        closeEditModal();
    };

    // Remove an item from an array section (education, courses, experience, projects, achievements, skills)
    const removeListItem = (section, index) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    };
    const clearItemDetails = (section, index) => {
        removeListItem(section, index);
        setEditingItems({});
    };
    const uploadAttachment = async (section, listName, index, file) => {
        const item = resumeData[listName][index];
        if ((item.attachments || []).length >= 5) {
            notify("Maximum 5 files allowed per card", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            notify("File 5 MB se badi hai", "error");
            return;
        }
        if (!/\.(jpe?g|png|webp|pdf)$/i.test(file.name)) {
            notify("Sirf JPG, PNG, WEBP ya PDF allowed hai", "error");
            return;
        }

        const fd = new FormData();
        fd.append("section", section);
        fd.append("file", file);

        try {
            const res = await fetch(`${API_LARAVEL}/resume/attachments`, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/json" },
                body: fd,
            });
            const d = await res.json();
            if (!res.ok || !d.success) {
                notify(d.message || "Upload failed", "error");
                return;
            }
            setResumeData((prev) => {
                const list = [...prev[listName]];
                list[index] = { ...list[index], attachments: [...(list[index].attachments || []), d.attachment] };
                return { ...prev, [listName]: list };
            });
            notify("File uploaded. Save Resume dabana mat bhoolna.", "success");
        } catch {
            notify("Upload failed. Server se connect nahi ho paya.", "error");
        }
    };

    const removeAttachment = async (listName, index, att) => {
        try {
            const res = await fetch(`${API_LARAVEL}/resume/attachments/${att.id}`, {
                method: "DELETE",
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            const d = await res.json();
            if (!res.ok || !d.success) {
                notify(d.message || "Could not delete file", "error");
                return;
            }
            setResumeData((prev) => {
                const list = [...prev[listName]];
                list[index] = {
                    ...list[index],
                    attachments: (list[index].attachments || []).filter((x) => x.id !== att.id),
                };
                return { ...prev, [listName]: list };
            });
        } catch {
            notify("Could not delete file", "error");
        }
    };
    const uploadPhoto = async (file) => {
        if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
            notify("Only JPG, JPEG, PNG or WEBP photos are allowed.", "error");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            notify("Photo must be 2 MB or smaller.", "error");
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl); // instant preview
        setPhotoBusy(true);

        try {
            const fd = new FormData();
            fd.append("photo", file); // no Content-Type header: the browser sets the boundary

            const res = await fetch(`${API_LARAVEL}/resume/photo`, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/json" },
                body: fd,
            });
            const d = await res.json().catch(() => ({}));

            if (!res.ok || !d.success) {
                notify(d.message || "Photo upload failed.", "error");
                return;
            }

            setResumeData((prev) => ({
                ...prev,
                personal: { ...prev.personal, photo: d.profile_photo_url },
            }));
            notify("Profile photo updated!", "success");
        } catch {
            notify("Upload failed. Could not reach the server.", "error");
        } finally {
            setPhotoPreview("");
            URL.revokeObjectURL(previewUrl);
            setPhotoBusy(false);
        }
    };

    const removePhoto = async () => {
        setPhotoBusy(true);
        try {
            const res = await fetch(`${API_LARAVEL}/resume/photo`, {
                method: "DELETE",
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            const d = await res.json().catch(() => ({}));

            if (!res.ok || !d.success) {
                notify(d.message || "Could not remove photo.", "error");
                return;
            }

            setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, photo: "" } }));
            notify("Profile photo removed.", "success");
        } catch {
            notify("Could not remove photo.", "error");
        } finally {
            setPhotoBusy(false);
        }
    };

    // Update a field inside address.permanent or address.current (used by the inline Address form)
    const updateAddressField = (type, field, value) => {
        setResumeData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [type]: { ...prev.address[type], [field]: value },
            },
        }));
    };

    const SECTION_TITLES = {
        education: "Education",
        courses: "Course / Certification",
        experience: "Work Experience",
        projects: "Project",
        achievements: "Achievement",
        skills: "Skill",
        personal: "Personal Information",
        addressPermanent: "Permanent Address",
        addressCurrent: "Current Address",
    };

    const renderJobCard = (job) => (
        <article
            className="big-job-card"
            key={job.id}
            onClick={() => setSelectedJob(job)}
        >
            <div className="big-card-glow" style={{ background: job.color }}></div>

            <div className="big-job-top">
                <div
                    className="big-company-logo"
                    style={{
                        background: `linear-gradient(135deg, ${job.color}, ${job.color}99)`,
                    }}
                >
                    {job.logo}
                </div>

                <div className="big-company-info">
                    <div className="company-name-row">
                        <h3>{job.company}</h3>
                        <span className="verified-mark">✓</span>
                    </div>

                    <span>{job.open || "Multiple openings"}</span>
                </div>

                <button
                    className={`big-save-btn ${saved.includes(job.id) ? "saved" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(job.id);
                    }}
                >
                    <Icon name="bookmark" size={20} />
                </button>
            </div>

            <div className="big-job-main">
                <div className="big-title-row">
                    <div>
                        <h2>{job.title}</h2>
                        <span className="big-posted">{job.posted}</span>
                    </div>

                    <span className="open-badge">{job.type || "Open"}</span>
                </div>

                <p className="big-job-summary">{job.summary}</p>

                <div className="big-job-meta">
                    <span>
                        <Icon name="location" size={16} />
                        {job.location}
                    </span>

                    <span>
                        <Icon name="salary" size={16} />
                        {job.salary}
                    </span>

                    <span>
                        <Icon name="calendar" size={16} />
                        {job.posted}
                    </span>
                </div>

                <div className="big-job-tags">
                    {job.skills?.map((skill) => (
                        <span key={skill}>{skill}</span>
                    ))}
                </div>
            </div>

            <div className="big-card-bottom">
                <div className="big-social">
                    <button
                        className={liked.includes(job.id) ? "liked" : ""}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(job.id);
                        }}
                    >
                        <Icon name="heart" size={20} />
                        <span>
                            {likeCount(job)}
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openCommentsFor(job);
                        }}
                    >
                        <Icon name="comment" size={20} />
                        <span>{commentCount(job)}</span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            shareJob(job);
                        }}
                    >
                        <Icon name="share" size={19} />
                    </button>
                </div>

                <button
                    className="big-view-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                    }}
                >
                    View Job
                    <Icon name="arrow" size={16} />
                </button>
            </div>
        </article>
    );

    return (
        <div className={`candidate-app ${darkMode ? "dark" : ""}`}>

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
                                            placeholder="Search jobs, companies or skills..."
                                        />
                                    </div>

                                    <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.7 }}>
                                        Filter by category
                                    </p>

                                    <div className="filter-chips" style={{ margin: 0 }}>
                                        {jobCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                className={`chip ${categoryFilter === cat ? "active" : ""}`}
                                                onClick={() => {
                                                    setCategoryFilter(cat);
                                                    if (active !== "find") setActive("find");
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="all-notifications"
                                        style={{ marginTop: 12 }}
                                        onClick={() => {
                                            setToolsOpen(false);
                                            setActive("find");
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
                        <div className="profile-avatar">{avatarContent}</div>

                        <div className="top-profile-text">
                            <strong>{candidateName}</strong>
                            <span>{candidateRole}</span>
                        </div>

                        <span className="profile-arrow">⌄</span>
                    </button>

                </div>
            </header>

            <div className="candidate-layout">

                {/* SIDEBAR */}
                <aside
                    className={`candidate-sidebar ${mobileMenu ? "mobile-open" : ""
                        }`}
                >

                    <div className="sidebar-profile">
                        <div className="large-avatar">{avatarContent}</div>

                        <div>
                            <h3>{candidateName}</h3>
                            <p>{candidateRole}</p>
                        </div>

                        <span className="online-dot"></span>
                    </div>

                    <div className="profile-progress">

                        <div className="progress-top">
                            <span>Profile completeness</span>
                            <b>{profilePct}%</b>
                        </div>

                        <div className="progress-line" style={{ width: "100%", overflow: "hidden" }}>
                            <span
                                style={{
                                    display: "block",
                                    height: "100%",
                                    width: `${profilePct}%`,
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

                                <p className="menu-title">
                                    {group.title}
                                </p>

                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`side-item ${active === item.id
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            handleMenu(item.id)
                                        }
                                    >

                                        <span className="side-icon">
                                            <Icon
                                                name={item.icon}
                                                size={21}
                                            />
                                        </span>

                                        <span className="side-label">
                                            {item.label}
                                        </span>

                                        {(item.id === "applications" ? applications.length : item.id === "notifications" ? unreadCount : 0) ? (
                                            <span className="side-count">
                                                {item.id === "applications" ? applications.length : unreadCount}
                                            </span>
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

                </aside >

                {
                    mobileMenu && (
                        <div
                            className="sidebar-overlay"
                            onClick={() => setMobileMenu(false)}
                        ></div>
                    )
                }

                {/* MAIN */}
                <main className="candidate-main">

                    <div className="page-heading">

                        <div>
                            <span className="welcome-text">
                                WELCOME BACK, {firstName.toUpperCase()}
                            </span>

                            <h1>{pageTitles[active] || "My Profile"}</h1>

                            <p>
                                Discover opportunities that match your
                                skills and career goals.
                            </p>
                        </div>

                        {active === "dashboard" && (
                            <button
                                className="edit-profile-btn"
                                onClick={() => setProfileOpen(true)}
                            >
                                <Icon name="user" size={18} />
                                View Profile
                            </button>
                        )}

                    </div>

                    {/* DASHBOARD */}
                    {active === "dashboard" ? (
                        <DashboardHomeSection
                            applications={applications}
                            dashboardJobs={dashboardJobs}
                            jobsLoading={jobsLoading}
                            profilePct={profilePct}
                            renderJobCard={renderJobCard}
                            saved={saved}
                            setActive={setActive}
                        />
                    ) : active === "find" ? (

                        <FindJobsSection
                            categoryFilter={categoryFilter}
                            findJobs={findJobs}
                            jobCategories={jobCategories}
                            jobsLoading={jobsLoading}
                            renderJobCard={renderJobCard}
                            setCategoryFilter={setCategoryFilter}
                        />

                    ) : active === "saved" ? (

                        <SavedJobsSection
                            allJobs={allJobs}
                            renderJobCard={renderJobCard}
                            saved={saved}
                            setActive={setActive}
                        />

                    ) : active === "applications" ? (

                        <ApplicationsSection
                            APP_COLORS={APP_COLORS}
                            appFilter={appFilter}
                            applications={applications}
                            appsLoading={appsLoading}
                            setAppFilter={setAppFilter}
                        />

                    ) : active === "suggestions" ? (

                        <SuggestionsSection
                            allJobs={allJobs}
                            renderJobCard={renderJobCard}
                        />

                    ) : active === "companies" ? (

                        <CompaniesSection
                            companiesList={companiesList}
                            setActive={setActive}
                            setCategoryFilter={setCategoryFilter}
                            setSearch={setSearch}
                        />

                    ) : active === "notifications" ? (

                        <NotificationsSection
                            markAllRead={markAllRead}
                            notifications={notifications}
                        />

                    ) : active === "messages" ? (

                        <MessagesSection
                            activeConversation={activeConversation}
                            activeThread={activeThread}
                            APP_COLORS={APP_COLORS}
                            chatMessages={chatMessages}
                            messageDraft={messageDraft}
                            sendMessage={sendMessage}
                            setActiveConversation={setActiveConversation}
                            setMessageDraft={setMessageDraft}
                            threads={threads}
                        />

                    ) : active === "profile" ? (

                        <ProfileSection
                            addNewItem={addNewItem}
                            addressCurrEditing={addressCurrEditing}
                            addressPermEditing={addressPermEditing}
                            addSkill={addSkill}
                            avatarContent={avatarContent}
                            candidateRole={candidateRole}
                            cleanedResume={cleanedResume}
                            clearItemDetails={clearItemDetails}
                            handleSaveResume={handleSaveResume}
                            isItemEditing={isItemEditing}
                            personalEditing={personalEditing}
                            photoBusy={photoBusy}
                            photoInputRef={photoInputRef}
                            removeAttachment={removeAttachment}
                            removeListItem={removeListItem}
                            removePhoto={removePhoto}
                            resumeData={resumeData}
                            resumeTab={resumeTab}
                            savingResume={savingResume}
                            setAddressCurrEditing={setAddressCurrEditing}
                            setAddressPermEditing={setAddressPermEditing}
                            setPersonalEditing={setPersonalEditing}
                            setResumeData={setResumeData}
                            setResumeTab={setResumeTab}
                            setSkillInput={setSkillInput}
                            shownPhoto={shownPhoto}
                            skillInput={skillInput}
                            skillSuggestions={skillSuggestions}
                            toggleItemEditing={toggleItemEditing}
                            updateAddressField={updateAddressField}
                            updateListItemField={updateListItemField}
                            uploadAttachment={uploadAttachment}
                            uploadPhoto={uploadPhoto}
                        />

                    ) : (

                        <section className="content-panel">

                            <div className="big-panel-icon blue-bg">
                                <Icon name="settings" size={35} />
                            </div>

                            <h2>Settings</h2>

                            <p>
                                Manage your account preferences, notifications
                                and privacy settings here.
                            </p>

                            <button
                                className="primary-btn"
                                onClick={() => setActive("dashboard")}
                            >
                                Back to Dashboard
                            </button>

                        </section>
                    )}

                </main>
            </div >

            {/* JOB PROFILE SIDE PANEL */}
            {
                selectedJob && (
                    <div
                        className="profile-modal-overlay"
                        onClick={() => setSelectedJob(null)}
                    >

                        <div
                            className="job-profile-panel"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <button
                                className="panel-close"
                                onClick={() => setSelectedJob(null)}
                            >
                                <Icon name="close" size={23} />
                            </button>

                            <div
                                className="panel-cover"
                                style={{
                                    background: `linear-gradient(135deg, ${selectedJob.color}, #111827)`,
                                }}
                            >

                                <div
                                    className="panel-company-logo"
                                    style={{
                                        background: selectedJob.color,
                                    }}
                                >
                                    {selectedJob.logo}
                                </div>

                            </div>

                            <div className="panel-content">

                                <div className="panel-title">

                                    <div>
                                        <span className="verified-company">
                                            ✓ Verified
                                        </span>

                                        <h2>
                                            {selectedJob.title}
                                        </h2>

                                        <h3>
                                            {selectedJob.company}
                                        </h3>
                                    </div>

                                    <button
                                        className={`panel-save ${saved.includes(selectedJob.id)
                                            ? "saved"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            toggleSave(selectedJob.id)
                                        }
                                    >
                                        <Icon
                                            name="bookmark"
                                            size={27}
                                        />
                                    </button>

                                </div>

                                <div className="panel-meta">

                                    <span>
                                        <Icon
                                            name="location"
                                            size={18}
                                        />
                                        {selectedJob.location}
                                    </span>

                                    <span>
                                        <Icon
                                            name="salary"
                                            size={18}
                                        />
                                        {selectedJob.salary}
                                    </span>

                                    <span>
                                        <Icon
                                            name="calendar"
                                            size={18}
                                        />
                                        {selectedJob.posted}
                                    </span>

                                </div>

                                <div className="panel-info-grid">
                                    <div>
                                        <small>Job Type</small>
                                        <strong>{selectedJob.type}</strong>
                                    </div>
                                    <div>
                                        <small>Openings</small>
                                        <strong>{selectedJob.open || "Multiple"}</strong>
                                    </div>
                                    <div>
                                        <small>Category</small>
                                        <strong>{selectedJob.category || "General"}</strong>
                                    </div>
                                </div>

                                <div className="panel-actions">

                                    <button
                                        className={`large-social ${liked.includes(selectedJob.id)
                                            ? "liked"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            toggleLike(selectedJob.id)
                                        }
                                    >
                                        <Icon
                                            name="heart"
                                            size={28}
                                        />

                                        <span>
                                            {likeCount(selectedJob)}
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
                                        <Icon
                                            name="comment"
                                            size={28}
                                        />
                                        <span>{commentCount(selectedJob)}</span>
                                        <small>Comments</small>
                                    </button>

                                    <button
                                        className="large-social"
                                        onClick={() =>
                                            shareJob(selectedJob)
                                        }
                                    >
                                        <Icon
                                            name="share"
                                            size={27}
                                        />
                                        <span>Share</span>
                                    </button>

                                </div>

                                <div className="panel-section">

                                    <h3>About this role</h3>

                                    <p>
                                        {selectedJob.summary}
                                    </p>

                                </div>

                                <div className="panel-section">

                                    <h3>Required Skills</h3>

                                    <div className="panel-skills">

                                        {selectedJob.skills.map(
                                            (skill) => (
                                                <span key={skill}>
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                <div className="panel-section comments-section">

                                    <h3>Comments ({commentCount(selectedJob)})</h3>

                                    <div className="comments-list">
                                        {(commentsMap[selectedJob.id] || []).length === 0 && (
                                            <p className="no-comments">
                                                No comments yet. Be the first to comment!
                                            </p>
                                        )}

                                        {(commentsMap[selectedJob.id] || []).map((c, i) => (
                                            <div className="comment-item" key={i}>
                                                <div className="comment-avatar">{(c.user_name || "?").slice(0, 2).toUpperCase()}</div>
                                                <div>
                                                    <strong>{c.user_name}</strong>
                                                    <small> · {c.time_ago}</small>
                                                    <p>{c.body}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="comment-input-row">
                                        <input
                                            ref={commentInputRef}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write a comment..."
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                addComment(selectedJob.id)
                                            }
                                        />

                                        <button
                                            onClick={() => addComment(selectedJob.id)}
                                        >
                                            <Icon name="send" size={18} />
                                        </button>
                                    </div>

                                </div>

                                <button
                                    className="apply-btn"
                                    onClick={() => startApply(selectedJob)}
                                >
                                    Apply for this Job →
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

            {/* QUICK COMMENT POPUP — turant comment karne ke liye */}
            {
                quickCommentJob && (
                    <div
                        className="quick-comment-overlay"
                        onClick={() => setQuickCommentJob(null)}
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
                                            background: `linear-gradient(135deg, ${quickCommentJob.color}, ${quickCommentJob.color}99)`,
                                        }}
                                    >
                                        {quickCommentJob.logo}
                                    </div>

                                    <div>
                                        <strong>{quickCommentJob.title}</strong>
                                        <span>{quickCommentJob.company}</span>
                                    </div>
                                </div>

                                <button
                                    className="quick-comment-close"
                                    onClick={() => setQuickCommentJob(null)}
                                >
                                    <Icon name="close" size={18} />
                                </button>
                            </div>

                            <div className="quick-comment-list">
                                {(commentsMap[quickCommentJob.id] || []).length === 0 && (
                                    <p className="no-comments">
                                        No comments yet. Be the first to comment!
                                    </p>
                                )}

                                {(commentsMap[quickCommentJob.id] || []).map((c, i) => (
                                    <div className="comment-item" key={c.id || i}>
                                        <div className="comment-avatar">
                                            {(c.user_name || "?").slice(0, 2).toUpperCase()}
                                        </div>

                                        <div>
                                            <strong>{c.user_name}</strong>
                                            <small> · {c.time_ago}</small>
                                            <p>{c.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="comment-input-row quick-comment-input">
                                <input
                                    autoFocus
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        addComment(quickCommentJob.id)
                                    }
                                />

                                <button
                                    onClick={() => addComment(quickCommentJob.id)}
                                >
                                    <Icon name="send" size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* PROFILE PANEL */}
            {
                profileOpen && (
                    <div
                        className="profile-modal-overlay"
                        onClick={() => setProfileOpen(false)}
                    >

                        <div
                            className="candidate-profile-panel"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                className="panel-close"
                                onClick={() =>
                                    setProfileOpen(false)
                                }
                            >
                                <Icon name="close" size={23} />
                            </button>

                            <div className="candidate-profile-cover">

                                <div className="profile-photo-big">
                                    {candidateInitials}
                                </div>

                            </div>

                            <div className="candidate-profile-body">

                                <span className="profile-badge">
                                    OPEN TO WORK
                                </span>

                                <h2>{candidateName}</h2>

                                <p className="profile-role">
                                    {candidateRole}
                                </p>

                                <p className="profile-location">
                                    📍 {resumeData.address.current.city}, {resumeData.address.current.state}
                                </p>

                                <div className="profile-stats">

                                    <div>
                                        <strong>{applications.length}</strong>
                                        <span>Applications</span>
                                    </div>

                                    <div>
                                        <strong>{saved.length}</strong>
                                        <span>Saved</span>
                                    </div>

                                    <div>
                                        <strong>{profilePct}%</strong>
                                        <span>Profile</span>
                                    </div>

                                </div>

                                <div className="panel-section">

                                    <h3>About</h3>

                                    <p>{resumeData.personal.intro || "No summary added yet. Go to My Profile to add one."}</p>

                                </div>

                                <div className="panel-section">

                                    <h3>Skills</h3>

                                    <div className="panel-skills">
                                        {resumeData.skills.length === 0 && <p className="no-comments">No skills added yet.</p>}
                                        {resumeData.skills.map((s) => <span key={s}>{s}</span>)}
                                    </div>

                                </div>
                                <button className="apply-btn" onClick={() => downloadResume(cleanedResume(), candidateRole)}>
                                    Download Resume
                                </button>


                            </div>

                        </div>

                    </div>
                )
            }

            {/* RESUME EDIT / ADD FORM MODAL */}
            {
                editModal && (
                    <div className="resume-form-overlay" onClick={closeEditModal}>
                        <div className="resume-form-modal" onClick={(e) => e.stopPropagation()}>

                            <div className="resume-form-head">
                                <div className="resume-form-head-icon">
                                    <Icon name={editModal.mode === "add" ? "plus" : "edit"} size={18} />
                                </div>
                                <div className="resume-form-head-text">
                                    <span>{editModal.mode === "add" ? "Add New" : "Edit"}</span>
                                    <h3>{SECTION_TITLES[editModal.section] || "Details"}</h3>
                                </div>
                                <button
                                    type="button"
                                    className="resume-form-close"
                                    onClick={closeEditModal}
                                >
                                    <Icon name="close" size={20} />
                                </button>
                            </div>

                            <div className="resume-form-body">
                                <div className="resume-form-grid">
                                    {(FIELD_CONFIGS[editModal.section] || []).map((field) => {
                                        const isFull = field.type === "textarea" || field.type === "arrayText";
                                        return (
                                            <div
                                                className={`resume-form-field ${isFull ? "resume-form-field-full" : ""}`}
                                                key={field.key}
                                            >
                                                <label>{field.label}</label>

                                                {field.type === "textarea" && (
                                                    <textarea
                                                        rows={3}
                                                        value={editModal.values[field.key] || ""}
                                                        onChange={(e) => updateModalField(field.key, e.target.value)}
                                                    />
                                                )}

                                                {field.type === "select" && (
                                                    <select
                                                        value={editModal.values[field.key] || field.options[0]}
                                                        onChange={(e) => updateModalField(field.key, e.target.value)}
                                                    >
                                                        {field.options.map((opt) => (
                                                            <option value={opt} key={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                )}

                                                {(field.type === "text" || field.type === "arrayText") && (
                                                    <input
                                                        type="text"
                                                        value={editModal.values[field.key] || ""}
                                                        onChange={(e) => updateModalField(field.key, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="resume-form-footer">
                                <button
                                    type="button"
                                    className="resume-form-cancel"
                                    onClick={closeEditModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="resume-form-save"
                                    onClick={saveEditModal}
                                >
                                    <Icon name="send" size={14} /> Save
                                </button>
                            </div>

                        </div>
                    </div>
                )
            }
            {applyJob && (
                <div className="resume-form-overlay" onClick={() => setApplyJob(null)}>
                    <div className="resume-form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="resume-form-head">
                            <div className="resume-form-head-icon">
                                <Icon name="message" size={18} />
                            </div>
                            <div className="resume-form-head-text">
                                <span>Screening Questions</span>
                                <h3>{applyJob.title} · {applyJob.company}</h3>
                            </div>
                            <button type="button" className="resume-form-close" onClick={() => setApplyJob(null)}>
                                <Icon name="close" size={20} />
                            </button>
                        </div>

                        <div className="resume-form-body">
                            <div style={{ display: "grid", gap: 18 }}>
                                {applyJob.screening.map((q, i) => (
                                    <div className="resume-form-field" key={i}>
                                        <label>
                                            {i + 1}. {q.question} {q.required ? "*" : ""}
                                        </label>

                                        {q.type === "text" && (
                                            <textarea
                                                rows={2}
                                                value={answers[i] || ""}
                                                onChange={(e) => setAnswers((p) => ({ ...p, [i]: e.target.value }))}
                                            />
                                        )}

                                        {q.type === "yesno" && (
                                            <select
                                                value={answers[i] || ""}
                                                onChange={(e) => setAnswers((p) => ({ ...p, [i]: e.target.value }))}
                                            >
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        )}

                                        {q.type === "choice" && (
                                            <select
                                                value={answers[i] || ""}
                                                onChange={(e) => setAnswers((p) => ({ ...p, [i]: e.target.value }))}
                                            >
                                                <option value="">Select</option>
                                                {(q.options || []).map((o) => (
                                                    <option key={o} value={o}>{o}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="resume-form-footer">
                            <button type="button" className="resume-form-cancel" onClick={() => setApplyJob(null)}>
                                Cancel
                            </button>
                            <button type="button" className="resume-form-save" onClick={submitScreening}>
                                <Icon name="send" size={14} /> Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className={`app-toast ${toast.type}`}>{toast.message}</div>}
            <style>{`
                :root {
                    --insta-gradient: linear-gradient(135deg, #f9ce34 0%, #ee2a7b 45%, #6228d7 100%);
                    --insta-gradient-soft: linear-gradient(135deg, rgba(249,206,52,0.15), rgba(238,42,123,0.15), rgba(98,40,215,0.15));
                }

                .resume-block-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                }
                .resume-block-head h3, .resume-block-head h4 {
                    margin: 0;
                }

                /* ---- Edit / Save / Add buttons ---- */
                /* Edit button: dark orange, pink, blue gradient */
.resume-edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: linear-gradient(135deg, #f7971e 0%, #ee2a7b 50%, #6228d7 100%);
    color: #fff;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 6px 14px rgba(238, 42, 123, 0.35);
}
.resume-edit-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(98, 40, 215, 0.45);
}
                    .resume-delete-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1.5px solid rgba(239,68,68,0.35);
    background: rgba(239,68,68,0.08);
    color: #ef4444;
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}
.resume-delete-btn:hover {
    background: #ef4444;
    color: #fff;
}
                .resume-save-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: none;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: #fff;
                    padding: 7px 14px;
                    border-radius: 20px;
                    font-size: 12.5px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(34,197,94,0.35);
                }
                .resume-save-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(34,197,94,0.45);
                }
                .resume-add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    border: none;
                    background: var(--insta-gradient);
                    color: #fff;
                    padding: 9px 18px;
                    border-radius: 22px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    box-shadow: 0 6px 16px rgba(98,40,215,0.3);
                }
                .resume-add-btn:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 10px 22px rgba(98,40,215,0.42);
                }
                .resume-add-btn-center {
                    display: flex;
                    margin: 18px auto 4px;
                    justify-content: center;
                }

                .resume-item-actions {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                /* ---- Personal Info / Address inline forms ---- */
                .resume-inline-form {
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                    flex-wrap: wrap;
                }
                .resume-inline-photo {
                    width: 84px;
                    height: 84px;
                    min-width: 84px;
                    border-radius: 18px;
                    background: var(--insta-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 24px;
                    color: #fff;
                    box-shadow: 0 8px 18px rgba(98,40,215,0.3);
                }
                .resume-inline-fields {
                    flex: 1;
                    min-width: 240px;
                }

                /* Cards ke andar grid ko poori width do */
                 .resume-inline-form > .resume-grid-3 {
                flex: 1 1 100%;
                width: 100%;
                min-width: 0;
                }
                * ---- Personal Info / Address inline forms ---- */
                .resume-inline-form {
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                    flex-wrap: wrap;
                }
                .resume-inline-photo {
                    width: 84px;
                    height: 84px;
                    min-width: 84px;
                    border-radius: 18px;
                    background: var(--insta-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 24px;
                    color: #fff;
                    box-shadow: 0 8px 18px rgba(98,40,215,0.3);
                }
                .resume-inline-fields {
                    flex: 1;
                    min-width: 240px;
                }

                /* Cards ke andar grid ko poori width do */
                 .resume-inline-form > .resume-grid-3 {
                flex: 1 1 100%;
                width: 100%;
                min-width: 0;
                }

/* Projects / Achievements ke edit form ke direct fields bhi full width */
.resume-inline-form > .resume-field-group {
    flex: 1 1 100%;
    width: 100%;
}
                .resume-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 14px;
                }
                @media (max-width: 720px) {
                    .resume-grid-3 { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 480px) {
                    .resume-grid-3 { grid-template-columns: 1fr; }
                }
                .resume-field-full {
                    grid-column: 1 / -1;
                }
                .resume-field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .resume-field-row {
                    display: flex;
                    gap: 14px;
                    flex-wrap: wrap;
                }
                .resume-field-row .resume-field-group { flex: 1; min-width: 140px; }
                .resume-field-group label {
                    font-size: 11.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    opacity: 0.55;
                }
                .resume-field-group input,
                .resume-field-group select,
                .resume-field-group textarea {
                    border: 1.5px solid rgba(120,120,140,0.25);
                    background: rgba(120,120,140,0.05);
                    color: inherit;
                    border-radius: 10px;
                    box-sizing: border-box;
                    width: 100%;
                    padding: 10px 12px;
                    font-size: 13.8px;
                    font-family: inherit;
                    outline: none;
                    resize: vertical;
                    transition: all 0.18s ease;
                }
                .resume-item-card,
                .resume-address-card,
                .resume-project-card {
                    box-sizing: border-box;
                    width: 100%;
                }
                .resume-field-group input:disabled,
                .resume-field-group select:disabled,
                .resume-field-group textarea:disabled {
                    background: rgba(120,120,140,0.04);
                    border-color: rgba(120,120,140,0.22);
                    color: inherit;
                    opacity: 0.85;
                    cursor: default;
                }
                .resume-inline-form.is-editing .resume-field-group input,
                .resume-inline-form.is-editing .resume-field-group select,
                .resume-inline-form.is-editing .resume-field-group textarea,
                .resume-address-form.is-editing .resume-field-group input,
                .resume-address-form.is-editing .resume-field-group select,
                .resume-address-form.is-editing .resume-field-group textarea {
                    border-color: rgba(238,42,123,0.35);
                    background: rgba(238,42,123,0.05);
                }
                .resume-field-group input:focus,
                .resume-field-group select:focus,
                .resume-field-group textarea:focus {
                    border-color: #ee2a7b;
                    background: rgba(238,42,123,0.07);
                    box-shadow: 0 0 0 3px rgba(238,42,123,0.1);
                }
                .resume-address-form h4 {
                    margin: 0;
                }

                /* ---- Skills: tag chips + autocomplete ---- */
                .resume-skill-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .resume-skill-remove {
                    border: none;
                    background: rgba(255,255,255,0.25);
                    color: #fff;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 11px;
                    line-height: 1;
                    padding: 0;
                }
                .resume-skill-remove:hover {
                    background: rgba(255,255,255,0.45);
                }
                .resume-skill-autocomplete {
                    margin-top: 16px;
                    position: relative;
                }
                .resume-skill-add-row {
                    display: flex;
                    gap: 10px;
                }
                .resume-skill-add-row input {
                    flex: 1;
                    border: 1.5px solid rgba(120,120,140,0.25);
                    background: rgba(120,120,140,0.05);
                    color: inherit;
                    border-radius: 24px;
                    padding: 11px 18px;
                    font-size: 13.8px;
                    outline: none;
                    transition: all 0.18s ease;
                }
                .resume-skill-add-row input:focus {
                    border-color: #ee2a7b;
                    background: rgba(238,42,123,0.06);
                }
                .resume-skill-add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: none;
                    background: var(--insta-gradient);
                    color: #fff;
                    padding: 0 20px;
                    border-radius: 24px;
                    font-size: 13.5px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .resume-skill-add-btn:hover {
                    transform: translateY(-1px) scale(1.02);
                    box-shadow: 0 8px 18px rgba(98,40,215,0.35);
                }
                .resume-skill-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 10px;
                }
                .resume-skill-suggestion-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    rgba(238,42,123,0.4);
                    background: rgba(238,42,123,0.06);
                    color: #ee2a7b;
                    padding: 6px 12px;
                    border-radius: 18px;
                    font-size: 12.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .resume-skill-suggestion-chip:hover {
                    background: var(--insta-gradient);
                    color: #fff;
                    border-color: transparent;
                    transform: translateY(-1px);
                }

                .resume-display-name {
                    margin: 0 0 10px;
                }
                .resume-display-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                    font-size: 13.5px;
                    opacity: 0.85;
                    margin-bottom: 10px;
                    align-items: center;
                }
                .resume-display-row span {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .resume-display-intro {
                    font-size: 14px;
                    line-height: 1.6;
                    opacity: 0.85;
                    margin: 10px 0;
                }

                /* ---- Resume Form Modal (Instagram-style modern card) ---- */
                .resume-form-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 15, 25, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999;
                    padding: 20px;
                }
                .resume-form-modal {
                    background: var(--resume-form-bg, #ffffff);
                    color: var(--resume-form-fg, #1a1a1a);
                    width: 100%;
                    max-width: 640px;
                    max-height: 88vh;
                    border-radius: 22px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.4);
                    overflow: hidden;
                    animation: resumeFormPop 0.2s ease-out;
                }
                @keyframes resumeFormPop {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .candidate-app.dark .resume-form-modal {
                    --resume-form-bg: #1c1e2b;
                    --resume-form-fg: #f2f2f7;
                }
                .resume-form-head {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 22px 24px;
                    background: var(--insta-gradient);
                    color: #fff;
                    position: relative;
                }
                .resume-form-head-icon {
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.22);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(4px);
                }
                .resume-form-head-text { flex: 1; }
                .resume-form-head-text span {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    opacity: 0.85;
                }
                .resume-form-head-text h3 {
                    margin: 2px 0 0;
                    font-size: 18px;
                    font-weight: 800;
                }
                .resume-form-close {
                    border: none;
                    background: rgba(255,255,255,0.2);
                    cursor: pointer;
                    color: #fff;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s ease;
                }
                .resume-form-close:hover { background: rgba(255,255,255,0.35); }
                .resume-form-body {
                    padding: 22px 24px;
                    overflow-y: auto;
                }
                .resume-form-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }
                @media (max-width: 640px) {
                    .resume-form-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 420px) {
                    .resume-form-grid { grid-template-columns: 1fr; }
                }
                .resume-form-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .resume-form-field-full {
                    grid-column: 1 / -1;
                }
                .resume-form-field label {
                    font-size: 11.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    opacity: 0.55;
                }
                .resume-form-field input,
                .resume-form-field select,
                .resume-form-field textarea {
                    border: 1.5px solid rgba(120,120,140,0.25);
                    background: rgba(120,120,140,0.05);
                    color: inherit;
                    border-radius: 12px;
                    padding: 11px 13px;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    resize: vertical;
                    transition: all 0.18s ease;
                }
                .resume-form-field input:focus,
                .resume-form-field select:focus,
                .resume-form-field textarea:focus {
                    border-color: #ee2a7b;
                    background: rgba(238,42,123,0.06);
                    box-shadow: 0 0 0 3px rgba(238,42,123,0.1);
                }
                .resume-form-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 18px 24px;
                    border-top: 1px solid rgba(120,120,140,0.15);
                }
                .resume-form-cancel, .resume-form-save {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: none;
                    padding: 11px 22px;
                    border-radius: 24px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.18s ease;
                }
                .resume-form-cancel {
                    background: rgba(120,120,140,0.12);
                    color: inherit;
                }
                .resume-form-cancel:hover {
                    background: rgba(120,120,140,0.2);
                }
                .resume-form-save {
                    background: var(--insta-gradient);
                    color: #fff;
                    box-shadow: 0 8px 20px rgba(98,40,215,0.3);
                }
                .resume-form-save:hover {
                    transform: translateY(-1px) scale(1.02);
                    box-shadow: 0 10px 24px rgba(98,40,215,0.4);
                }
                    .app-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2000;
    padding: 12px 20px;
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
    animation: toastIn 0.25s ease-out;
}
.app-toast.success { background: linear-gradient(135deg, #22c55e, #16a34a); }
.app-toast.error { background: linear-gradient(135deg, #ef4444, #dc2626); }
@keyframes toastIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
    .attach-list { display: flex; flex-wrap: wrap; gap: 10px; }
.attach-empty { font-size: 13px; opacity: 0.55; }
.attach-chip {
    display: inline-flex; align-items: center; gap: 6px;
    border: 1.5px solid rgba(120,120,140,0.25);
    background: rgba(120,120,140,0.06);
    border-radius: 12px; padding: 6px 8px; max-width: 220px;
}
.attach-chip a { display: inline-flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; min-width: 0; }
.attach-chip img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
.attach-pdf {
    width: 36px; height: 36px; border-radius: 8px; background: #ef4444; color: #fff;
    display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;
}
.attach-name { font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.attach-chip button {
    border: none; background: rgba(239,68,68,0.12); color: #ef4444;
    width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 11px; padding: 0;
}
.resume-field-group .attach-add {
    align-self: flex-start; display: inline-flex; align-items: center;
    margin-top: 10px; padding: 8px 16px; border-radius: 20px; cursor: pointer;
    font-size: 12.5px; font-weight: 700; text-transform: none; letter-spacing: 0; opacity: 1;
    color: #fff; background: linear-gradient(135deg, #f7971e 0%, #ee2a7b 50%, #6228d7 100%);
}
    .avatar-img { width:100%; height:100%; object-fit:cover; display:block; border-radius:inherit; }
.resume-cover-avatar, .large-avatar, .profile-avatar, .resume-inline-photo { overflow:hidden; }
.photo-col { display:flex; flex-direction:column; align-items:center; gap:8px; }
.photo-btn {
    border:1.5px solid #5b3df5; color:#5b3df5; background:transparent; cursor:pointer;
    border-radius:20px; padding:6px 14px; font:inherit; font-size:12px; font-weight:700;
}
.photo-btn:hover { background:rgba(91,61,245,.08); }
.photo-btn.danger { border-color:rgba(239,68,68,.4); color:#ef4444; }
.photo-btn:disabled { opacity:.6; cursor:default; }
.photo-avatar-wrap { position:relative; width:96px; height:96px; }
.resume-inline-photo.photo-round { width:96px; height:96px; min-width:96px; border-radius:50%; font-size:28px; }
.photo-camera-btn {
    position:absolute; right:-2px; bottom:-2px; width:32px; height:32px; padding:0;
    border-radius:50%; border:3px solid #fff; cursor:pointer; color:#fff;
    display:flex; align-items:center; justify-content:center;
    background:linear-gradient(135deg,#f7971e 0%,#ee2a7b 50%,#6228d7 100%);
    box-shadow:0 4px 10px rgba(98,40,215,.35);
}
.candidate-app.dark .photo-camera-btn { border-color:#1c1e2b; }
.photo-camera-btn:disabled { opacity:.6; cursor:default; }
.photo-spinner {
    position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.35);
    display:flex; align-items:center; justify-content:center;
}
.photo-spinner::after {
    content:""; width:26px; height:26px; border-radius:50%;
    border:3px solid rgba(255,255,255,.5); border-top-color:#fff;
    animation:photoSpin .7s linear infinite;
}
@keyframes photoSpin { to { transform:rotate(360deg); } }
.photo-hint { font-size:11px; opacity:.6; }
            `}</style>


        </div >
    );
}

export default Candidate;