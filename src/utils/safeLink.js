// Link ko safe https link banata hai; galat ho to "" deta hai
export const safeLink = (url) => {
    const u = String(url || "").trim();
    if (!u) return "";
    const withProto = /^https?:\/\//i.test(u) ? u : `https://${u}`;
    try {
        const p = new URL(withProto);
        return ["http:", "https:"].includes(p.protocol) ? p.href : "";
    } catch {
        return "";
    }
};
