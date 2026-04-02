import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePage } from '@inertiajs/react';
import {
    BellIcon,
    XMarkIcon,
    CheckIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    fetchNotificationsThunk,
    markNotificationReadThunk,
    markAllNotificationsReadThunk,
    deleteNotificationThunk,
} from '../notifications/_redux/notification-thunk';
import {
    setActiveNotification,
    clearActiveNotification,
    pushNotification,
} from '../notifications/_redux/notification-slice';

// ─── Icon map by notification type ───────────────────────────────────────────
const TYPE_STYLES = {
    appointment_booked:      { dot: 'bg-blue-500',  icon: '📋' },
    appointment_confirmed:   { dot: 'bg-green-500', icon: '✅' },
    appointment_cancelled:   { dot: 'bg-red-500',   icon: '❌' },
    appointment_completed:   { dot: 'bg-purple-500',icon: '🏁' },
    appointment_rescheduled: { dot: 'bg-amber-500', icon: '🔄' },
};

function typeStyle(type) {
    return TYPE_STYLES[type] ?? { dot: 'bg-gray-400', icon: '🔔' };
}

function timeAgo(iso) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60)  return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function NotificationModal({ notification, onClose, onDelete }) {
    const dispatch = useDispatch();
    if (!notification) return null;

    const style = typeStyle(notification.type);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{style.icon}</span>
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-700 leading-relaxed">{notification.body}</p>
                    <p className="text-xs text-gray-400 mt-4">{timeAgo(notification.created_at)}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-6 pb-5">
                    <button
                        onClick={() => { onDelete(notification.id); onClose(); }}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Bell Component ──────────────────────────────────────────────────────
export default function NotificationBell() {
    const dispatch   = useDispatch();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { props }   = usePage();
    const userId      = props.auth?.user?.id;

    const { items, activeNotification } = useSelector((s) => s.notifications);
    const unread = items.filter((n) => !n.is_read).length;

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchNotificationsThunk());
    }, [dispatch]);

    // Subscribe to Pusher private channel
    useEffect(() => {
        if (!userId || !window.Echo) return;

        const channel = window.Echo.private(`user.${userId}`);
        channel.listen('.notification.sent', (data) => {
            dispatch(pushNotification(data));
        });

        return () => {
            window.Echo.leave(`user.${userId}`);
        };
    }, [userId, dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            dispatch(markNotificationReadThunk(notification.id));
        }
        dispatch(setActiveNotification(notification));
        setOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteNotificationThunk(id));
    };

    return (
        <>
            {/* Bell + Dropdown wrapper */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen((s) => !s)}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Notifications"
                >
                    <BellIcon className="w-5 h-5 text-gray-500" />
                    {unread > 0 && (
                        <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                            {unread > 99 ? '99+' : unread}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 flex flex-col max-h-[480px]">
                        {/* Dropdown header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                            {unread > 0 && (
                                <button
                                    onClick={() => dispatch(markAllNotificationsReadThunk())}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
                                >
                                    <CheckIcon className="w-3.5 h-3.5" /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto flex-1">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <BellIcon className="w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-400">No notifications yet</p>
                                </div>
                            ) : (
                                items.map((n) => {
                                    const style = typeStyle(n.type);
                                    return (
                                        <div
                                            key={n.id}
                                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                                            onClick={() => handleNotificationClick(n)}
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <span className={`inline-block w-2 h-2 rounded-full ${!n.is_read ? style.dot : 'bg-gray-200'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-semibold truncate ${!n.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                                                className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <XMarkIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <NotificationModal
                notification={activeNotification}
                onClose={() => dispatch(clearActiveNotification())}
                onDelete={handleDelete}
            />
        </>
    );
}
