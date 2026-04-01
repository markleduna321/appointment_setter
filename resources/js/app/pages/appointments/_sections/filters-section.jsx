import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../_redux/appointment-slice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const STATUS_TABS = [
    { value: 'all',       label: 'All' },
    { value: 'pending',   label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function FiltersSection() {
    const dispatch = useDispatch();
    const { filters } = useSelector((s) => s.appointments);
    const searchTimer = useRef(null);

    const handleSearch = (e) => {
        const value = e.target.value;
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => dispatch(setFilters({ search: value })), 350);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search patient or doctor..."
                        defaultValue={filters.search}
                        onChange={handleSearch}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                    />
                </div>

                {/* Date filter */}
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => dispatch(setFilters({ date: e.target.value }))}
                    className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />

                {/* Clear filters */}
                {(filters.search || filters.date || filters.status !== 'all') && (
                    <button
                        onClick={() => dispatch(setFilters({ search: '', date: '', status: 'all' }))}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1.5 mt-3">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => dispatch(setFilters({ status: tab.value }))}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            filters.status === tab.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
