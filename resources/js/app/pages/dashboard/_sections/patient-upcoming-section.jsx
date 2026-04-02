import { useSelector } from 'react-redux';
import { Link } from '@inertiajs/react';

const DEMO_UPCOMING = [
    { id: 1, doctor_name: 'Dr. Juan Dela Cruz', service: 'General Consultation', date: '2026-04-05', time: '09:00', status: 'confirmed' },
    { id: 2, doctor_name: 'Dr. Ana Garcia',     service: 'Dermatology',          date: '2026-04-10', time: '14:00', status: 'pending' },
];

const STATUS_STYLE = {
    pending:   { badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
    confirmed: { badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400' },
    completed: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
    cancelled: { badge: 'bg-red-100 text-red-600',       dot: 'bg-red-400' },
};

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d + 'T00:00').toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

export default function PatientUpcomingSection() {
    const { upcoming_appointments, loading } = useSelector((s) => s.dashboard);
    const list = (upcoming_appointments?.length > 0) ? upcoming_appointments : DEMO_UPCOMING;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Upcoming Appointments</h3>
                <Link href="/appointments" className="text-xs font-semibold text-blue-600 hover:underline">
                    View all →
                </Link>
            </div>

            {loading ? (
                <div className="p-4 space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 bg-gray-100 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : list.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-gray-400">
                    No upcoming appointments.{' '}
                    <Link href="/appointments/new" className="text-blue-600 font-semibold hover:underline">Book one now →</Link>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {list.map((appt) => {
                        const style = STATUS_STYLE[appt.status] ?? STATUS_STYLE.pending;
                        return (
                            <Link
                                key={appt.id}
                                href={`/appointments/${appt.id}`}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors"
                            >
                                {/* Date badge */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase leading-none">
                                        {appt.date ? new Date(appt.date + 'T00:00').toLocaleDateString('en-PH', { month: 'short' }) : '—'}
                                    </span>
                                    <span className="text-base font-extrabold text-blue-700 leading-tight">
                                        {appt.date ? new Date(appt.date + 'T00:00').getDate() : '—'}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{appt.service}</p>
                                    <p className="text-xs text-gray-500 truncate">{appt.doctor_name}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(appt.date)} • {formatTime(appt.time)}</p>
                                </div>

                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${style.badge}`}>
                                    {appt.status}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
