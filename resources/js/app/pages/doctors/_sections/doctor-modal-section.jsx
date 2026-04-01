import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../_redux/doctor-slice';
import { createDoctorThunk, updateDoctorThunk } from '../_redux/doctor-thunk';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SPECIALTIES = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Dental',
    'Eye Care',
    'OB-GYN',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
];

const EMPTY_FORM = {
    name: '',
    specialty: '',
    email: '',
    phone: '',
    bio: '',
    status: 'available',
    schedule_start: '',
    schedule_end: '',
    schedule_days: [],
};

export default function DoctorModalSection() {
    const dispatch = useDispatch();
    const { modalOpen, selectedDoctor, submitting, formError } = useSelector((s) => s.doctors);
    const isEditing = !!selectedDoctor;

    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (modalOpen) {
            setForm(isEditing
                ? {
                    name: selectedDoctor.name ?? '',
                    specialty: selectedDoctor.specialty ?? '',
                    email: selectedDoctor.email ?? '',
                    phone: selectedDoctor.phone ?? '',
                    bio: selectedDoctor.bio ?? '',
                    status: selectedDoctor.status ?? 'available',
                    schedule_start: selectedDoctor.schedule_start ?? '',
                    schedule_end: selectedDoctor.schedule_end ?? '',
                    schedule_days: Array.isArray(selectedDoctor.schedule_days) ? selectedDoctor.schedule_days : [],
                }
                : EMPTY_FORM
            );
        }
    }, [modalOpen, selectedDoctor]);

    if (!modalOpen) return null;

    const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    const toggleDay = (day) => {
        set('schedule_days', form.schedule_days.includes(day)
            ? form.schedule_days.filter((d) => d !== day)
            : [...form.schedule_days, day]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = isEditing
            ? updateDoctorThunk({ id: selectedDoctor.id, data: form })
            : createDoctorThunk(form);

        const result = await dispatch(action);
        if (!result.error) dispatch(closeModal());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Head */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
                    </h3>
                    <button
                        onClick={() => dispatch(closeModal())}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
                    {formError && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                            {formError}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Name <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            required
                            placeholder="e.g. Maria Santos"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                    </div>

                    {/* Specialty */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Specialty <span className="text-red-400">*</span></label>
                        <select
                            value={form.specialty}
                            onChange={(e) => set('specialty', e.target.value)}
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition bg-white"
                        >
                            <option value="">Select specialty…</option>
                            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                                placeholder="doctor@clinic.com"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder="+63 9XX XXX XXXX"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => set('status', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition bg-white"
                        >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="on_leave">On Leave</option>
                        </select>
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Schedule Days</label>
                        <div className="flex flex-wrap gap-2">
                            {DAY_OPTIONS.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                        form.schedule_days.includes(day)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Schedule times */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Schedule Start</label>
                            <input
                                type="time"
                                value={form.schedule_start}
                                onChange={(e) => set('schedule_start', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Schedule End</label>
                            <input
                                type="time"
                                value={form.schedule_end}
                                onChange={(e) => set('schedule_end', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => set('bio', e.target.value)}
                            rows={3}
                            placeholder="Brief description about the doctor…"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                    </div>

                    {/* Footer */}
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
                            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
                        >
                            {submitting && (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {isEditing ? 'Save Changes' : 'Add Doctor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
