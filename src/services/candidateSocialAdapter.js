import { api } from "./interactionsService";
import { getStoredUser } from "../utils/storage";

// Employer dashboard ke candidate cards: Laravel API se likes/comments
export const candidateAdapter = {
    likeText: "liked this profile",

    likes: (id) =>
        api(`/interactions/likes/${id}`).then((d) =>
            d.success
                ? d.likes.map((l) => ({
                    user_name: l.employer_name,
                    sub: l.company_name,
                    time_ago: l.time_ago,
                }))
                : []
        ),

    comments: (id) =>
        api(`/interactions/comments/${id}`).then((d) =>
            d.success
                ? d.comments
                    .map((c) => ({
                        id: c.id,
                        parent_id: c.parent_id,
                        user_name: c.employer_name,
                        user_role: "employer",
                        body: c.comment_text,
                        time_ago: c.time_ago,
                    }))
                    .sort((a, b) => a.id - b.id)
                : []
        ),

    post: (id, body, parentId) =>
        api("/interactions/comment", {
            method: "POST",
            body: {
                candidate_id: id,
                comment_text: body,
                ...(parentId ? { parent_id: parentId } : {}),
            },
        }).then((d) =>
            d.success
                ? {
                    id: d.id,
                    parent_id: d.parent_id ?? null,
                    user_name: getStoredUser()?.name || "You",
                    user_role: "employer",
                    body,
                    time_ago: "just now",
                }
                : null
        ),
};