import { USER_KEY } from "../config/storageKeys";

/** Login ke baad localStorage mein jo user save hua tha wo wapas deta hai (nahi mila to null). */
export const getStoredUser = () => JSON.parse(localStorage.getItem(USER_KEY) || "null");
