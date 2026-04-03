import { usePage } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@inertiajs/react';
import { CalendarDaysIcon, ClockIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { openModal as openAppointmentModal } from '../../appointments/_redux/appointment-slice';

export default function SetterHeaderSection() {
    const dispatch = useDispatch();
    const { props } = usePage();
    const user = props.auth?.user;
    const firstName = user?.name?.split(' ')[0] ?? 'there';

    const { stats, loading } = useSelector((s) => s.dashboard);

    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 12 ? 'Good morning' :
        hour < 18 ? 'Good afternoon' :
                    'Good evening';

    const statCards = [
        {
            label: "Today's Appointments",
            value: stats.todays_appointments,
            icon: CalendarDaysIcon,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Pending Bookings',
            value: stats.pending_bookings,
            icon: ClockIcon,
            color: 'bg-amber-50 text-amber-600',
        },
    ];

    return (
        <div className="mb-6 space-y-4">
            {/* Greeting banner */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-teal-200 font-medium">{greeting},</p>
                        <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">{firstName}! 👋</h1>
                        <p className="text-sm text-teal-100/80 mt-1">Manage today's bookings and patient schedules.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => dispatch(openAppointmentModal(null))}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 text-sm font-bold rounded-xl shadow hover:bg-teal-50 transition-colors flex-shrink-0"
                        >
                            <CalendarDaysIcon className="w-4 h-4" />
                            New Appointment
                        </button>
                        <Link
                            href="/patients"
                            className="flex items-center gap-2 px-5 py-2.5 bg-teal-500/40 text-white text-sm font-bold rounded-xl hover:bg-teal-500/60 transition-colors flex-shrink-0"
                        >
                            <UserPlusIcon className="w-4 h-4" />
                            Add Patient
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-2 gap-4">
                {statCards.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                            <s.icon className="w-5 h-5" />
                        </div>
                        <div>
                            {loading
                                ? <div className="h-5 w-8 bg-gray-200 rounded animate-pulse mb-1" />
                                : <p className="text-xl font-extrabold text-gray-800 leading-none">{s.value}</p>
                            }
                            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
