export function Avatar({ u, size = 46, ring = false, live = false }) {
    return (
        <span
            className={`sa-avatar-wrap ${ring ? "ring" : ""}`}
            style={{ width: size + (ring ? 10 : 0), height: size + (ring ? 10 : 0) }}
        >
            <span
                className="sa-avatar"
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.34,
                    background: `linear-gradient(135deg, ${u.color}, ${u.color}aa)`,
                }}
            >
                {u.initials}
            </span>
            {live && u.online && <i className="sa-live-dot"></i>}
        </span>
    );
}
