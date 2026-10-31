import { API_LOGOUT_URL } from "../config/env";
import { TOKEN_KEY, USER_KEY } from "../config/storageKeys";

export const doLogout = async (navigate) => {
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    if (token) {
      await fetch(API_LOGOUT_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (e) {
    console.error("Logout request failed", e);
  }

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);

  navigate("/");
  window.scrollTo(0, 0);
};
