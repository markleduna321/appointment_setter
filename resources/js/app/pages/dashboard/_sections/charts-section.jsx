import { useSelector } from 'react-redux';

export default function ChartsSection() {
    const { quick_stats, loading } = useSelector((state) => state.dashboard);
    const { appointments_this_week = [0,0,0,0,0,0,0], days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] } = quick_stats;

    const max = Math.max(...appointments_this_week, 1);
    const total = appointments_this_week.reduce((a, b) => a + b, 0);

    // Specialty distribution: compute percentages from quick_stats.specialties when available
    const RAW_SPECIALTIES = quick_stats?.specialties || [];
    const COLOR_PALETTE = ['bg-blue-500', 'bg-rose-400', 'bg-cyan-400', 'bg-violet-400', 'bg-emerald-400', 'bg-yellow-400'];

    let specialties;
    if (RAW_SPECIALTIES.length > 0) {
        const totalCount = RAW_SPECIALTIES.reduce((s, r) => s + (r.count || 0), 0) || 1;
        specialties = RAW_SPECIALTIES.map((r, i) => ({
            label: r.label,
            value: Math.round(((r.count || 0) / totalCount) * 100),
            color: COLOR_PALETTE[i % COLOR_PALETTE.length],
        }));
    } else {
        specialties = [];
    }

    return (
        <div className="grid sm:grid-cols-2 gap-5">
            {/* Weekly Appointment Bar Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">Weekly Appointments</h3>
                        <p className="text-xs text-gray-400 mt-0.5">This week • {total} total</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full">
                        Week View
                    </span>
                </div>

                {loading ? (
                    <div className="h-32 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="flex items-end gap-2 h-32">
                        {appointments_this_week.map((val, i) => {
                            const heightPct = Math.round((val / max) * 100);
                            const today = new Date().getDay();
                            // Sunday=0, so Mon=1..Sun=0; map index 0=Mon..6=Sun
                            const isToday = (i + 1) % 7 === today;
                            return (
                                <div key={days[i]} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-gray-400 font-medium">{val || ''}</span>
                                    <div className="w-full flex items-end" style={{ height: '80px' }}>
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 ${
                                                isToday
                                                    ? 'bg-gradient-to-t from-blue-600 to-cyan-400'
                                                    : 'bg-blue-100 hover:bg-blue-200'
                                            }`}
                                            style={{ height: `${Math.max(heightPct, 4)}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-semibold ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {days[i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Specialty Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">By Specialty</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Appointment distribution</p>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-3 py-1 rounded-full">
                        All Time
                    </span>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="h-32 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : specialties.length === 0 ? (
                        <div className="h-24 flex items-center justify-center text-sm text-gray-400">
                            No specialty data
                        </div>
                    ) : (
                        specialties.map((s) => (
                            <div key={s.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-600">{s.label}</span>
                                    <span className="text-xs text-gray-400">{s.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${s.color} rounded-full transition-all duration-700`}
                                        style={{ width: `${s.value}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {specialties.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {specialties.map((s) => (
                            <div key={s.label} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                                <span className="text-[11px] text-gray-500">{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
