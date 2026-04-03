import { useSelector } from 'react-redux';
import { ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function AdvHeaderSection() {
    const { by_date, by_doctor, by_service, by_status, by_source, kpi, filters } = useSelector((s) => s.advanceReports);

    function exportCSV() {
        const rows = [
            ['Advanced Report Export'],
            [`Date Range: ${filters.date_from} to ${filters.date_to}`],
            [],
            ['=== KPI Summary ==='],
            ['Metric', 'Value'],
            ['Total Appointments', kpi.total],
            ['Completed', kpi.completed],
            ['Confirmed', kpi.confirmed],
            ['Pending', kpi.pending],
            ['Cancelled', kpi.cancelled],
            ['Completion Rate (%)', kpi.completion_rate],
            ['Avg Per Day', kpi.avg_per_day],
            ['Unique Patients', kpi.unique_patients],
            [],
            ['=== Daily Trend ==='],
            ['Date', 'Total', 'Completed', 'Confirmed', 'Pending', 'Cancelled'],
            ...by_date.map((r) => [r.date, r.total, r.completed, r.confirmed, r.pending, r.cancelled]),
            [],
            ['=== Doctor Performance ==='],
            ['Doctor', 'Total', 'Completed', 'Confirmed', 'Pending', 'Cancelled', 'Completion Rate (%)'],
            ...by_doctor.map((r) => [r.doctor_name, r.total, r.completed, r.confirmed, r.pending, r.cancelled, r.completion_rate]),
            [],
            ['=== Service Breakdown ==='],
            ['Service', 'Total', 'Completed'],
            ...by_service.map((r) => [r.service, r.total, r.completed]),
            [],
            ['=== Status Distribution ==='],
            ['Status', 'Count'],
            ...by_status.map((r) => [r.status, r.count]),
            [],
            ['=== Source Breakdown ==='],
            ['Source', 'Count'],
            ...by_source.map((r) => [r.source, r.count]),
        ];

        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `advanced-report-${filters.date_from}-to-${filters.date_to}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100">
                    <ChartBarSquareIcon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Advanced Reports</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Deep analytics — doctor performance, trends, service breakdown.</p>
                </div>
            </div>
            <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors"
            >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export CSV
            </button>
        </div>
    );
}
