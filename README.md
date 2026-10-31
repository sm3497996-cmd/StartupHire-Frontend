# StartupHire (restructured)

Run: `npm install && npm run dev`

## Structure (src/)
- `config/` env.js (backend URLs, `.env` se override), storageKeys.js
- `services/` API helpers (social, feed, interactions, admin, auth/logout)
- `context/` + `hooks/` ThemeProvider, useTheme, useInteractions, useCountUp
- `utils/` safeLink, date, initials, storage, resumeHelpers, resumePdf
- `constants/` resume.js, homeData.js
- `components/ui/` Icon (4 duplicate icon sets -> 1), ThemeToggle
- `components/layout|common|resume/` Navbar, LocationPicker, ProfileEditors, resume views/fields
- `pages/` home, public, auth, candidate, employer, company, admin (each with its own css)
- `routes/index.jsx` all routes; `App.jsx` = providers only
- `styles/` index.css (Tailwind import), theme.css (tokens), base.css, home.css, dashboard/

## Theme (light / dark)
- `<html data-theme="dark|light">` is set by ThemeProvider and saved in localStorage.
- Tailwind: tokens `bg-bg bg-surface text-text text-muted border-border bg-brand`, and `dark:` variant works.
- `*.dark.css` next to public/company page css are auto-generated dark overrides (edit freely).
- Light theme CSS is unchanged.

## Dashboards (sections)
- `pages/candidate/sections/*`, `pages/employer/sections/*`, `pages/admin/sections/*`:
  har sidebar option ka apna component. Dashboard file ab sirf state + layout + section switch hai.
- Bug fix: AdminDashboard ke Users filter mein `(filter = useEffect == "Offline" ...)` typo tha
  (const ko assign karke crash karta tha) -> `filter === "Offline"` kiya.
