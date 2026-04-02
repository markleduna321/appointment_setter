import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../_redux/patient-slice';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FiltersSection() {
    const dispatch = useDispatch();
    const { filters } = useSelector((s) => s.patients);

    const hasActive = filters.search;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                        placeholder="Search patients by name or email…"
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                    />
                </div>

                {/* Clear */}
                {hasActive && (
                    <button
                        onClick={() => dispatch(setFilters({ search: '' }))}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
