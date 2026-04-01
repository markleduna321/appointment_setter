import { useDispatch, useSelector } from 'react-redux';
import { usePage } from '@inertiajs/react';
import { openModal, setPage } from '../_redux/appointment-slice';
import { cancelAppointmentThunk } from '../_redux/appointment-thunk';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Returns true if there are MORE than 3 hours left before the appointment.
 */
function canCancelByTime(date, time) {
    if (!date || !time) return false;
    const appointmentMs = new Date(`${date}T${time}`).getTime();
    const nowMs = Date.now();
    return (appointmentMs - nowMs) > 3 * 60 * 60 * 1000;
}

const DEMO_APPOINTMENTS = [
    { id: 1, patient_name: 'Maria Santos',      doctor_name: 'Dr. Juan Dela Cruz', service: 'General Consultation', date: '2026-04-01', time: '09:00', status: 'confirmed', notes: '' },
    { id: 2, patient_name: 'Pedro Reyes',       doctor_name: 'Dr. Ana Garcia',     service: 'Dental Check-up',      date: '2026-04-01', time: '10:30', status: 'pending',   notes: 'Follow-up visit' },
    { id: 3, patient_name: 'Lila Cruz',         doctor_name: 'Dr. Jose Ramos',     service: 'Eye Examination',      date: '2026-04-02', time: '14:00', status: 'completed', notes: '' },
    { id: 4, patient_name: 'Carlos Delos Reyes',doctor_name: 'Dr. Maria Lim',      service: 'Cardiology',           date: '2026-04-03', time: '08:00', status: 'cancelled', notes: 'Patient requested reschedule' },
    { id: 5, patient_name: 'Sofia Mendoza',     doctor_name: 'Dr. Juan Dela Cruz', service: 'General Consultation', date: '2026-04-03', time: '11:00', status: 'pending',   notes: '' },
    { id: 6, patient_name: 'Ramon Villanueva',  doctor_name: 'Dr. Roberto Santos', service: 'Orthopedics',          date: '2026-04-04', time: '13:00', status: 'confirmed', notes: 'Post-surgery follow-up' },
    { id: 7, patient_name: 'Joy Aquino',        doctor_name: 'Dr. Ana Garcia',     service: 'OB-GYN',               date: '2026-04-04', time: '15:30', status: 'pending',   notes: '' },
];

const STATUS_STYLE = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
}

export default function AppointmentsTableSection() {
    const dispatch = useDispatch();
    const { appointments, filters, pagination, loading, submitting } = useSelector((s) => s.appointments);
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isPatient = role === 'patient';
    const authUser  = auth?.user;

    // Patients only see their own appointments (matched by name or user_id)
    const ownedAppointments = isPatient
        ? appointments.filter((a) => {
              if (a.user_id && authUser?.id) return a.user_id === authUser.id;
              // Fallback: name match (demo data)
              return a.patient_name?.toLowerCase() === authUser?.name?.toLowerCase();
          })
        : appointments;

    const source = ownedAppointments.length > 0 ? ownedAppointments : (isPatient ? [] : DEMO_APPOINTMENTS);

    const filtered = source.filter((a) => {
        const search = filters.search.toLowerCase();
        const matchSearch =
            !search ||
            a.patient_name.toLowerCase().includes(search) ||
            a.doctor_name.toLowerCase().includes(search) ||
            a.service.toLowerCase().includes(search);
        const matchStatus = filters.status === 'all' || a.status === filters.status;
        const matchDate   = !filters.date || a.date === filters.date;
        return matchSearch && matchStatus && matchDate;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.perPage));
    const start      = (pagination.page - 1) * pagination.perPage;
    const paged      = filtered.slice(start, start + pagination.perPage);

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            dispatch(cancelAppointmentThunk(id));
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800">Appointment List</h2>
                <span className="text-xs text-gray-400">
                    {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-5 py-3">#</th>
                            {!isPatient && <th className="px-5 py-3">Patient</th>}
                            <th className="px-5 py-3">Doctor</th>
                            <th className="px-5 py-3">Service</th>
                            <th className="px-5 py-3 whitespace-nowrap">Date & Time</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 7 }).map((__, j) => (
                                        <td key={j} className="px-5 py-3.5">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paged.length === 0 ? (
                            <tr>
                                <td colSpan={isPatient ? 6 : 7} className="px-5 py-14 text-center text-sm text-gray-400">
                                    {isPatient ? 'You have no appointments yet.' : 'No appointments found.'}
                                </td>
                            </tr>
                        ) : (
                            paged.map((appt, idx) => {
                                const canCancel =
                                    appt.status !== 'cancelled' &&
                                    appt.status !== 'completed' &&
                                    (!isPatient || canCancelByTime(appt.date, appt.time));

                                const cancelDisabledReason =
                                    isPatient &&
                                    appt.status !== 'cancelled' &&
                                    appt.status !== 'completed' &&
                                    !canCancelByTime(appt.date, appt.time)
                                        ? 'Cancellation is only allowed more than 3 hours before the appointment.'
                                        : null;

                                return (
                                    <tr key={appt.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3.5 text-gray-400 text-xs">{start + idx + 1}</td>
                                        {!isPatient && (
                                            <td className="px-5 py-3.5 font-medium text-gray-800">{appt.patient_name}</td>
                                        )}
                                        <td className="px-5 py-3.5 text-gray-600">{appt.doctor_name}</td>
                                        <td className="px-5 py-3.5 text-gray-600">{appt.service}</td>
                                        <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                                            {appt.date}
                                            <span className="ml-1.5 text-xs text-gray-400">{formatTime(appt.time)}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[appt.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Edit — admin/staff only */}
                                                {!isPatient && (
                                                    <button
                                                        title="Edit"
                                                        onClick={() => dispatch(openModal(appt))}
                                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {/* Cancel */}
                                                {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                                    <button
                                                        title={cancelDisabledReason ?? 'Cancel appointment'}
                                                        disabled={submitting || !canCancel}
                                                        onClick={() => canCancel && handleCancel(appt.id)}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            canCancel
                                                                ? 'text-red-500 hover:bg-red-50'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                        } disabled:opacity-40`}
                                                    >
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <span>Page {pagination.page} of {totalPages}</span>
                    <div className="flex gap-1.5">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => dispatch(setPage(pagination.page - 1))}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors font-semibold"
                        >
                            Prev
                        </button>
                        <button
                            disabled={pagination.page >= totalPages}
                            onClick={() => dispatch(setPage(pagination.page + 1))}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors font-semibold"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
