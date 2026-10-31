import { useCallback, useEffect, useMemo, useState } from "react";

import { THEME_KEY } from "../config/storageKeys";
import { ThemeContext } from "./themeStore";

const readSavedTheme = () => {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") return saved;
    } catch {
        /* localStorage band hai to light theme chalega */
    }
    return "light";
};

/**
 * Poori app ka ek hi theme (light / dark).
 *  - <html data-theme="dark|light"> set karta hai  -> naya CSS / Tailwind `dark:` isi se chalta hai
 *  - purane CSS ke hooks (body.candidate-dark, body.sa-dark) bhi saath mein set karta hai
 *  - choice localStorage mein save hoti hai
 */
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(readSavedTheme);
    const isDark = theme === "dark";

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = theme;

        document.body.classList.toggle("candidate-dark", isDark);
        document.body.classList.toggle("sa-dark", isDark);

        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {
            /* ignore */
        }
    }, [theme, isDark]);

    const setTheme = useCallback((t) => setThemeState(t === "dark" ? "dark" : "light"), []);
    const toggleTheme = useCallback(() => setThemeState((p) => (p === "dark" ? "light" : "dark")), []);
    // setDark(true) / setDark(false) / setDark(prev => !prev)  (purane useState jaisa)
    const setDark = useCallback(
        (v) => setThemeState((p) => ((typeof v === "function" ? v(p === "dark") : v) ? "dark" : "light")),
        [],
    );

    const value = useMemo(
        () => ({ theme, isDark, setTheme, setDark, toggleTheme }),
        [theme, isDark, setTheme, setDark, toggleTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
