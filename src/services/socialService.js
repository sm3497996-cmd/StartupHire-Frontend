import { API_PHP } from "../config/env";

export const SOCIAL_API = `${API_PHP}/job_social.php`;

export const socialPost = (data) =>
    fetch(SOCIAL_API, {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams(data),
    }).then((r) => r.json());
