import { useSelector } from 'react-redux';

export default function ChartsSection() {
    const { summary, loading } = useSelector((s) => s.reports);
    const { by_date = [], labels = [] } = summary || {};

    const max = Math.max(...by_date.map((r) => r.count), 1);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">Appointments Over Time</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Last {labels.length} days</p>
                </div>
            </div>

            {loading ? (
                <div className="h-36 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex items-end gap-2 h-36">
                    {by_date.map((d) => {
                        const pct = Math.round((d.count / Math.max(max, 1)) * 100);
                        return (
                            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[11px] text-gray-500">{d.count || ''}</span>
                                <div className="w-full flex items-end" style={{ height: '220px' }}>
                                    <div
                                        className="w-full rounded-t-lg bg-indigo-100 hover:bg-indigo-200 transition-all"
                                        style={{ height: `${Math.max(pct, 4)}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 truncate">{d.date}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
