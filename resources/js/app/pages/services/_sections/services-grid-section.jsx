import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../_redux/service-slice';
import { deleteServiceThunk } from '../_redux/service-thunk';
import { usePage } from '@inertiajs/react';
import { PencilIcon, TrashIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { getServiceIcon } from '../../../utils/service-icons';

const CATEGORY_COLORS = {
    'Consultation': 'bg-blue-100 text-blue-700',
    'Diagnostic':   'bg-cyan-100 text-cyan-700',
    'Dental':       'bg-pink-100 text-pink-700',
    'Eye Care':     'bg-indigo-100 text-indigo-700',
    'Laboratory':   'bg-amber-100 text-amber-700',
    'Procedure':    'bg-orange-100 text-orange-700',
    'Therapy':      'bg-teal-100 text-teal-700',
    'Vaccination':  'bg-green-100 text-green-700',
};

function formatDuration(mins) {
    if (!mins) return '—';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price ?? 0);
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
        </div>
    );
}

function ServiceCard({ service, isAdmin }) {
    const dispatch = useDispatch();
    const { emoji, bg } = getServiceIcon(service.category);

    const handleDelete = () => {
        if (confirm(`Delete service "${service.name}"?`)) {
            dispatch(deleteServiceThunk(service.id));
        }
    };

    const catColor = CATEGORY_COLORS[service.category] ?? 'bg-gray-100 text-gray-600';

    return (
        <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 ${service.status === 'inactive' ? 'opacity-60 border-gray-200' : 'border-gray-100'}`}>
            {/* Header */}
            <div className="flex items-start gap-4">
                {/* Emoji icon */}
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {emoji}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-gray-900 text-sm leading-snug">{service.name}</p>
                        {isAdmin && (
                            <div className="flex gap-1 flex-shrink-0">
                                <button
                                    onClick={() => dispatch(openModal(service))}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                    title="Edit"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {service.description && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{service.description}</p>
                    )}

                    {/* Duration chip */}
                    <span className="inline-block mt-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {formatDuration(service.duration)}
                    </span>
                </div>
            </div>

            {/* Footer: category badge + price (admin) */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${catColor}`}>
                        {service.category}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${service.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {service.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                        <TagIcon className="w-3.5 h-3.5 text-gray-400" />
                        {formatPrice(service.price)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ServicesGridSection() {
    const { services, filters, loading } = useSelector((s) => s.services);
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';

    const filtered = services.filter((s) => {
        const search = (filters.search ?? '').toLowerCase();
        const matchSearch = !search || s.name?.toLowerCase().includes(search) || s.description?.toLowerCase().includes(search);
        const matchCat    = !filters.category || s.category === filters.category;
        const matchStatus = !filters.status || filters.status === 'all' || s.status === filters.status;
        return matchSearch && matchCat && matchStatus;
    });

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                </div>
                <p className="font-semibold text-gray-700">No services found</p>
                <p className="text-sm text-gray-400 mt-1">
                    {filters.search || filters.category || filters.status !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Add a service to get started'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((svc) => (
                <ServiceCard key={svc.id} service={svc} isAdmin={isAdmin} />
            ))}
        </div>
    );
}
