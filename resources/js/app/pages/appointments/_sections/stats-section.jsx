import { useSelector } from 'react-redux';
import {
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const TODAY = new Date().toISOString().slice(0, 10);

const CARDS = [
    { key: 'today',     label: "Today's Total", icon: CalendarDaysIcon,  gradient: 'from-blue-500 to-blue-600',    iconBg: 'bg-blue-400/30' },
    { key: 'pending',   label: 'Pending',        icon: ClockIcon,         gradient: 'from-amber-400 to-amber-500',  iconBg: 'bg-amber-300/30' },
    { key: 'confirmed', label: 'Confirmed',      icon: CheckCircleIcon,   gradient: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-400/30' },
    { key: 'cancelled', label: 'Cancelled',      icon: XCircleIcon,       gradient: 'from-red-400 to-red-500',      iconBg: 'bg-red-300/30' },
];

export default function StatsSection() {
    const { appointments, loading } = useSelector((s) => s.appointments);

    const stats = {
        today:     appointments.filter((a) => a.date === TODAY).length,
        pending:   appointments.filter((a) => a.status === 'pending').length,
        confirmed: appointments.filter((a) => a.status === 'confirmed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
            {CARDS.map(({ key, label, icon: Icon, gradient, iconBg }) => (
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
                                <p className="text-4xl font-extrabold mt-1">{stats[key]}</p>
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
