const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const dates = (a, b) => [a, b].filter(Boolean).join(" – ");

const BASE_CSS = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: "Inter","Segoe UI",Arial,sans-serif; color: #1c1d2b; font-size: 12px; line-height: 1.55; }
a { color: inherit; text-decoration: none; }
.item { break-inside: avoid; margin-bottom: 12px; }
.item h4 { font-size: 13px; font-weight: 700; }
.item .meta { color: #6b6f85; font-size: 11px; margin: 1px 0 3px; }
.item p { color: #3b3e52; }
.pill { display: inline-block; padding: 3px 10px; margin: 0 5px 6px 0; border-radius: 999px; font-size: 10.5px; font-weight: 600; }
`;

const experienceHtml = (list) =>
    list.map((e) => `
    <div class="item tl">
        <h4>${esc(e.role)}${e.company ? ` <span class="at">· ${esc(e.company)}</span>` : ""}</h4>
        <div class="meta">${esc([e.type, e.location, dates(e.startDate, e.endDate)].filter(Boolean).join("  •  "))}</div>
        ${e.description ? `<p>${esc(e.description)}</p>` : ""}
    </div>`).join("");

const projectsHtml = (list) =>
    list.map((p) => `
    <div class="item tl">
        <h4>${esc(p.title)}</h4>
        ${p.stack?.length ? `<div class="meta">${esc(p.stack.join(" · "))}</div>` : ""}
        ${p.description ? `<p>${esc(p.description)}</p>` : ""}
        ${p.link ? `<div class="meta">${esc(p.link)}</div>` : ""}
    </div>`).join("");

const coursesHtml = (list) =>
    list.map((c) => `
    <div class="item tl">
        <h4>${esc(c.title)}</h4>
        <div class="meta">${esc([c.institute, dates(c.startDate, c.endDate)].filter(Boolean).join("  •  "))}</div>
        ${c.details ? `<p>${esc(c.details)}</p>` : ""}
    </div>`).join("");

const achievementsHtml = (list) =>
    list.map((a) => `
    <div class="item tl">
        <h4>${esc(a.title)}</h4>
        ${a.desc ? `<p>${esc(a.desc)}</p>` : ""}
    </div>`).join("");

const educationHtml = (list, light = false) =>
    list.map((e) => `
    <div class="item ${light ? "edu-l" : "tl"}">
        <h4>${esc(e.degree)}</h4>
        <div class="meta">${esc([e.board, e.industry].filter(Boolean).join(" • "))}</div>
        <div class="meta">${esc([dates(e.startDate, e.endDate), e.percentage ? `${e.percentage}` : ""].filter(Boolean).join("  •  "))}</div>
    </div>`).join("");

const section = (title, body) => (body ? `<section><h2>${title}</h2>${body}</section>` : "");

const addressLine = (d) => {
    const a = d.address?.current || {};
    return [a.line1, a.city, a.state, a.country, a.pincode].filter(Boolean).join(", ");
};

const avatar = (d, size) => {
    const p = d.personal || {};
    const initials = (p.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return p.photo
        ? `<img src="${esc(p.photo)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,.85);" />`
        : `<div style="width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${size / 2.6}px;font-weight:800;color:#fff;background:rgba(255,255,255,.2);border:4px solid rgba(255,255,255,.85);">${esc(initials)}</div>`;
};

/* ---------------- Template 1: WITH PHOTO ---------------- */
const photoTemplate = (d, role) => {
    const p = d.personal || {};
    const headline = p.headline || role || "";
    const contacts = [
        p.email && `✉ ${esc(p.email)}`,
        p.contact && `☎ ${esc(p.contact)}`,
        addressLine(d) && `⌖ ${esc(addressLine(d))}`,
        p.dob && `🎂 ${esc(p.dob)}`,
    ].filter(Boolean).map((x) => `<div class="c">${x}</div>`).join("");

    const skills = (d.skills || []).map((s) => `<span class="pill sk">${esc(s)}</span>`).join("");

    return `
    <style>${BASE_CSS}
    .wrap { width:210mm; min-height:297mm; display:flex; background:linear-gradient(90deg,#3a1fa8 0,#6228d7 33%,#fff 33%); }
    .side { width:33%; padding:34px 22px; color:#fff; }
    .side .av { display:flex; justify-content:center; margin-bottom:22px; }
    .side h3 { font-size:11px; letter-spacing:1.6px; text-transform:uppercase; margin:20px 0 10px; opacity:.85; border-bottom:1px solid rgba(255,255,255,.3); padding-bottom:5px; }
    .side .c { font-size:11px; margin-bottom:7px; word-break:break-word; }
    .pill.sk { background:rgba(255,255,255,.18); color:#fff; }
    .edu-l h4 { color:#fff; font-size:12px; }
    .edu-l .meta { color:rgba(255,255,255,.75); }
    .main { width:67%; padding:34px 30px; }
    .name { font-size:30px; font-weight:800; line-height:1.1; }
    .headline { display:inline-block; margin-top:8px; font-size:13px; font-weight:700; color:#fff; padding:5px 14px; border-radius:999px; background:linear-gradient(135deg,#f7971e,#ee2a7b,#6228d7); }
    .intro { margin-top:14px; color:#3b3e52; }
    section { margin-top:22px; }
    section h2 { font-size:12px; letter-spacing:1.8px; text-transform:uppercase; font-weight:800; color:#6228d7; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
    section h2::after { content:""; flex:1; height:2px; background:linear-gradient(90deg,#ee2a7b,transparent); }
    .tl { position:relative; padding-left:16px; border-left:2px solid #e6e1fb; }
    .tl::before { content:""; position:absolute; left:-6px; top:4px; width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,#f7971e,#ee2a7b); }
    .at { color:#6228d7; font-weight:600; }
    </style>
    <div class="wrap">
        <aside class="side">
            <div class="av">${avatar(d, 120)}</div>
            <h3>Contact</h3>${contacts}
            ${skills ? `<h3>Skills</h3>${skills}` : ""}
            ${(d.education || []).length ? `<h3>Education</h3>${educationHtml(d.education, true)}` : ""}
        </aside>
        <main class="main">
            <div class="name">${esc(p.name)}</div>
            ${headline ? `<div class="headline">${esc(headline)}</div>` : ""}
            ${p.intro ? `<p class="intro">${esc(p.intro)}</p>` : ""}
            ${section("Work Experience", experienceHtml(d.experience || []))}
            ${section("Projects", projectsHtml(d.projects || []))}
            ${section("Courses & Certifications", coursesHtml(d.courses || []))}
            ${section("Achievements", achievementsHtml(d.achievements || []))}
        </main>
    </div>`;
};

/* ---------------- Template 2: WITHOUT PHOTO ---------------- */
const plainTemplate = (d, role) => {
    const p = d.personal || {};
    const headline = p.headline || role || "";
    const chips = [p.email, p.contact, addressLine(d)].filter(Boolean)
        .map((x) => `<span class="chip">${esc(x)}</span>`).join("");
    const skills = (d.skills || []).map((s) => `<span class="pill sk">${esc(s)}</span>`).join("");

    return `
    <style>${BASE_CSS}
    .page { width:210mm; min-height:297mm; }
    .hd { padding:36px 40px 28px; color:#fff; background:linear-gradient(135deg,#f7971e,#ee2a7b 55%,#6228d7); }
    .name { font-size:34px; font-weight:800; line-height:1.1; }
    .headline { font-size:15px; font-weight:600; margin-top:6px; opacity:.95; }
    .chips { margin-top:14px; }
    .chip { display:inline-block; background:rgba(255,255,255,.2); border-radius:999px; padding:4px 12px; margin:0 6px 6px 0; font-size:11px; font-weight:600; }
    .body { padding:8px 40px 36px; }
    .intro { margin-top:18px; color:#3b3e52; }
    section { margin-top:22px; }
    section h2 { font-size:12px; letter-spacing:1.8px; text-transform:uppercase; font-weight:800; color:#6228d7; margin-bottom:12px; padding-left:10px; border-left:4px solid #ee2a7b; }
    .pill.sk { background:#efeafe; color:#5b3df5; }
    .tl { padding-left:14px; border-left:2px solid #e6e1fb; }
    .at { color:#6228d7; font-weight:600; }
    </style>
    <div class="page">
        <header class="hd">
            <div class="name">${esc(p.name)}</div>
            ${headline ? `<div class="headline">${esc(headline)}</div>` : ""}
            <div class="chips">${chips}</div>
        </header>
        <div class="body">
            ${p.intro ? `<p class="intro">${esc(p.intro)}</p>` : ""}
            ${section("Skills", skills)}
            ${section("Work Experience", experienceHtml(d.experience || []))}
            ${section("Projects", projectsHtml(d.projects || []))}
            ${section("Education", educationHtml(d.education || []))}
            ${section("Courses & Certifications", coursesHtml(d.courses || []))}
            ${section("Achievements", achievementsHtml(d.achievements || []))}
        </div>
    </div>`;
};

/* ---------------- Download (print to PDF) ---------------- */
export function downloadResume(data, role = "", template = "photo") {
    const html = template === "plain" ? plainTemplate(data, role) : photoTemplate(data, role);
    const title = `${data.personal?.name || "Resume"} - Resume`;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title></head><body>${html}</body></html>`);
    doc.close();

    const imgs = Array.from(doc.images);
    const waitImgs = Promise.all(
        imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; })))
    );

    waitImgs.then(() => {
        const oldTitle = document.title;
        document.title = title; // PDF ka file name
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
            document.title = oldTitle;
            iframe.remove();
        }, 1500);
    });
}

export default downloadResume;