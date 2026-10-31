import { CompanyIcon as CPIcon } from "../../../components/ui/Icon/index";

export function Stars({ value, size = 15 }) {
    return (
        <span className="cp-stars" aria-label={`${value} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= Math.round(value) ? "on" : ""}>
                    <CPIcon name="star" size={size} />
                </span>
            ))}
        </span>
    );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
