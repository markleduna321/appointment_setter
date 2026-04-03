import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../_redux/doctor-slice';
import { deleteDoctorThunk } from '../_redux/doctor-thunk';
import { usePage } from '@inertiajs/react';
import { PencilIcon, TrashIcon, CalendarDaysIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STATUS_STYLES = {
    available:   'bg-emerald-100 text-emerald-700',
    unavailable: 'bg-amber-100 text-amberald-700',
    on_leave:    'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
    available:   'Available',
    unavailable: 'Unavailable',
    on_leave:    'On Leave',
};

const AVATAR_GRADIENTS = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-600',
    'from-teal-400 to-cyan-600',
    'from-orange-400 to-red-500',
    'from-green-400 to-emerald-600',
    'from-yellow-400 to-amber-600',
];

function avatarGradient(name = '') {
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function initials(name = '') {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gray-200" />
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

function DoctorCard({ doctor, isAdmin }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        if (confirm(`Remove Dr. ${doctor.name} from the system?`)) {
            dispatch(deleteDoctorThunk(doctor.id));
        }
    };

    const scheduleDays = Array.isArray(doctor.schedule_days) ? doctor.schedule_days : [];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-start gap-4">
                {doctor.photo
                    ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
                        </div>
                    )
                    : (
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradient(doctor.name)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                            {initials(doctor.name)}
                        </div>
                    )
                }
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">Dr. {doctor.name}</p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5 truncate">{doctor.specialty}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full font-semibold ${STATUS_STYLES[doctor.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[doctor.status] ?? doctor.status}
                    </span>
                </div>
                {isAdmin && (
                    <div className="flex gap-1 flex-shrink-0">
                        <button
                            onClick={() => dispatch(openModal(doctor))}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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

            {/* Schedule */}
            {scheduleDays.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <div className="flex gap-1 flex-wrap">
                        {DAY_LABELS.map((day) => (
                            <span
                                key={day}
                                className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    scheduleDays.includes(day)
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-300'
                                }`}
                            >
                                {day}
                            </span>
                        ))}
                    </div>
                    {doctor.schedule_start && doctor.schedule_end && (
                        <span className="text-xs text-gray-400 ml-1">{doctor.schedule_start} – {doctor.schedule_end}</span>
                    )}
                </div>
            )}

            {/* Contact */}
            <div className="space-y-1">
                {doctor.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <EnvelopeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{doctor.email}</span>
                    </div>
                )}
                {doctor.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{doctor.phone}</span>
                    </div>
                )}
            </div>

            {/* Bio */}
            {doctor.bio && (
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{doctor.bio}</p>
            )}
        </div>
    );
}

export default function DoctorsGridSection() {
    const { doctors, filters, loading } = useSelector((s) => s.doctors);
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'super_admin';

    const filtered = doctors.filter((d) => {
        const search = (filters.search ?? '').toLowerCase();
        const matchSearch = !search || d.name?.toLowerCase().includes(search) || d.specialty?.toLowerCase().includes(search);
        const matchSpec = !filters.specialty || d.specialty === filters.specialty;
        const matchStatus = !filters.status || filters.status === 'all' || d.status === filters.status;
        return matchSearch && matchSpec && matchStatus;
    });

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (!loading && filtered.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <p className="font-semibold text-gray-700">No doctors found</p>
                <p className="text-sm text-gray-400 mt-1">
                    {filters.search || filters.specialty || filters.status !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Add a doctor to get started'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} isAdmin={isAdmin} />
            ))}
        </div>
    );
}
