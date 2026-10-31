import { AdminIcon as Icon } from "../../../components/ui/Icon/index";
import { useCountUp } from "../../../hooks/useCountUp";

export function Stat({ icon, label, value, note, tone }) {
    const n = useCountUp(value);
    return (
        <div className={`sa-stat sa-tone-${tone}`}>
            <span className="sa-stat-icon"><Icon name={icon} size={22} /></span>
            <div>
                <strong>{n.toLocaleString("en-IN")}</strong>
                <span>{label}</span>
                <small>{note}</small>
            </div>
        </div>
    );
}
