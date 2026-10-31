import { EmployerIcon as Icon } from "../../../components/ui/Icon";

export default function EmployerMessagesSection({
    activeConversation,
    conversations,
    messageDraft,
    openConversation,
    sendMessage,
    setMessageDraft,
}) {
    return (
        <section className="messages-page">

                                    <div className="messages-list">
                                        {conversations.map((c) => (
                                            <button
                                                key={c.id}
                                                className={`conversation-item ${activeConversation === c.id ? "active" : ""
                                                    }`}
                                                onClick={() => openConversation(c.id)}
                                            >
                                                <div
                                                    className="conversation-avatar"
                                                    style={{ background: c.color }}
                                                >
                                                    {c.initials}
                                                </div>

                                                <div>
                                                    <strong>{c.name}</strong>
                                                    <p>
                                                        {c.messages[c.messages.length - 1]?.text || c.job_title}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="chat-window">
                                        {(() => {
                                            const convo = conversations.find(
                                                (c) => c.id === activeConversation
                                            );

                                            if (!convo) {
                                                return (
                                                    <p className="no-comments">
                                                        Select a conversation
                                                    </p>
                                                );
                                            }

                                            return (
                                                <>
                                                    <div className="chat-header">
                                                        <div
                                                            className="conversation-avatar"
                                                            style={{ background: convo.color }}
                                                        >
                                                            {convo.initials}
                                                        </div>

                                                        <strong>{convo.name}</strong>
                                                    </div>

                                                    <div className="chat-body">
                                                        {convo.messages.map((m, i) => (
                                                            <div
                                                                className={`chat-bubble ${m.from === "me" ? "me" : "them"
                                                                    }`}
                                                                key={i}
                                                            >
                                                                {m.text}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="comment-input-row chat-input-row">
                                                        <input
                                                            value={messageDraft}
                                                            onChange={(e) =>
                                                                setMessageDraft(e.target.value)
                                                            }
                                                            placeholder="Type a message..."
                                                            onKeyDown={(e) =>
                                                                e.key === "Enter" &&
                                                                sendMessage()
                                                            }
                                                        />

                                                        <button onClick={sendMessage}>
                                                            <Icon name="send" size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                </section>
    );
}
