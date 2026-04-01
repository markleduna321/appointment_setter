import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../_redux/service-slice';
import { createServiceThunk, updateServiceThunk } from '../_redux/service-thunk';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CATEGORIES } from './filters-section';

const EMPTY_FORM = {
    name:        '',
    description: '',
    category:    '',
    duration:    30,
    price:       '',
    status:      'active',
};

export default function ServiceModalSection() {
    const dispatch = useDispatch();
    const { modalOpen, selectedService, submitting, formError } = useSelector((s) => s.services);
    const isEditing = !!selectedService;

    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (modalOpen) {
            setForm(isEditing
                ? {
                    name:        selectedService.name        ?? '',
                    description: selectedService.description ?? '',
                    category:    selectedService.category    ?? '',
                    duration:    selectedService.duration    ?? 30,
                    price:       selectedService.price       ?? '',
                    status:      selectedService.status      ?? 'active',
                }
                : EMPTY_FORM
            );
        }
    }, [modalOpen, selectedService]);

    if (!modalOpen) return null;

    const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, duration: Number(form.duration), price: Number(form.price) };
        const action = isEditing
            ? updateServiceThunk({ id: selectedService.id, data: payload })
            : createServiceThunk(payload);

        const result = await dispatch(action);
        if (!result.error) dispatch(closeModal());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {isEditing ? 'Edit Service' : 'Add New Service'}
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
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Service Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            required
                            placeholder="e.g. General Consultation"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Category <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) => set('category', e.target.value)}
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition bg-white"
                        >
                            <option value="">Select category…</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Duration + Price */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Duration (minutes) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                value={form.duration}
                                onChange={(e) => set('duration', e.target.value)}
                                required
                                min={1}
                                max={480}
                                placeholder="30"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Price (PHP) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => set('price', e.target.value)}
                                required
                                min={0}
                                step={0.01}
                                placeholder="500.00"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                        <div className="flex gap-3">
                            {['active', 'inactive'].map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={form.status === s}
                                        onChange={() => set('status', s)}
                                        className="accent-purple-600"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                            rows={3}
                            placeholder="Brief description of the service…"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
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
                            className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
                        >
                            {submitting && (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {isEditing ? 'Save Changes' : 'Add Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
