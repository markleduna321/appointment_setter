import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../_redux/patient-slice';
import { deletePatientThunk } from '../_redux/patient-thunk';
import { usePage } from '@inertiajs/react';
import { PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

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

function PatientCard({ patient, isAdmin }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        if (confirm(`Remove ${patient.name ?? 'this patient'} from the system?`)) {
            dispatch(deletePatientThunk(patient.id));
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradient(patient.name)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {initials(patient.name ?? '')}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{patient.name ?? '—'}</p>
                    {patient.email && <p className="text-xs text-gray-500 mt-0.5 truncate">{patient.email}</p>}
                    {patient.phone && <p className="text-xs text-gray-400 mt-1">{patient.phone}</p>}
                </div>
                {isAdmin && (
                    <div className="flex gap-1 flex-shrink-0">
                        <button
                            onClick={() => dispatch(openModal(patient))}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
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

            <div className="space-y-1">
                {patient.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <EnvelopeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{patient.email}</span>
                    </div>
                )}
                {patient.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{patient.phone}</span>
                    </div>
                )}
            </div>

            {patient.notes && (
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{patient.notes}</p>
            )}
        </div>
    );
}

export default function PatientsGridSection() {
    const { patients, filters, loading } = useSelector((s) => s.patients);
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';

    const filtered = (patients || []).filter((p) => {
        const search = (filters.search ?? '').toLowerCase();
        return !search || (p.name ?? '').toLowerCase().includes(search) || (p.email ?? '').toLowerCase().includes(search);
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
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <p className="font-semibold text-gray-700">No patients found</p>
                <p className="text-sm text-gray-400 mt-1">{filters.search ? 'Try adjusting your search' : 'Add a patient to get started'}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
                <PatientCard key={p.id} patient={p} isAdmin={isAdmin} />
            ))}
        </div>
    );
}
