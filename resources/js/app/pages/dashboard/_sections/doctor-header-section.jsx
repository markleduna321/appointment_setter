import { usePage } from '@inertiajs/react';
import { useSelector } from 'react-redux';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function DoctorHeaderSection() {
    const { props } = usePage();
    const user = props.auth?.user;
    const firstName = user?.name?.split(' ')[0] ?? 'Doctor';

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
            label: 'Pending',
            value: stats.pending_bookings,
            icon: ClockIcon,
            color: 'bg-amber-50 text-amber-600',
        },
        {
            label: 'Completed',
            value: stats.completed ?? 0,
            icon: CheckCircleIcon,
            color: 'bg-emerald-50 text-emerald-600',
        },
    ];

    return (
        <div className="mb-6 space-y-4">
            {/* Greeting banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-sm">
                <p className="text-sm text-indigo-200 font-medium">{greeting},</p>
                <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">Dr. {firstName} 👋</h1>
                <p className="text-sm text-indigo-100/80 mt-1">Here are your upcoming appointments for today and beyond.</p>
            </div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-3 gap-4">
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
