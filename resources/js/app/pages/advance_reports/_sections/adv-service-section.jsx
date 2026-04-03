import { useSelector } from 'react-redux';

const PALETTE = [
    'bg-violet-400', 'bg-sky-400', 'bg-emerald-400', 'bg-amber-400',
    'bg-rose-400', 'bg-teal-400', 'bg-indigo-400', 'bg-orange-400',
    'bg-pink-400', 'bg-cyan-400',
];

export default function AdvServiceSection() {
    const { by_service, loading } = useSelector((s) => s.advanceReports);

    const max = Math.max(...by_service.map((s) => s.total), 1);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">Service Breakdown</h3>
                <span className="text-xs text-gray-400">Top {by_service.length}</span>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-3.5 bg-gray-100 rounded w-1/3 animate-pulse" />
                            <div className="flex-1 h-3 bg-gray-100 rounded animate-pulse" />
                            <div className="h-3.5 bg-gray-100 rounded w-8 animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : by_service.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">No data</div>
            ) : (
                <div className="space-y-3">
                    {by_service.map((s, i) => {
                        const pct = Math.round((s.total / max) * 100);
                        const completionPct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
                        return (
                            <div key={s.service} className="group">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700 truncate max-w-[55%]">{s.service}</span>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <span className="text-emerald-500 font-medium">{completionPct}% done</span>
                                        <span className="font-semibold text-gray-700">{s.total}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${PALETTE[i % PALETTE.length]} transition-all`}
                                        style={{ width: `${Math.max(pct, 2)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
