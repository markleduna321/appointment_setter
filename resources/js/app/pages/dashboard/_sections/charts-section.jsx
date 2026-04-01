import { useSelector } from 'react-redux';

export default function ChartsSection() {
    const { quick_stats, loading } = useSelector((state) => state.dashboard);
    const { appointments_this_week = [0,0,0,0,0,0,0], days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] } = quick_stats;

    const max = Math.max(...appointments_this_week, 1);
    const total = appointments_this_week.reduce((a, b) => a + b, 0);

    // Specialty distribution (demo until real data arrives)
    const specialties = [
        { label: 'General',     value: 40, color: 'bg-blue-500' },
        { label: 'Cardiology',  value: 25, color: 'bg-rose-400' },
        { label: 'Dental',      value: 20, color: 'bg-cyan-400' },
        { label: 'Mental Health', value: 15, color: 'bg-violet-400' },
    ];

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
                    {specialties.map((s) => (
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
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    {specialties.map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${s.color}`} />
                            <span className="text-[11px] text-gray-500">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
