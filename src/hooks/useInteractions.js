import { useCallback, useEffect, useState } from "react";
import { api } from "../services/interactionsService";

/**
 * Employer dashboard ke like / save / comment / report ka poora logic.
 * setToast = Employer component ka toast function.
 */
export default function useInteractions(setToast) {
    const [liked, setLiked] = useState([]);
    const [shortlisted, setShortlisted] = useState([]); // = saved
    const [savedResumes, setSavedResumes] = useState([]);
    const [commentsMap, setCommentsMap] = useState({});
    const [commentText, setCommentText] = useState("");

    const [reportCandidate, setReportCandidate] = useState(null);
    const [reportReason, setReportReason] = useState("");
    const [reportDetails, setReportDetails] = useState("");

    // Dashboard khulte hi pehle ke like / save wapas laao
    useEffect(() => {
        api("/interactions/my-state").then((data) => {
            if (data.success) {
                setLiked(data.liked);
                setShortlisted(data.saved);
            }
        });
    }, []);
    useEffect(() => {
        api("/interactions/saved-resumes").then((data) => {
            if (data.success) setSavedResumes(data.saved);
        });
    }, []);

    const toggleLike = async (id) => {
        const data = await api("/interactions/like/toggle", {
            method: "POST",
            body: { candidate_id: id },
        });
        if (!data.success) return setToast(data.message || "Like save nahi hua");

        setLiked((prev) =>
            data.active ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
        );
    };

    const toggleShortlist = async (id) => {
        const data = await api("/interactions/save/toggle", {
            method: "POST",
            body: { candidate_id: id },
        });
        if (!data.success) return setToast(data.message || "Save nahi hua");

        setShortlisted((prev) =>
            data.active ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
        );
        setToast(data.active ? "Candidate shortlisted" : "Removed from shortlist");
    };

    const toggleSaveResume = async (id) => {
        const data = await api("/interactions/saved-resumes/toggle", {
            method: "POST",
            body: { candidate_id: id },
        });
        if (!data.success) return setToast(data.message || "Resume save nahi hua");

        setSavedResumes((prev) =>
            data.active ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
        );
        setToast(data.active ? "Resume saved" : "Resume removed from saved");
    };

    const loadComments = useCallback(async (candidateId) => {
        const data = await api(`/interactions/comments/${candidateId}`);
        if (data.success) {
            setCommentsMap((prev) => ({ ...prev, [candidateId]: data.comments }));
        }
    }, []);

    const addComment = async (candidateId) => {
        const text = commentText.trim();
        if (!text) return;

        const data = await api("/interactions/comment", {
            method: "POST",
            body: { candidate_id: candidateId, comment_text: text },
        });
        if (!data.success) return setToast(data.message || "Comment save nahi hua");

        setCommentText("");
        loadComments(candidateId);
    };

    const openReport = (c) => {
        setReportCandidate(c);
        setReportReason("");
        setReportDetails("");
    };

    const submitReport = async () => {
        if (!reportReason) return setToast("Please select a reason");

        const data = await api("/interactions/report", {
            method: "POST",
            body: {
                candidate_id: reportCandidate.id,
                reason: reportReason,
                details: reportDetails,
            },
        });

        if (data.success) {
            setToast("Report submit ho gayi. Admin review karega.");
            setReportCandidate(null);
        } else {
            setToast(data.message || "Report submit nahi hui");
        }
    };

    return {
        liked, shortlisted,
        commentsMap, commentText, setCommentText,
        toggleLike, toggleShortlist, loadComments, addComment,
        reportCandidate, setReportCandidate,
        reportReason, setReportReason,
        reportDetails, setReportDetails,
        openReport, submitReport,
        savedResumes, toggleSaveResume,
    };
}