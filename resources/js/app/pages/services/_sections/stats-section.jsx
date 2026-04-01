import { useSelector } from 'react-redux';
import { SparklesIcon, CheckCircleIcon, XCircleIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

function StatCard({ icon: Icon, label, value, gradient, loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl p-5 bg-gray-100 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-7 bg-gray-200 rounded w-1/4" />
            </div>
        );
    }

    return (
        <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold opacity-90">{label}</p>
                <Icon className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-3xl font-extrabold">{value}</p>
        </div>
    );
}

export default function StatsSection() {
    const { services, loading } = useSelector((s) => s.services);

    const total    = services.length;
    const active   = services.filter((s) => s.status === 'active').length;
    const inactive = services.filter((s) => s.status === 'inactive').length;
    const categories = new Set(services.map((s) => s.category)).size;

    const stats = [
        { icon: SparklesIcon,         label: 'Total Services',  value: total,      gradient: 'from-purple-500 to-indigo-600' },
        { icon: CheckCircleIcon,      label: 'Active',          value: active,     gradient: 'from-emerald-500 to-teal-600' },
        { icon: XCircleIcon,          label: 'Inactive',        value: inactive,   gradient: 'from-gray-400 to-gray-600' },
        { icon: CursorArrowRaysIcon,  label: 'Categories',      value: categories, gradient: 'from-blue-500 to-cyan-600' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {stats.map((s) => (
                <StatCard key={s.label} {...s} loading={loading} />
            ))}
        </div>
    );
}
