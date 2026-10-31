import { useContext } from "react";

import { ThemeContext } from "../context/themeStore";

/** const { theme, isDark, setTheme, setDark, toggleTheme } = useTheme(); */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme sirf <ThemeProvider> ke andar use karo");
    return ctx;
}
