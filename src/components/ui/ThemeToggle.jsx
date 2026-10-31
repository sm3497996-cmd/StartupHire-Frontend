import { useTheme } from "../../hooks/useTheme";
import { CandidateIcon as Icon } from "./Icon";

/**
 * Light / Dark toggle button (Tailwind + theme tokens).
 * Kisi bhi page mein <ThemeToggle /> daal do, baaki sab ThemeProvider sambhalta hai.
 */
export default function ThemeToggle({ className = "", size = 20 }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light mode" : "Dark mode"}
            className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
        >
            <Icon name={isDark ? "sun" : "moon"} size={size} />
        </button>
    );
}
