import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../_redux/appointment-slice';
import { createAppointmentThunk, updateAppointmentThunk } from '../_redux/appointment-thunk';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

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
    const [prefillUserId, setPrefillUserId] = useState(null);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const isEditing               = !!(selectedAppointment && !selectedAppointment._prefill);

    useEffect(() => {
        if (selectedAppointment?._prefill) {
            // Pre-fill from patient profile "Book Appointment" button
            setForm({ ...EMPTY_FORM, patient_name: selectedAppointment._prefill.patient_name ?? '' });
            setPrefillUserId(selectedAppointment._prefill.user_id ?? null);
        } else if (selectedAppointment) {
            setForm({
                patient_name: selectedAppointment.patient_name ?? '',
                doctor_name:  selectedAppointment.doctor_name  ?? '',
                service:      selectedAppointment.service      ?? '',
                date:         selectedAppointment.date         ?? '',
                // normalise HH:MM:SS (DB) → HH:MM
                time:         (selectedAppointment.time ?? '').slice(0, 5),
                status:       selectedAppointment.status       ?? 'pending',
                notes:        selectedAppointment.notes        ?? '',
            });
            setPrefillUserId(null);
        } else {
            setForm(EMPTY_FORM);
            setPrefillUserId(null);
        }
        setFormErrors({});
    }, [selectedAppointment, modalOpen]);

    // Fetch services when modal opens
    useEffect(() => {
        if (!modalOpen) return;
        let mounted = true;
        (async () => {
            setServicesLoading(true);
            try {
                const res = await axios.get('/api/services', { params: { status: 'active' } });
                const list = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
                if (mounted) setServices(list);
            } catch (e) {
                if (mounted) setServices([]);
            } finally { if (mounted) setServicesLoading(false); }
        })();
        return () => { mounted = false; };
    }, [modalOpen]);

    // Helper: generate time slots from schedule window
    function generateSlots(start, end) {
        const DEFAULT_SLOTS = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30',
        ];
        if (!start || !end) return DEFAULT_SLOTS;
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        let cur = sh * 60 + sm;
        const endMin = eh * 60 + em;
        const slots = [];
        while (cur < endMin) {
            const h = Math.floor(cur / 60);
            const m = cur % 60;
            if (h !== 12) slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            cur += 30;
        }
        return slots;
    }

    function formatTime(t) {
        if (!t) return '';
        const [h, m] = t.split(':');
        const hour = parseInt(h, 10);
        return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    }

    // Fetch doctors: either all available or filtered by service category
    const fetchDoctors = useCallback(async (category = '') => {
        setDoctorsLoading(true);
        try {
            const params = { status: 'available' };
            if (category) params.specialty = category;
            const res = await axios.get('/api/doctors', { params });
            const list = res.data?.data ?? res.data ?? [];
            setDoctors(list);
        } catch (e) {
            setDoctors([]);
        } finally { setDoctorsLoading(false); }
    }, []);

    // When the selected service changes, fetch doctors for that category
    useEffect(() => {
        if (!modalOpen) return;
        const svc = services.find((s) => s.name === form.service);
        const category = svc?.category ?? '';
        fetchDoctors(category);
    }, [form.service, services, modalOpen, fetchDoctors]);

    // Fetch booked slots when doctor + date selected
    useEffect(() => {
        let mounted = true;
        const fetchBooked = async (doctorName, date) => {
            setSlotsLoading(true);
            try {
                const params = { doctor_name: doctorName, date };
                // Exclude this appointment's own slot so it is not greyed out during edits
                if (isEditing && selectedAppointment?.id) {
                    params.exclude_id = selectedAppointment.id;
                }
                const res = await axios.get('/api/availability', { params });
                if (mounted) setBookedSlots(res.data?.booked ?? []);
            } catch {
                if (mounted) setBookedSlots([]);
            } finally { if (mounted) setSlotsLoading(false); }
        };
        if (form.doctor_name && form.date) fetchBooked(form.doctor_name, form.date);
        else setBookedSlots([]);
        return () => { mounted = false; };
    }, [form.doctor_name, form.date]);

    // Derived state
    const selectedDoctor = useMemo(
        () => doctors.find((d) => d.name === form.doctor_name) ?? null,
        [doctors, form.doctor_name],
    );

    const allSlots = useMemo(
        () => generateSlots(selectedDoctor?.schedule_start, selectedDoctor?.schedule_end),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedDoctor],
    );

    const isSlotPast = (slot) => {
        if (!form.date) return false;
        const today = new Date().toISOString().split('T')[0];
        if (form.date !== today) return false;
        const now   = new Date();
        const [h, m] = slot.split(':').map(Number);
        return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
    };

    const doctorWorksOnDay = useMemo(() => {
        if (!selectedDoctor?.schedule_days || !form.date) return true;
        // schedule_days stores short names: Mon, Tue, Wed, Thu, Fri, Sat, Sun
        const dayShort = new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
        return selectedDoctor.schedule_days.includes(dayShort);
    }, [selectedDoctor, form.date]);

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
            const payload = prefillUserId ? { ...form, user_id: prefillUserId } : form;
            dispatch(createAppointmentThunk(payload));
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
                            onChange={(e) => !prefillUserId && field('patient_name', e.target.value)}
                            readOnly={!!prefillUserId}
                            placeholder="Full name"
                            className={prefillUserId ? `${INPUT_CLASS} bg-gray-100 cursor-not-allowed` : INPUT_CLASS}
                        />
                        {formErrors.patient_name && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.patient_name}</p>
                        )}
                    </div>

                    {/* Service — pick first so doctors are filtered by category */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.service}
                            onChange={(e) => {
                                field('service', e.target.value);
                                // Reset dependent fields only when actually changing service
                                if (!isEditing) { field('doctor_name', ''); field('time', ''); }
                            }}
                            disabled={servicesLoading}
                            className={INPUT_CLASS}
                        >
                            <option value="">{servicesLoading ? 'Loading…' : 'Select service'}</option>
                            {services.map((s) => (
                                <option key={s.id ?? s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                        {formErrors.service && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.service}</p>
                        )}
                    </div>

                    {/* Doctor — filtered by selected service category */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Doctor <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.doctor_name}
                            onChange={(e) => {
                                field('doctor_name', e.target.value);
                                if (!isEditing) field('time', '');
                            }}
                            disabled={doctorsLoading}
                            className={INPUT_CLASS}
                        >
                            <option value="">
                                {doctorsLoading
                                    ? 'Loading…'
                                    : doctors.length === 0 && form.service
                                    ? 'No available doctors'
                                    : 'Select doctor'}
                            </option>
                            {doctors.map((d) => (
                                <option key={d.id ?? d.name} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                        {formErrors.doctor_name && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.doctor_name}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={form.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                                field('date', e.target.value);
                                if (!isEditing) field('time', '');
                            }}
                            className={INPUT_CLASS}
                        />
                        {formErrors.date && (
                            <p className="text-xs text-red-500 mt-0.5">{formErrors.date}</p>
                        )}
                    </div>

                    {/* Time slot picker */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Time Slot <span className="text-red-500">*</span>
                        </label>

                        {!form.doctor_name || !form.date ? (
                            isEditing && form.time ? (
                                <p className="text-xs text-blue-600 py-2 font-medium">
                                    Current time: {formatTime(form.time)} &mdash; fill doctor &amp; date to change it.
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400 italic py-2">
                                    Select a doctor and date to see available slots.
                                </p>
                            )
                        ) : !doctorWorksOnDay ? (
                            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                This doctor does not work on the selected day.
                            </p>
                        ) : slotsLoading ? (
                            <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Checking availability…
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-1.5">
                                {allSlots.map((slot) => {
                                    const booked = bookedSlots.includes(slot);
                                    const past   = isSlotPast(slot);
                                    const disabled = booked || past;
                                    const selected = form.time === slot;
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => !disabled && field('time', slot)}
                                            className={[
                                                'px-1 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                                                selected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : disabled
                                                    ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600',
                                            ].join(' ')}
                                        >
                                            {formatTime(slot)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {formErrors.time && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>
                        )}
                        {form.time && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">Selected: {formatTime(form.time)}</p>
                        )}
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
