import { useSelector } from 'react-redux';
import { Link } from '@inertiajs/react';
import { UserIcon } from '@heroicons/react/24/outline';

const STATUS_STYLE = {
    pending:   { badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400' },
    confirmed: { badge: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-400' },
    completed: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
    cancelled: { badge: 'bg-red-100 text-red-600',         dot: 'bg-red-400' },
};

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function DoctorUpcomingSection() {
    const { upcoming_appointments, loading } = useSelector((s) => s.dashboard);

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
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 bg-gray-100 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                                <div className="h-3 bg-gray-100 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : upcoming_appointments.length === 0 ? (
                <div className="px-5 py-14 text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <UserIcon className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">No upcoming appointments</p>
                    <p className="text-xs text-gray-400 mt-1">Your schedule is clear.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {upcoming_appointments.map((appt) => {
                        const style = STATUS_STYLE[appt.status] ?? STATUS_STYLE.pending;
                        const day   = appt.date ? new Date(appt.date + 'T00:00') : null;
                        return (
                            <div key={appt.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                                {/* Date badge */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase leading-none">
                                        {day ? day.toLocaleDateString('en-PH', { month: 'short' }) : '—'}
                                    </span>
                                    <span className="text-base font-extrabold text-indigo-700 leading-tight">
                                        {day ? day.getDate() : '—'}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {appt.patient_name || '—'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{appt.service}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        {day ? day.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                        {appt.time ? ` · ${formatTime(appt.time)}` : ''}
                                    </p>
                                </div>

                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${style.badge}`}>
                                    {appt.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
