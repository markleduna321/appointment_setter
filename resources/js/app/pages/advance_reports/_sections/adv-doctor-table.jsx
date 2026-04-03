import { useSelector } from 'react-redux';

function CompletionBar({ rate }) {
    const color = rate >= 75 ? 'bg-emerald-400' : rate >= 50 ? 'bg-amber-400' : 'bg-red-400';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${rate}%` }} />
            </div>
            <span className="text-xs font-semibold text-gray-700 w-10 text-right">{rate}%</span>
        </div>
    );
}

export default function AdvDoctorTable() {
    const { by_doctor, loading } = useSelector((s) => s.advanceReports);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">Doctor Performance</h2>
                <span className="text-xs text-gray-400">{by_doctor.length} doctors</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3">Doctor</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-right">Done</th>
                            <th className="px-4 py-3 text-right">Cxl</th>
                            <th className="px-4 py-3 min-w-[120px]">Completion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 5 }).map((__, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : by_doctor.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">No data</td>
                            </tr>
                        ) : (
                            by_doctor.map((d) => (
                                <tr key={d.doctor_name} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[140px]">{d.doctor_name}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 font-semibold">{d.total}</td>
                                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{d.completed}</td>
                                    <td className="px-4 py-3 text-right text-red-400 font-medium">{d.cancelled}</td>
                                    <td className="px-4 py-3">
                                        <CompletionBar rate={d.completion_rate} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
