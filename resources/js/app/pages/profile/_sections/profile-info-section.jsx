import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { fetchProfileThunk, updateProfileThunk, } from '../_redux/profile-thunk';

export default function ProfileInfoSection() {
    const dispatch = useDispatch();
    const { profile, loading, submitting, formError, message } = useSelector((s) => s.profile);

    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        if (!profile && !loading) dispatch(fetchProfileThunk());
    }, [profile, loading, dispatch]);

    useEffect(() => {
        if (profile) setForm({ name: profile.name || '', email: profile.email || '', phone: profile.phone || '' });
    }, [profile]);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfileThunk(form));
        if (result.error) return;
        // reload to refresh Inertia auth props/header
        try { window.location.reload(); } catch (e) {}
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">Update your account's profile information and email address.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                    <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full" />
                    <InputError message={formError && formError.name ? formError.name : null} className="mt-2" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <TextInput type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="w-full" />
                    <InputError message={formError && formError.email ? formError.email : null} className="mt-2" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile</label>
                    <TextInput value={form.phone} onChange={(e) => set('phone', e.target.value)} className="w-full" placeholder="e.g. +63 9XX XXX XXXX" />
                    <InputError message={formError && formError.phone ? formError.phone : null} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</PrimaryButton>
                    {message && <p className="text-sm text-gray-600">{message}</p>}
                </div>
            </form>
        </section>
    );
}
