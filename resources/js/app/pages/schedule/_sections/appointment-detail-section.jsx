import { useDispatch, useSelector } from 'react-redux';
import { closeDetail } from '../_redux/schedule-slice';
import { updateScheduleApptStatusThunk } from '../_redux/schedule-thunk';
import { getWeekEnd } from './header-section';
import { usePage } from '@inertiajs/react';
import {
    XMarkIcon,
    CalendarDaysIcon,
    ClockIcon,
    UserIcon,
    HeartIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const STATUS_STYLES = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS = {
    pending:   'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

function formatTime(time) {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour   = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function AppointmentDetailSection() {
    const dispatch = useDispatch();
    const { detailOpen, selectedAppointment: appt, weekStart, updating } = useSelector((s) => s.schedule);
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';
    const isStaff = isAdmin || role === 'appointment_setter';

    const weekEnd = getWeekEnd(weekStart);

    const handleStatus = (newStatus) => {
        if (!appt) return;
        dispatch(updateScheduleApptStatusThunk({
            id: appt.id,
            status: newStatus,
            date_from: weekStart,
            date_to: weekEnd,
        }));
        dispatch(closeDetail());
    };

    return (
        <>
            {/* Backdrop */}
            {detailOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                    onClick={() => dispatch(closeDetail())}
                />
            )}

            {/* Slide-in panel */}
            <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${detailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Appointment Details</h3>
                    <button
                        onClick={() => dispatch(closeDetail())}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                {appt && (
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                        {/* Status */}
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${STATUS_STYLES[appt.status]}`}>
                            {STATUS_LABELS[appt.status]}
                        </span>

                        {/* Patient */}
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Patient</p>
                                <p className="text-sm font-semibold text-gray-800">{appt.patient_name || '—'}</p>
                            </div>
                        </div>

                        {/* Service */}
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <HeartIcon className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Service</p>
                                <p className="text-sm font-semibold text-gray-800">{appt.service}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Dr. {appt.doctor_name}</p>
                            </div>
                        </div>

                        {/* Date + Time */}
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Date & Time</p>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(appt.date)}</p>
                                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {formatTime(appt.time)}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {appt.notes && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Notes</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{appt.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions (staff only) */}
                {appt && isStaff && appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                        {appt.status === 'pending' && (
                            <button
                                onClick={() => handleStatus('confirmed')}
                                disabled={updating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60"
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                Confirm Appointment
                            </button>
                        )}
                        {appt.status === 'confirmed' && (
                            <button
                                onClick={() => handleStatus('completed')}
                                disabled={updating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60"
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                Mark as Completed
                            </button>
                        )}
                        <button
                            onClick={() => handleStatus('cancelled')}
                            disabled={updating}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-60"
                        >
                            <XCircleIcon className="w-4 h-4" />
                            Cancel Appointment
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
