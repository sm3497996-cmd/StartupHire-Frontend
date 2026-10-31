import { useEffect, useState } from "react";

export function Donut({ a, b, labelA, labelB }) {
    const R = 52, C = 2 * Math.PI * R;
    const total = a + b || 1;
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 200);
        return () => clearTimeout(t);
    }, []);
    const pa = a / total;
    return (
        <div className="sa-donut-wrap">
            <div className="sa-donut">
                <svg viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r={R} className="sa-donut-bg" />
                    <circle cx="65" cy="65" r={R} className="sa-donut-b" strokeDasharray={C} strokeDashoffset={0} />
                    <circle cx="65" cy="65" r={R} className="sa-donut-a" strokeDasharray={C} strokeDashoffset={ready ? C * (1 - pa) : C} />
                </svg>
                <b>{total}</b>
                <span>users</span>
            </div>
            <ul>
                <li><i style={{ background: "#5b3df5" }}></i>{labelA}<b>{a}</b></li>
                <li><i style={{ background: "#e83f7d" }}></i>{labelB}<b>{b}</b></li>
            </ul>
        </div>
    );
}
