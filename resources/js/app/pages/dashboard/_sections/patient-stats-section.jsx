import { useSelector } from 'react-redux';
import {
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const DEMO = {
    upcoming:  2,
    pending:   1,
    completed: 5,
    total:     8,
};

const CARDS = [
    { key: 'upcoming',  label: 'Upcoming',  icon: CalendarDaysIcon,          gradient: 'from-blue-500 to-blue-600',       iconBg: 'bg-blue-400/30' },
    { key: 'pending',   label: 'Pending',   icon: ClockIcon,                 gradient: 'from-amber-400 to-amber-500',     iconBg: 'bg-amber-300/30' },
    { key: 'completed', label: 'Completed', icon: CheckCircleIcon,           gradient: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-400/30' },
    { key: 'total',     label: 'All Time',  icon: ClipboardDocumentListIcon, gradient: 'from-violet-500 to-violet-600',   iconBg: 'bg-violet-400/30' },
];

export default function PatientStatsSection() {
    const { stats, loading } = useSelector((s) => s.dashboard);

    // Map dashboard API stats to patient-facing keys, fall back to demo values
    const values = {
        upcoming:  stats?.upcoming_appointments ?? DEMO.upcoming,
        pending:   stats?.pending_bookings      ?? DEMO.pending,
        completed: stats?.completed_appointments ?? DEMO.completed,
        total:     stats?.total_appointments     ?? DEMO.total,
    };

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {CARDS.map(({ key, label, icon: Icon, gradient, iconBg }) => (
                <div key={key} className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-sm`}>
                    {loading ? (
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-3 w-20 bg-white/30 rounded animate-pulse" />
                                <div className="h-8 w-10 bg-white/30 rounded animate-pulse" />
                            </div>
                            <div className={`w-11 h-11 ${iconBg} rounded-xl animate-pulse`} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{label}</p>
                                <p className="text-4xl font-extrabold mt-1">{values[key]}</p>
                            </div>
                            <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
