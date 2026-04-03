import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../_redux/service-slice';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const CATEGORIES = [
    'Cardiology',
    'Consultation',
    'Dental',
    'Dermatology',
    'Diagnostic',
    'Eye Care',
    'General Practice',
    'Laboratory',
    'OB-GYN',
    'Orthopedics',
    'Pediatrics',
    'Procedure',
    'Psychiatry',
    'Radiology',
    'Therapy',
    'Vaccination',
];

const STATUS_TABS = [
    { value: 'all',      label: 'All' },
    { value: 'active',   label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export default function FiltersSection() {
    const dispatch = useDispatch();
    const { filters } = useSelector((s) => s.services);

    const hasActive = filters.search || filters.category || filters.status !== 'all';

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
                        placeholder="Search services…"
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
                    />
                </div>

                {/* Category */}
                <select
                    value={filters.category}
                    onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
                    className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Clear */}
                {hasActive && (
                    <button
                        onClick={() => dispatch(setFilters({ search: '', category: '', status: 'all' }))}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}
            </div>

            {/* Status tabs */}
            <div className="flex gap-1 mt-3">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => dispatch(setFilters({ status: tab.value }))}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            filters.status === tab.value
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
