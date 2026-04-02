import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../_redux/report-slice';
import { fetchReportsSummaryThunk } from '../_redux/report-thunk';

export default function FiltersSection() {
    const dispatch = useDispatch();
    const { filters } = useSelector((s) => s.reports);

    const setDays = (days) => {
        dispatch(setFilters({ days }));
        dispatch(fetchReportsSummaryThunk({ days }));
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Range:</span>
                <div className="flex gap-2">
                    {[7,14,30].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filters.days === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {d}d
                        </button>
                    ))}
                </div>
            </div>
            <div className="text-xs text-gray-500">Data is live • auto-updates</div>
        </div>
    );
}
