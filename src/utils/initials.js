/** "Rahul Sharma" -> "RS". Naam khali ho to fallback (default "?") milta hai. */
export const initialsOf = (name = "", fallback = "?") =>
    String(name)
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || fallback;
