// Backend ke saare addresses ek hi jagah.
// Deploy ke time project root ki .env file mein VITE_* values daal do (dekho .env.example).
const env = import.meta.env;

/** PHP (XAMPP) backend */
export const PHP_ORIGIN = env.VITE_PHP_ORIGIN || "http://localhost:8080";
export const API_PHP = env.VITE_API_PHP || `${PHP_ORIGIN}/startup-hire-api/routes`;

/** Laravel backend */
export const LARAVEL_ORIGIN = env.VITE_LARAVEL_ORIGIN || "http://localhost:8000";
export const API_LARAVEL = env.VITE_API_LARAVEL || `${LARAVEL_ORIGIN}/api`;
export const API_LOGOUT_URL = env.VITE_API_LOGOUT_URL || "http://127.0.0.1:8000/api/logout";
