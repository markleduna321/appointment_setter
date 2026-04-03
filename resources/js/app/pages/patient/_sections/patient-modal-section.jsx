import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../_redux/patient-slice';
import { createPatientThunk, updatePatientThunk } from '../_redux/patient-thunk';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EMPTY_FORM = {
    name: '',
    source: 'walkin',
    email: '',
    phone: '',
    dob: '',
    notes: '',
};

export default function PatientModalSection() {
    const dispatch = useDispatch();
    const { modalOpen, selectedPatient, submitting, formError } = useSelector((s) => s.patients);
    const isEditing = !!selectedPatient;

    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (modalOpen) {
            setForm(isEditing
                ? {
                    name:   selectedPatient.name ?? '',
                    source: selectedPatient.source ?? 'walkin',
                    email:  selectedPatient.email ?? '',
                    phone:  selectedPatient.phone ?? '',
                    dob:    selectedPatient.dob ?? '',
                    notes:  selectedPatient.notes ?? '',
                }
                : EMPTY_FORM
            );
        }
    }, [modalOpen, selectedPatient]);

    if (!modalOpen) return null;

    const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
    const isWalkin = form.source === 'walkin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = isEditing
            ? updatePatientThunk({ id: selectedPatient.id, data: form })
            : createPatientThunk(form);

        const result = await dispatch(action);
        if (!result.error) dispatch(closeModal());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Head */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {isEditing ? 'Edit Patient' : 'Add New Patient'}
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

                    {/* Walk-in / Online toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                            <p className="text-xs font-semibold text-gray-700">Patient Type</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {isWalkin ? 'Walk-in — no online account required' : 'Online — requires email for app access'}
                            </p>
                        </div>
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-semibold flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => set('source', 'walkin')}
                                className={`px-3 py-1.5 transition-colors ${isWalkin ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                Walk-in
                            </button>
                            <button
                                type="button"
                                onClick={() => set('source', 'online')}
                                className={`px-3 py-1.5 transition-colors ${!isWalkin ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                Online
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Name <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            required
                            placeholder="e.g. Maria Santos"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Email{!isWalkin && <span className="text-red-400 ml-0.5">*</span>}
                                {isWalkin && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                                required={!isWalkin}
                                placeholder={isWalkin ? 'If available' : 'patient@example.com'}
                                className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition ${isWalkin ? 'border-gray-100 bg-gray-50 text-gray-400' : 'border-gray-200'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder="+63 9XX XXX XXXX"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={form.dob}
                            onChange={(e) => set('dob', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => set('notes', e.target.value)}
                            rows={3}
                            placeholder="Optional notes about the patient…"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                        />
                    </div>

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
                            className="px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-60"
                        >
                            {submitting ? 'Saving…' : (isEditing ? 'Save Changes' : 'Add Patient')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
