import { useSelector } from 'react-redux';

const STATUS_CONFIG = {
    completed: { color: 'bg-emerald-400', label: 'Completed',  text: 'text-emerald-700', bg: 'bg-emerald-50' },
    confirmed: { color: 'bg-violet-400',  label: 'Confirmed',  text: 'text-violet-700',  bg: 'bg-violet-50'  },
    pending:   { color: 'bg-amber-400',   label: 'Pending',    text: 'text-amber-700',   bg: 'bg-amber-50'   },
    cancelled: { color: 'bg-red-400',     label: 'Cancelled',  text: 'text-red-700',     bg: 'bg-red-50'     },
};

const SOURCE_CONFIG = {
    'walk-in': { color: 'bg-sky-400',    label: 'Walk-In',  text: 'text-sky-700',    bg: 'bg-sky-50'    },
    online:    { color: 'bg-indigo-400', label: 'Online',   text: 'text-indigo-700', bg: 'bg-indigo-50' },
};

function DistributionCard({ title, items, total, colorMap }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">{title}</h3>
            {items.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">No data</p>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => {
                        const cfg = colorMap[item.key?.toLowerCase()] ?? { color: 'bg-gray-300', label: item.key, text: 'text-gray-700', bg: 'bg-gray-50' };
                        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                        return (
                            <div key={item.key} className="flex items-center gap-3">
                                <div className={`flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-semibold ${cfg.bg} ${cfg.text} min-w-[80px]`}>
                                    {cfg.label}
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-full rounded-full ${cfg.color} transition-all`} style={{ width: `${Math.max(pct, 2)}%` }} />
                                </div>
                                <div className="flex items-center gap-1.5 min-w-[64px] justify-end">
                                    <span className="text-xs font-semibold text-gray-800">{item.count}</span>
                                    <span className="text-xs text-gray-400">({pct}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function AdvStatusSection() {
    const { by_status, by_source, kpi, loading } = useSelector((s) => s.advanceReports);

    const statusItems = by_status.map((r) => ({ key: r.status, count: r.count }));
    const sourceItems = by_source.map((r) => ({ key: r.source, count: r.count }));
    const sourceTotal = sourceItems.reduce((a, b) => a + b.count, 0);

    if (loading) {
        return (
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
                {[0, 1].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-40 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
            <DistributionCard
                title="Status Distribution"
                items={statusItems}
                total={kpi.total}
                colorMap={STATUS_CONFIG}
            />
            <DistributionCard
                title="Booking Source"
                items={sourceItems}
                total={sourceTotal}
                colorMap={SOURCE_CONFIG}
            />
        </div>
    );
}
