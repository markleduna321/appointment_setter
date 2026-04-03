import { useDispatch, useSelector } from 'react-redux';
import { setAdvFilters } from '../_redux/advance-report-slice';
import { fetchAdvancedReportThunk } from '../_redux/advance-report-thunk';
import { FunnelIcon } from '@heroicons/react/24/outline';

const PRESETS = [
    { label: '7d',  days: 7 },
    { label: '14d', days: 14 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
];

function toISO(d) { return d.toISOString().slice(0, 10); }

export default function AdvFiltersSection() {
    const dispatch = useDispatch();
    const { filters, doctors } = useSelector((s) => s.advanceReports);

    function applyFilters(patch) {
        const next = { ...filters, ...patch };
        dispatch(setAdvFilters(patch));
        dispatch(fetchAdvancedReportThunk({
            date_from: next.date_from,
            date_to:   next.date_to,
            doctor:    next.doctor || undefined,
        }));
    }

    function selectPreset(days) {
        const end   = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        applyFilters({ date_from: toISO(start), date_to: toISO(end), _preset: days });
    }

    function isPresetActive(days) {
        const end   = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        return filters.date_from === toISO(start) && filters.date_to === toISO(end);
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
            <div className="flex flex-wrap items-center gap-4">
                {/* Preset buttons */}
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex gap-1.5">
                        {PRESETS.map(({ label, days }) => (
                            <button
                                key={days}
                                onClick={() => selectPreset(days)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${isPresetActive(days) ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom date range */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">From</span>
                    <input
                        type="date"
                        value={filters.date_from}
                        max={filters.date_to}
                        onChange={(e) => applyFilters({ date_from: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                    <span className="font-semibold text-gray-700">To</span>
                    <input
                        type="date"
                        value={filters.date_to}
                        min={filters.date_from}
                        onChange={(e) => applyFilters({ date_to: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                </div>

                {/* Doctor filter */}
                {doctors.length > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs font-semibold text-gray-700">Doctor</span>
                        <select
                            value={filters.doctor}
                            onChange={(e) => applyFilters({ doctor: e.target.value })}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 max-w-[180px]"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}
