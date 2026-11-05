import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { socialGet, socialPost } from "../../services/socialService";

// Default: job likes/comments (job_social.php)
const jobAdapter = {
    likeText: "liked this job",
    likes: (id) =>
        socialGet({ action: "likes", job_id: id }).then((d) => (d.success ? d.likes : [])),
    comments: (id) =>
        socialGet({ action: "comments", job_id: id }).then((d) => (d.success ? d.comments : [])),
    post: (id, body, parentId) =>
        socialPost({
            action: "comment",
            job_id: String(id),
            body,
            ...(parentId ? { parent_id: String(parentId) } : {}),
        }).then((d) => (d.success ? d.comment : null)),
};

const initials = (n = "") =>
    n.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

export default function JobSocialModal({
    jobId,
    title = "",
    initialTab = "likes",
    onClose,
    onChange,
    adapter = jobAdapter,
}) {
    const [tab, setTab] = useState(initialTab);
    const [likes, setLikes] = useState(null);
    const [comments, setComments] = useState(null);
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const inputRef = useRef(null);
    const dark = !!document.querySelector(".candidate-app.dark");

    useEffect(() => {
        adapter.likes(jobId).then(setLikes).catch(() => setLikes([]));
        adapter.comments(jobId).then(setComments).catch(() => setComments([]));
    }, [jobId]);

    const send = async () => {
        const body = text.trim();
        if (!body || busy) return;
        setBusy(true);
        setErr("");
        try {
            const c = await adapter.post(jobId, body, replyTo?.id);
            if (c) {
                setComments((prev) => [...(prev || []), c]);
                onChange?.({ comments: (comments?.length || 0) + 1 });
                setText("");
                setReplyTo(null);
            } else {
                setErr("Comment post nahi hua");
            }
        } catch {
            setErr("Comment post nahi hua");
        } finally {
            setBusy(false);
        }
    };

    const startReply = (c) => {
        setReplyTo(c);
        setText(`@${c.user_name} `);
        inputRef.current?.focus();
    };

    const top = (comments || []).filter((c) => !c.parent_id);
    const repliesOf = (id) => (comments || []).filter((c) => c.parent_id === id);

    const renderRow = (c, small) => (
        <div className={`jsm-row ${small ? "small" : ""}`} key={c.id}>
            <div className="jsm-avatar">{initials(c.user_name)}</div>
            <div className="jsm-main">
                <div>
                    <strong>{c.user_name}</strong>
                    {c.user_role === "employer" && <span className="jsm-tag">Employer</span>}
                    <small> · {c.time_ago}</small>
                </div>
                <p>{c.body}</p>
                <button className="jsm-reply" onClick={() => startReply(c)}>Reply</button>
            </div>
        </div>
    );

    return createPortal(
        <div className="jsm-overlay" onClick={onClose}>
            <style>{`
                .jsm-overlay { position:fixed; inset:0; z-index:6000; background:rgba(15,15,25,.6);
                    backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:16px; }
                .jsm-box { width:100%; max-width:460px; max-height:85vh; display:flex; flex-direction:column;
                    border-radius:20px; overflow:hidden; box-shadow:0 25px 70px rgba(0,0,0,.4);
                    background:#fff; color:#1a1a1a; }
                .jsm-box.dark { background:#1c1e2b; color:#f2f2f7; }
                .jsm-head { display:flex; align-items:center; gap:10px; padding:14px 16px;
                    border-bottom:1px solid rgba(120,120,140,.2); }
                .jsm-head h4 { margin:0; flex:1; font-size:15px; }
                .jsm-x { border:none; background:rgba(120,120,140,.15); color:inherit;
                    width:30px; height:30px; border-radius:50%; cursor:pointer; }
                .jsm-tabs { display:flex; border-bottom:1px solid rgba(120,120,140,.2); }
                .jsm-tabs button { flex:1; padding:11px; border:none; background:transparent; color:inherit;
                    font:inherit; font-weight:600; font-size:13.5px; cursor:pointer; opacity:.6;
                    border-bottom:2px solid transparent; }
                .jsm-tabs button.on { opacity:1; border-bottom-color:#6366f1; }
                .jsm-body { padding:10px 14px; overflow-y:auto; flex:1; min-height:160px; }
                .jsm-row { display:flex; gap:10px; padding:8px 0; }
                .jsm-row.small { margin-left:46px; }
                .jsm-avatar { flex:none; width:38px; height:38px; border-radius:50%; display:grid; place-items:center;
                    color:#fff; font-size:13px; font-weight:700; background:linear-gradient(135deg,#6366f1,#ec4899); }
                .jsm-row.small .jsm-avatar { width:30px; height:30px; font-size:11px; }
                .jsm-main { font-size:13.5px; line-height:1.4; }
                .jsm-main p { margin:2px 0 0; word-break:break-word; }
                .jsm-main small { opacity:.6; }
                .jsm-tag { margin-left:6px; padding:1px 7px; border-radius:20px; font-size:10.5px;
                    background:rgba(99,102,241,.15); color:#6366f1; font-weight:700; }
                .jsm-reply { border:none; background:none; padding:2px 0; font-size:12px; font-weight:600;
                    color:inherit; opacity:.6; cursor:pointer; }
                .jsm-empty { padding:30px 8px; text-align:center; opacity:.65; font-size:13.5px; }
                .jsm-foot { padding:10px 14px; border-top:1px solid rgba(120,120,140,.2); }
                .jsm-replying { display:flex; justify-content:space-between; font-size:12px; opacity:.7; margin-bottom:6px; }
                .jsm-replying button { border:none; background:none; color:inherit; cursor:pointer; }
                .jsm-err { color:#ef4444; font-size:12px; margin-bottom:6px; }
                .jsm-input { display:flex; gap:8px; }
                .jsm-input input { flex:1; height:40px; padding:0 12px; border-radius:20px; font:inherit; font-size:13.5px;
                    border:1px solid rgba(120,120,140,.35); background:transparent; color:inherit; outline:none; }
                .jsm-input button { padding:0 16px; border:none; border-radius:20px; cursor:pointer; font-weight:700;
                    color:#fff; background:linear-gradient(90deg,#6366f1,#ec4899); }
                .jsm-input button:disabled { opacity:.5; cursor:default; }
            `}</style>

            <div className={`jsm-box ${dark ? "dark" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className="jsm-head">
                    <h4>{title || "Details"}</h4>
                    <button className="jsm-x" onClick={onClose}>✕</button>
                </div>

                <div className="jsm-tabs">
                    <button className={tab === "likes" ? "on" : ""} onClick={() => setTab("likes")}>
                        Likes{likes ? ` (${likes.length})` : ""}
                    </button>
                    <button className={tab === "comments" ? "on" : ""} onClick={() => setTab("comments")}>
                        Comments{comments ? ` (${comments.length})` : ""}
                    </button>
                </div>

                <div className="jsm-body">
                    {tab === "likes" && (
                        <>
                            {likes === null && <p className="jsm-empty">Loading...</p>}
                            {likes && likes.length === 0 && <p className="jsm-empty">No likes yet.</p>}
                            {(likes || []).map((l, i) => (
                                <div className="jsm-row" key={i}>
                                    <div className="jsm-avatar">{initials(l.user_name)}</div>
                                    <div className="jsm-main">
                                        <strong>{l.user_name}</strong>
                                        <div>
                                            <small>
                                                {l.sub ? `${l.sub} · ` : ""}
                                                {adapter.likeText} · {l.time_ago}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {tab === "comments" && (
                        <>
                            {comments === null && <p className="jsm-empty">Loading...</p>}
                            {comments && comments.length === 0 && (
                                <p className="jsm-empty">No comments yet. Be the first to comment.</p>
                            )}
                            {top.map((c) => (
                                <div key={c.id}>
                                    {renderRow(c, false)}
                                    {repliesOf(c.id).map((r) => renderRow(r, true))}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {tab === "comments" && (
                    <div className="jsm-foot">
                        {replyTo && (
                            <div className="jsm-replying">
                                <span>Replying to {replyTo.user_name}</span>
                                <button onClick={() => { setReplyTo(null); setText(""); }}>✕</button>
                            </div>
                        )}
                        {err && <div className="jsm-err">{err}</div>}
                        <div className="jsm-input">
                            <input
                                ref={inputRef}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && send()}
                                placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                            />
                            <button onClick={send} disabled={busy || !text.trim()}>Post</button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}