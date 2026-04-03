import { VideoCameraIcon, ClockIcon, UserCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d + 'T00:00').toLocaleDateString('en-PH', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
}

function localDateString(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function AppointmentCard({ appt, onJoin }) {
    const now = new Date();
    const today = localDateString(now);
    const apptDateTime = new Date(`${appt.date}T${appt.time}`);
    const diffMin = (apptDateTime - now) / 60000;

    const isToday    = appt.date === today;
    const canJoin    = isToday && appt.status === 'confirmed' && diffMin <= 15 && diffMin >= -60;
    const minutesTo  = Math.round(diffMin);

    const cardBg = canJoin
        ? 'bg-green-50 border-green-200'
        : appt.status === 'pending'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-white border-gray-100';

    return (
        <div className={`rounded-2xl border shadow-sm p-5 flex items-center gap-5 transition-all ${cardBg}`}>
            {/* Avatar */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <UserCircleIcon className="w-7 h-7 text-blue-500" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{appt.service}</p>
                <p className="text-sm text-gray-500 truncate">Dr. {appt.doctor_name}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        {formatDate(appt.date)}
                    </span>
                    <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {formatTime(appt.time)}
                    </span>
                    {canJoin && minutesTo > 0 && (
                        <span className="text-green-600 font-semibold">In {minutesTo} min</span>
                    )}
                    {canJoin && minutesTo <= 0 && (
                        <span className="text-green-600 font-semibold">Now</span>
                    )}
                </div>
            </div>

            {/* Status + action */}
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                {canJoin ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live
                    </span>
                ) : appt.status === 'pending' ? (
                    <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">Awaiting Approval</span>
                ) : appt.status === 'confirmed' ? (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Confirmed</span>
                ) : appt.status === 'completed' ? (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Completed</span>
                ) : (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full capitalize">{appt.status}</span>
                )}

                {canJoin && (
                    <button
                        onClick={() => onJoin(appt)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95 transition-all"
                    >
                        <VideoCameraIcon className="w-4 h-4" />
                        Join Call
                    </button>
                )}
            </div>
        </div>
    );
}

export default function VcAppointmentsSection({ appointments, loading, onJoin, role }) {
    const isDoctor = role === 'doctor';
    const visible = appointments
        .filter((a) => a.status !== 'cancelled')
        .sort((a, b) => {
            const today = localDateString();
            const aToday = a.date === today ? 0 : 1;
            const bToday = b.date === today ? 0 : 1;
            if (aToday !== bToday) return aToday - bToday;
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {isDoctor ? "Today's Video Consultations" : 'My Virtual Check Ups'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isDoctor ? 'Patients scheduled for a virtual check up with you' : 'Your virtual consultation history and upcoming sessions'}
                    </p>
                </div>
                {visible.length > 0 && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                        {visible.length} appointment{visible.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[0, 1].map((i) => (
                        <div key={i} className="rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 animate-pulse">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                            <div className="w-24 h-9 bg-gray-100 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-14 flex flex-col items-center text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                        <VideoCameraIcon className="w-7 h-7 text-blue-400" />
                    </div>
                    <p className="font-semibold text-gray-700">
                        {isDoctor ? 'No virtual consultations scheduled' : 'No virtual check ups yet'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 max-w-xs">
                        {isDoctor
                            ? 'Confirmed video call appointments will appear here.'
                            : 'Use the form above to apply for a virtual consultation. Once approved, your session will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {visible.map((appt) => (
                        <AppointmentCard key={appt.id} appt={appt} onJoin={onJoin} />
                    ))}
                </div>
            )}
        </div>
    );
}
