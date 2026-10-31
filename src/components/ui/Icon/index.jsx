import { BASE_ICONS, CANDIDATE_OVERRIDES, CANDIDATE_NAMES, EMPLOYER_OVERRIDES, EMPLOYER_NAMES,
    ADMIN_OVERRIDES, ADMIN_NAMES, COMPANY_OVERRIDES, COMPANY_NAMES } from "./iconPaths";

const SVG_PROPS = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

/** Ek icon-set ka component banata hai (names + overrides + default size + fallback icon). */
export function createIcon({ names, overrides = {}, defaultSize = 21, fallback = "grid" }) {
    const icons = {};
    names.forEach((n) => {
        icons[n] = overrides[n] ?? BASE_ICONS[n];
    });

    function Icon({ name, size = defaultSize }) {
        return (
            <svg width={size} height={size} {...SVG_PROPS}>
                {icons[name] || icons[fallback]}
            </svg>
        );
    }
    return Icon;
}

export const CandidateIcon = createIcon({ names: CANDIDATE_NAMES, overrides: CANDIDATE_OVERRIDES, defaultSize: 21, fallback: "grid" });
export const EmployerIcon = createIcon({ names: EMPLOYER_NAMES, overrides: EMPLOYER_OVERRIDES, defaultSize: 21, fallback: "grid" });
export const AdminIcon = createIcon({ names: ADMIN_NAMES, overrides: ADMIN_OVERRIDES, defaultSize: 20, fallback: "grid" });
export const CompanyIcon = createIcon({ names: COMPANY_NAMES, overrides: COMPANY_OVERRIDES, defaultSize: 18, fallback: "check" });

export default CandidateIcon;
