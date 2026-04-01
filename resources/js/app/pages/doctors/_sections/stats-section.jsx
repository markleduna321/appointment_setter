import { useSelector } from 'react-redux';
import { UserGroupIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const CARDS = [
    {
        key: 'total',
        label: 'Total Doctors',
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-400/30',
        icon: UserGroupIcon,
        filter: () => true,
    },
    {
        key: 'available',
        label: 'Available',
        gradient: 'from-emerald-500 to-emerald-600',
        iconBg: 'bg-emerald-400/30',
        icon: CheckCircleIcon,
        filter: (d) => d.status === 'available',
    },
    {
        key: 'unavailable',
        label: 'Unavailable',
        gradient: 'from-amber-400 to-amber-500',
        iconBg: 'bg-amber-300/30',
        icon: ClockIcon,
        filter: (d) => d.status === 'unavailable',
    },
    {
        key: 'on_leave',
        label: 'On Leave',
        gradient: 'from-red-400 to-red-500',
        iconBg: 'bg-red-300/30',
        icon: XCircleIcon,
        filter: (d) => d.status === 'on_leave',
    },
];

export default function StatsSection() {
    const { doctors, loading } = useSelector((s) => s.doctors);

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {CARDS.map(({ key, label, gradient, iconBg, icon: Icon, filter }) => (
                <div key={key} className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-sm`}>
                    {loading ? (
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-3 w-20 bg-white/30 rounded animate-pulse" />
                                <div className="h-8 w-10 bg-white/30 rounded animate-pulse" />
                            </div>
                            <div className={`w-12 h-12 ${iconBg} rounded-xl animate-pulse`} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{label}</p>
                                <p className="text-4xl font-extrabold mt-1">{doctors.filter(filter).length}</p>
                            </div>
                            <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
