import { CandidateIcon as Icon } from "../../../components/ui/Icon";

export default function NotificationsSection({
    markAllRead,
    notifications,
}) {
    return (
        <section className="notifications-page">

                            <div className="notifications-head-row">
                                <p>
                                    {notifications.filter((n) => n.unread).length}{" "}
                                    unread notifications
                                </p>

                                <button
                                    className="secondary-btn"
                                    onClick={markAllRead}
                                >
                                    Mark all as read
                                </button>
                            </div>

                            <div className="notifications-list-full">
                                {notifications.map((n) => (
                                    <div
                                        className={`notification-row ${n.unread ? "unread" : ""
                                            }`}
                                        key={n.id}
                                    >
                                        <span className={`notif-icon notif-${n.type}`}>
                                            <Icon
                                                name={
                                                    n.type === "job"
                                                        ? "briefcase"
                                                        : n.type === "message"
                                                            ? "message"
                                                            : "bell"
                                                }
                                                size={20}
                                            />
                                        </span>

                                        <div>
                                            <strong>{n.title}</strong>
                                            <p>{n.desc}</p>
                                            <small>{n.time}</small>
                                        </div>

                                        {n.unread && (
                                            <span className="unread-dot"></span>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </section>
    );
}
