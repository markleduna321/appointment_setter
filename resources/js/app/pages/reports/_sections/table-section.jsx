import { useSelector } from 'react-redux';

export default function TableSection() {
    const { summary, loading } = useSelector((s) => s.reports);
    const { by_doctor = [] } = summary || {};

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">Top Doctors</h2>
                <span className="text-xs text-gray-400">Top 10</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-5 py-3">#</th>
                            <th className="px-5 py-3">Doctor</th>
                            <th className="px-5 py-3 text-right">Appointments</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 3 }).map((__, j) => (
                                        <td key={j} className="px-5 py-3.5">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : by_doctor.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-5 py-14 text-center text-sm text-gray-400">No data</td>
                            </tr>
                        ) : (
                            by_doctor.map((d, i) => (
                                <tr key={d.doctor_name} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                                    <td className="px-5 py-3.5 font-medium text-gray-800">{d.doctor_name}</td>
                                    <td className="px-5 py-3.5 text-right text-gray-600 font-semibold">{d.count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
