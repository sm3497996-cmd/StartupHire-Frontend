import { CandidateIcon as Icon } from "../../../components/ui/Icon";

export default function MessagesSection({
    activeConversation,
    activeThread,
    APP_COLORS,
    chatMessages,
    messageDraft,
    sendMessage,
    setActiveConversation,
    setMessageDraft,
    threads,
}) {
    return (
        <section className="messages-page">
                            <div className="messages-list">
                                {threads.length === 0 && (
                                    <p className="no-comments" style={{ padding: 16 }}>
                                        No conversations yet. Apply to a job and you can chat with the company here.
                                    </p>
                                )}
                                {threads.map((t) => (
                                    <button
                                        key={t.application_id}
                                        className={`conversation-item ${activeConversation === t.application_id ? "active" : ""}`}
                                        onClick={() => setActiveConversation(t.application_id)}
                                    >
                                        <div className="conversation-avatar" style={{ background: APP_COLORS[t.application_id % APP_COLORS.length] }}>
                                            {(t.company_name || "?")[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <strong>
                                                {t.company_name}
                                                {t.unread > 0 && <span className="side-count" style={{ marginLeft: 8 }}>{t.unread}</span>}
                                            </strong>
                                            <p>{t.last_message || t.job_title}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="chat-window">
                                {!activeThread ? (
                                    <p className="no-comments">Select a conversation</p>
                                ) : (
                                    <>
                                        <div className="chat-header">
                                            <div className="conversation-avatar" style={{ background: APP_COLORS[activeThread.application_id % APP_COLORS.length] }}>
                                                {(activeThread.company_name || "?")[0].toUpperCase()}
                                            </div>
                                            <strong>{activeThread.company_name} · {activeThread.job_title}</strong>
                                        </div>

                                        <div className="chat-body">
                                            {chatMessages.length === 0 && <p className="no-comments">No messages yet. Send the first message.</p>}
                                            {chatMessages.map((m) => (
                                                <div className={`chat-bubble ${m.sender_role === "candidate" ? "me" : "them"}`} key={m.id}>
                                                    {m.body}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="comment-input-row chat-input-row">
                                            <input
                                                value={messageDraft}
                                                onChange={(e) => setMessageDraft(e.target.value)}
                                                placeholder="Type a message..."
                                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                            />
                                            <button onClick={sendMessage}><Icon name="send" size={18} /></button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
    );
}
