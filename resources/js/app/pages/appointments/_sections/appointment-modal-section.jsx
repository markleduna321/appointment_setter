import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../_redux/appointment-slice';
import { createAppointmentThunk, updateAppointmentThunk } from '../_redux/appointment-thunk';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DOCTORS = [
    'Dr. Juan Dela Cruz',
    'Dr. Ana Garcia',
    'Dr. Jose Ramos',
    'Dr. Maria Lim',
    'Dr. Roberto Santos',
];

const SERVICES = [
    'General Consultation',
    'Dental Check-up',
    'Eye Examination',
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Orthopedics',
    'OB-GYN',
];

const EMPTY_FORM = {
    patient_name: '',
    doctor_name:  '',
    service:      '',
    date:         '',
    time:         '',
    status:       'pending',
    notes:        '',
};

const INPUT_CLASS =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition';

export default function AppointmentModalSection() {
    const dispatch = useDispatch();
    const { modalOpen, selectedAppointment, submitting, error } = useSelector((s) => s.appointments);

    const [form, setForm]         = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState({});
    const isEditing               = !!selectedAppointment;

    useEffect(() => {
        if (selectedAppointment) {
            setForm({
                patient_name: selectedAppointment.patient_name ?? '',
                doctor_name:  selectedAppointment.doctor_name  ?? '',
                service:      selectedAppointment.service      ?? '',
                date:         selectedAppointment.date         ?? '',
                time:         selectedAppointment.time         ?? '',
                status:       selectedAppointment.status       ?? 'pending',
                notes:        selectedAppointment.notes        ?? '',
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setFormErrors({});
    }, [selectedAppointment, modalOpen]);

    const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const validate = () => {
        const errs = {};
        if (!form.patient_name.trim()) errs.patient_name = 'Required';
        if (!form.doctor_name)         errs.doctor_name  = 'Required';
        if (!form.service)             errs.service      = 'Required';
        if (!form.date)                errs.date         = 'Required';
        if (!form.time)                errs.time         = 'Required';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
        if (isEditing) {
            dispatch(updateAppointmentThunk({ id: selectedAppointment.id, data: form }));
        } else {
            dispatch(createAppointmentThunk(form));
        }
    };

    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => !submitting && dispatch(closeModal())}
            />

            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-800">
                        {isEditing ? 'Edit Appointment' : 'New Appointment'}
                    </h2>
                    <button
                        onClick={() => dispatch(closeModal())}
                        disabled={submitting}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors disabled:opacity-50"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    {/* Patient Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Patient Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.patient_name}
                            onChange={(e) => field('patient_name', e.target.value)}
                            placeholder="Full name"
                            className={INPUT_CLASS}
                        />
                        {formErrors.patient_name && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.patient_name}</p>
                        )}
                    </div>

                    {/* Doctor */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Doctor <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.doctor_name}
                            onChange={(e) => field('doctor_name', e.target.value)}
                            className={INPUT_CLASS}
                        >
                            <option value="">Select doctor</option>
                            {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {formErrors.doctor_name && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.doctor_name}</p>
                        )}
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.service}
                            onChange={(e) => field('service', e.target.value)}
                            className={INPUT_CLASS}
                        >
                            <option value="">Select service</option>
                            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {formErrors.service && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.service}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => field('date', e.target.value)}
                                className={INPUT_CLASS}
                            />
                            {formErrors.date && (
                                <p className="text-xs text-red-500 mt-0.5">{formErrors.date}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={(e) => field('time', e.target.value)}
                                className={INPUT_CLASS}
                            />
                            {formErrors.time && (
                                <p className="text-xs text-red-500 mt-0.5">{formErrors.time}</p>
                            )}
                        </div>
                    </div>

                    {/* Status (edit only) */}
                    {isEditing && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => field('status', e.target.value)}
                                className={INPUT_CLASS}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => field('notes', e.target.value)}
                            rows={3}
                            placeholder="Optional notes..."
                            className={`${INPUT_CLASS} resize-none`}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => dispatch(closeModal())}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting && (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            {submitting ? 'Saving…' : isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
