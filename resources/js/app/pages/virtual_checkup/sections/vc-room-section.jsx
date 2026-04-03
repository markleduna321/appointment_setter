import { XMarkIcon, VideoCameraIcon, CalendarDaysIcon, ClockIcon, UserCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d + 'T00:00').toLocaleDateString('en-PH', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
}

export default function VcRoomSection({ appointment, authUser, onClose }) {
    // Unique room per appointment — hard to guess
    const roomName = `appointdoc-appt-${appointment.id}-${btoa(String(appointment.id + 7919)).replace(/[^a-z0-9]/gi, '')}`;
    const meetUrl  = `https://meet.jit.si/${roomName}`;

    const openRoom = () => window.open(meetUrl, '_blank', 'noopener,noreferrer');

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold text-white">Video Consultation</span>
                    <span className="text-gray-500 text-sm">|</span>
                    <span className="text-sm text-gray-300">{appointment.service}</span>
                    <span className="hidden sm:inline text-gray-500 text-sm">with</span>
                    <span className="hidden sm:inline text-sm text-gray-300">Dr. {appointment.doctor_name}</span>
                </div>
                <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                >
                    <XMarkIcon className="w-4 h-4" />
                    Leave Call
                </button>
            </div>

            {/* Lobby */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-950">
                <div className="w-full max-w-md bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
                    {/* Header band */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                            <VideoCameraIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-0.5">Virtual Check Up</p>
                            <p className="text-lg font-extrabold text-white leading-tight">{appointment.service}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="px-6 py-5 space-y-3 border-b border-gray-800">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <UserCircleIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span>Dr. {appointment.doctor_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <CalendarDaysIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <ClockIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span>{formatTime(appointment.time)}</span>
                        </div>
                    </div>

                    {/* Instructions + CTA */}
                    <div className="px-6 py-5 space-y-4">
                        <ol className="space-y-2.5">
                            {[
                                { n: 1, text: 'Click "Open Meeting Room" below' },
                                { n: 2, text: 'Allow microphone & camera when prompted' },
                                { n: 3, text: 'If asked to log in, sign in with Google to start the room' },
                            ].map(({ n, text }) => (
                                <li key={n} className="flex items-start gap-3 text-sm text-gray-400">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">{n}</span>
                                    {text}
                                </li>
                            ))}
                        </ol>

                        <button
                            onClick={openRoom}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-base shadow-lg shadow-blue-900/40 transition-all"
                        >
                            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                            Open Meeting Room
                        </button>

                        <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                            The meeting opens in a new tab. Both parties must be in the same room — the link is unique to this appointment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

