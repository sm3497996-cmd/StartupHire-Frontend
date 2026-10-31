import { useState } from "react";

/* ---------------- area chart ---------------- */
export function AreaChart({ range, data }) {
    const { labels, values } = data[range];
    const [hover, setHover] = useState(null);
    const W = 600, H = 220, PX = 20, PT = 20, PB = 30;
    const max = Math.max(...values, 1) * 1.15;
    const pts = values.map((v, i) => [
        PX + (i * (W - PX * 2)) / (values.length - 1),
        PT + (1 - v / max) * (H - PT - PB),
    ]);
    let line = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
        const cx = (pts[i - 1][0] + pts[i][0]) / 2;
        line += ` C${cx},${pts[i - 1][1]} ${cx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
    }
    const area = `${line} L${pts[pts.length - 1][0]},${H - PB} L${pts[0][0]},${H - PB} Z`;

    const move = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * W;
        let best = 0;
        pts.forEach((p, i) => {
            if (Math.abs(p[0] - x) < Math.abs(pts[best][0] - x)) best = i;
        });
        setHover(best);
    };

    return (
        <div className="sa-chart">
            <svg
                key={range}
                viewBox={`0 0 ${W} ${H}`}
                onMouseMove={move}
                onMouseLeave={() => setHover(null)}
                role="img"
                aria-label="Logins chart"
            >
                <defs>
                    <linearGradient id="saArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5b3df5" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#5b3df5" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="saLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#5b3df5" />
                        <stop offset="100%" stopColor="#e83f7d" />
                    </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75, 1].map((g) => (
                    <line key={g} x1={PX} x2={W - PX} y1={PT + (1 - g) * (H - PT - PB)} y2={PT + (1 - g) * (H - PT - PB)} className="sa-grid-line" />
                ))}
                <path d={area} fill="url(#saArea)" className="sa-area" />
                <path d={line} className="sa-line" pathLength="1" />
                {hover !== null && (
                    <>
                        <line x1={pts[hover][0]} x2={pts[hover][0]} y1={PT} y2={H - PB} className="sa-hover-line" />
                        <circle cx={pts[hover][0]} cy={pts[hover][1]} r="6" className="sa-hover-dot" />
                    </>
                )}
                {labels.map((l, i) => (
                    <text key={l} x={pts[i][0]} y={H - 8} textAnchor="middle" className="sa-axis">{l}</text>
                ))}
            </svg>
            {hover !== null && (
                <div className="sa-tip" style={{ left: `${(pts[hover][0] / W) * 100}%` }}>
                    <b>{values[hover]}</b> logins · {labels[hover]}
                </div>
            )}
        </div>
    );
}
