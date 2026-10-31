import { CompanyIcon as CPIcon } from "../../../components/ui/Icon/index";
import { useCountUpFromZero } from "../../../hooks/useCountUp";

export function StatTile({ icon, label, value, suffix = "", note, tone }) {
    const n = useCountUpFromZero(value);
    return (
        <div className={`cp-stat cp-tone-${tone}`}>
            <span className="cp-stat-icon">
                <CPIcon name={icon} size={20} />
            </span>
            <div>
                <strong>
                    {n.toLocaleString("en-IN")}
                    {suffix}
                </strong>
                <span>{label}</span>
                <small>{note}</small>
            </div>
        </div>
    );
}
