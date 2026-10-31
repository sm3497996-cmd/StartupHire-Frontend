import { API_PHP } from "../config/env";

export const USERS_API = `${API_PHP}/users.php`;


/* =========================================================
   StartupHire — Super Admin Panel
   Route:  /admin  and  /admin/:section

   NOTE: Login now goes through the real backend
   (routes/login.php) and only lets in accounts whose
   DATABASE role is "superadmin". The old hardcoded
   ADMIN_EMAIL / ADMIN_PASS demo login has been removed.
   ========================================================= */

export const API_BASE = API_PHP;
