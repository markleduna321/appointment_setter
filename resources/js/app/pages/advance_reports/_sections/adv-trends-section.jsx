import { useSelector } from 'react-redux';

const STATUS_COLORS = {
    completed: 'bg-emerald-400',
    confirmed: 'bg-violet-400',
    pending:   'bg-amber-400',
    cancelled: 'bg-red-400',
};

const STATUS_ORDER = ['completed', 'confirmed', 'pending', 'cancelled'];

function formatLabel(dateStr, total) {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function AdvTrendsSection() {
    const { by_date, loading } = useSelector((s) => s.advanceReports);

    const maxTotal = Math.max(...by_date.map((d) => d.total), 1);

    // Decide whether to bucket into weeks when range > 31 days
    const showAll = by_date.length <= 31;
    const data    = showAll ? by_date : (() => {
        // Group by week
        const weeks = {};
        by_date.forEach((d) => {
            const dt   = new Date(d.date + 'T00:00:00');
            const day0 = new Date(dt);
            day0.setDate(dt.getDate() - dt.getDay());
            const key  = day0.toISOString().slice(0, 10);
            if (!weeks[key]) weeks[key] = { date: key, total: 0, completed: 0, confirmed: 0, pending: 0, cancelled: 0 };
            weeks[key].total     += d.total;
            weeks[key].completed += d.completed;
            weeks[key].confirmed += d.confirmed;
            weeks[key].pending   += d.pending;
            weeks[key].cancelled += d.cancelled;
        });
        return Object.values(weeks);
    })();

    const maxVal = Math.max(...data.map((d) => d.total), 1);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">Appointment Trends</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{showAll ? 'Daily' : 'Weekly'} breakdown by status</p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3 flex-wrap justify-end">
                    {STATUS_ORDER.map((s) => (
                        <div key={s} className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-sm ${STATUS_COLORS[s]}`} />
                            <span className="text-xs text-gray-500 capitalize">{s}</span>
                        </div>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data for this period.</div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="flex items-end gap-1 min-w-0" style={{ minHeight: '180px' }}>
                        {data.map((d) => {
                            const totalPct = Math.round((d.total / maxVal) * 100);
                            return (
                                <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 min-w-[18px] group">
                                    {/* Tooltip */}
                                    <div className="hidden group-hover:flex flex-col gap-0.5 absolute z-10 bg-gray-900 text-white text-[11px] rounded-lg p-2 pointer-events-none shadow-lg -translate-y-full mb-1 whitespace-nowrap">
                                        <span className="font-semibold">{d.date}</span>
                                        {STATUS_ORDER.map((s) => d[s] > 0 && (
                                            <span key={s} className="capitalize">{s}: {d[s]}</span>
                                        ))}
                                    </div>

                                    {/* Stacked bar */}
                                    <div className="relative w-full flex flex-col-reverse rounded-t-md overflow-hidden" style={{ height: `${Math.max(totalPct, 3)}%`, minHeight: '4px', maxHeight: '160px' }}>
                                        {STATUS_ORDER.map((s) => {
                                            if (!d[s]) return null;
                                            const pct = Math.round((d[s] / Math.max(d.total, 1)) * 100);
                                            return (
                                                <div
                                                    key={s}
                                                    className={`w-full ${STATUS_COLORS[s]}`}
                                                    style={{ height: `${pct}%` }}
                                                    title={`${s}: ${d[s]}`}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* X label */}
                                    {data.length <= 30 && (
                                        <span className="text-[9px] text-gray-400 mt-1 whitespace-nowrap">{formatLabel(d.date)}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
