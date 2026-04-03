import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../_redux/patient-slice';
import { deletePatientThunk } from '../_redux/patient-thunk';
import { openDrawer } from '../_redux/patient-record-slice';
import { fetchLatestPatientRecordThunk } from '../_redux/patient-record-thunk';
import { openModal as openAppointmentModal } from '../../appointments/_redux/appointment-slice';
import { usePage } from '@inertiajs/react';
import { PencilIcon, TrashIcon, ClipboardDocumentListIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

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

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" /><div className="h-3 bg-gray-200 rounded w-28" /></div></td>
            <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-36" /></td>
            <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-24" /></td>
            <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-20" /></td>
            <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-20" /></td>
            <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-20" /></td>
            <td className="px-4 py-3" />
        </tr>
    );
}

const APPT_STATUS = {
    pending:   { label: 'Pending',   cls: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Confirmed', cls: 'bg-blue-100 text-blue-700'   },
    completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-500'    },
};

function AppointmentBadge({ appointment, showDate = false }) {
    if (!appointment) return <span className="text-gray-300 text-xs">—</span>;
    const cfg = APPT_STATUS[appointment.status] ?? { label: appointment.status, cls: 'bg-gray-100 text-gray-500' };
    const dateStr = showDate && appointment.date
        ? new Date(appointment.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
        : null;
    return (
        <div className="flex flex-col items-start gap-0.5">
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${cfg.cls}`}>
                {cfg.label}
            </span>
            <span className="text-xs text-gray-400">
                {dateStr ? dateStr : (appointment.time ? appointment.time.slice(0, 5) : '')}
                {appointment.doctor_name ? ` · ${appointment.doctor_name}` : ''}
            </span>
        </div>
    );
}

function PatientRow({ patient, isAdmin, canEdit, index }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        if (confirm(`Remove ${patient.name ?? 'this patient'} from the system?`)) {
            dispatch(deletePatientThunk(patient.id));
        }
    };

    const handleOpenProfile = () => dispatch(openDrawer(patient));

    const handleLatestCheckup = (e) => {
        e.stopPropagation();
        dispatch(fetchLatestPatientRecordThunk(patient.id));
    };

    const handleBookAppointment = (e) => {
        e.stopPropagation();
        dispatch(openAppointmentModal({ _prefill: { patient_name: patient.name, user_id: patient.id } }));
    };

    return (
        <tr className="group hover:bg-green-50/40 transition-colors border-t border-gray-100">
            {/* # + Avatar + Name (clickable) */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 font-medium w-5 text-right flex-shrink-0">{index + 1}</span>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(patient.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {initials(patient.name ?? '')}
                    </div>
                    <button
                        onClick={handleOpenProfile}
                        className="text-sm font-semibold text-gray-800 hover:text-green-700 hover:underline truncate max-w-[160px] text-left transition-colors"
                    >
                        {patient.name ?? '—'}
                    </button>
                    {patient.source === 'walkin' && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-orange-100 text-orange-600">
                            Walk-in
                        </span>
                    )}
                </div>
            </td>

            {/* Email */}
            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">
                {patient.email ?? <span className="text-gray-300">—</span>}
            </td>

            {/* Phone */}
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {patient.phone ?? <span className="text-gray-300">—</span>}
            </td>

            {/* Joined */}
            <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                {patient.created_at
                    ? new Date(patient.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
                    : <span className="text-gray-300">—</span>
                }
            </td>

            {/* Today's Appointment */}
            <td className="px-4 py-3">
                <AppointmentBadge appointment={patient.today_appointment ?? null} />
            </td>

            {/* Upcoming Appointment */}
            <td className="px-4 py-3">
                <AppointmentBadge appointment={patient.upcoming_appointment ?? null} showDate />
            </td>

            {/* Actions */}
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Latest checkup — always visible for any role */}
                    <button
                        onClick={handleLatestCheckup}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        title="Latest Checkup"
                    >
                        <ClockIcon className="w-3.5 h-3.5" />
                        Latest
                    </button>
                    {isAdmin && (
                        <button
                            onClick={handleBookAppointment}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                            title="Book Appointment"
                        >
                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                            Book
                        </button>
                    )}
                    {/* Patient records drawer */}
                    <button
                        onClick={handleOpenProfile}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Patient Profile & Records"
                    >
                        <ClipboardDocumentListIcon className="w-4 h-4" />
                    </button>
                    {canEdit && (
                        <button
                            onClick={() => dispatch(openModal(patient))}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Patient"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default function PatientsGridSection() {
    const { patients, filters, loading } = useSelector((s) => s.patients);
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin  = role === 'admin' || role === 'super_admin';
    const canEdit  = isAdmin || role === 'appointment_setter';

    const filtered = (patients || []).filter((p) => {
        const search = (filters.search ?? '').toLowerCase();
        return !search || (p.name ?? '').toLowerCase().includes(search) || (p.email ?? '').toLowerCase().includes(search);
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Today's Appt</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Upcoming Appt</th>
                        <th className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                        : filtered.length === 0
                            ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="font-semibold text-gray-700">No patients found</p>
                                        <p className="text-sm text-gray-400 mt-1">{filters.search ? 'Try adjusting your search' : 'Add a patient to get started'}</p>
                                    </td>
                                </tr>
                            )
                            : filtered.map((p, i) => (
                                <PatientRow key={p.id} patient={p} isAdmin={isAdmin} canEdit={canEdit} index={i} />
                            ))
                    }
                </tbody>
            </table>

            {/* Footer count */}
            {!loading && filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> patient{filtered.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
}
