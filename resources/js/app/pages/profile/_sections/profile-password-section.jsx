import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { updatePasswordThunk } from '../_redux/profile-thunk';

export default function ProfilePasswordSection() {
    const dispatch = useDispatch();
    const { submitting, formError, message } = useSelector((s) => s.profile);

    const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updatePasswordThunk(form));
        if (!result.error) {
            setForm({ current_password: '', password: '', password_confirmation: '' });
        }
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
                    <TextInput type="password" value={form.current_password} onChange={(e) => set('current_password', e.target.value)} className="w-full" />
                    <InputError className="mt-2" message={formError && formError.current_password ? formError.current_password : null} />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                    <TextInput type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className="w-full" />
                    <InputError className="mt-2" message={formError && formError.password ? formError.password : null} />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
                    <TextInput type="password" value={form.password_confirmation} onChange={(e) => set('password_confirmation', e.target.value)} className="w-full" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</PrimaryButton>
                    {message && <p className="text-sm text-gray-600">{message}</p>}
                </div>
            </form>
        </section>
    );
}
