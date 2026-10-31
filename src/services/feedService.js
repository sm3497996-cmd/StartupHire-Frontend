import { API_PHP } from "../config/env";

export const FEED_URL = `${API_PHP}/employer_feed.php`;

export const feedPost = (data) =>
    fetch(FEED_URL, {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams(data),
    }).then((r) => r.json());
/* =========================================================
   DATA
   ========================================================= */
