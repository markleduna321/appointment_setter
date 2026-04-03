import { useSelector } from 'react-redux';
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

function KpiCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function AdvKpiSection() {
    const { kpi, loading } = useSelector((s) => s.advanceReports);

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-24 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gray-100" />
                            <div className="flex-1 space-y-2 pt-1">
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                                <div className="h-6 bg-gray-100 rounded w-1/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <KpiCard
                icon={CalendarDaysIcon}
                iconBg="bg-violet-100"
                iconColor="text-violet-600"
                label="Total Appointments"
                value={kpi.total.toLocaleString()}
                sub={`${kpi.avg_per_day} avg / day`}
            />
            <KpiCard
                icon={CheckCircleIcon}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
                label="Completion Rate"
                value={`${kpi.completion_rate}%`}
                sub={`${kpi.completed} completed`}
            />
            <KpiCard
                icon={ClockIcon}
                iconBg="bg-amber-100"
                iconColor="text-amber-600"
                label="Pending / Confirmed"
                value={kpi.pending + kpi.confirmed}
                sub={`${kpi.pending} pending · ${kpi.confirmed} confirmed`}
            />
            <KpiCard
                icon={UserGroupIcon}
                iconBg="bg-sky-100"
                iconColor="text-sky-600"
                label="Unique Patients"
                value={kpi.unique_patients.toLocaleString()}
                sub={`${kpi.cancelled} cancellations`}
            />
        </div>
    );
}
