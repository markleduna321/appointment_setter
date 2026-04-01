import { useSelector } from 'react-redux';
import {
    CalendarDaysIcon,
    ClockIcon,
    UserGroupIcon,
    BellIcon,
} from '@heroicons/react/24/outline';

const STAT_CARDS = [
    {
        key: 'todays_appointments',
        label: "Today's Appointments",
        icon: CalendarDaysIcon,
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-400/30',
        demo: 8,
    },
    {
        key: 'pending_bookings',
        label: 'Pending Bookings',
        icon: ClockIcon,
        gradient: 'from-amber-400 to-amber-500',
        iconBg: 'bg-amber-300/30',
        demo: 5,
    },
    {
        key: 'available_doctors',
        label: 'Available Doctors',
        icon: UserGroupIcon,
        gradient: 'from-emerald-500 to-emerald-600',
        iconBg: 'bg-emerald-400/30',
        demo: 12,
    },
    {
        key: 'new_notifications',
        label: 'New Notifications',
        icon: BellIcon,
        gradient: 'from-violet-500 to-violet-600',
        iconBg: 'bg-violet-400/30',
        demo: 3,
    },
];

export default function StatsSection() {
    const { stats, loading } = useSelector((state) => state.dashboard);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map(({ key, label, icon: Icon, gradient, iconBg, demo }) => {
                const value = stats?.[key] ?? demo;
                return (
                    <div key={key} className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-sm`}>
                        {loading ? (
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-3 w-24 bg-white/30 rounded animate-pulse" />
                                    <div className="h-8 w-12 bg-white/30 rounded animate-pulse" />
                                </div>
                                <div className={`w-12 h-12 ${iconBg} rounded-xl animate-pulse`} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{label}</p>
                                    <p className="text-4xl font-extrabold mt-1">{value}</p>
                                </div>
                                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
