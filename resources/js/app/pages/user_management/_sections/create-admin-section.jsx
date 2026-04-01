import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaffUserThunk } from '../_redux/user-management-thunk';
import { clearFormStatus } from '../_redux/user-management-slice';

const ROLES = [
    { value: 'admin',             label: 'Admin' },
    { value: 'appointment_setter', label: 'Appointment Setter' },
];

export default function CreateAdminSection() {
    const dispatch = useDispatch();
    const { submitting, formError, formSuccess } = useSelector((s) => s.userManagement);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [localError, setLocalError] = useState(null);

    // clear redux form status when unmounting
    useEffect(() => () => { dispatch(clearFormStatus()); }, [dispatch]);

    // reset form fields on success
    useEffect(() => {
        if (formSuccess) {
            setName(''); setEmail(''); setPassword(''); setPasswordConfirm('');
            setRole('admin');
        }
    }, [formSuccess]);

    function handleSubmit(e) {
        e.preventDefault();
        setLocalError(null);
        dispatch(clearFormStatus());

        if (!name || !email || !password) {
            setLocalError('Please fill all required fields.');
            return;
        }
        if (password !== passwordConfirm) {
            setLocalError('Passwords do not match.');
            return;
        }

        dispatch(createStaffUserThunk({ name, email, password, role }));
    }

    const displayError = localError || formError;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Create Staff Account</h3>

            {displayError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{displayError}</div>
            )}
            {formSuccess && (
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">{formSuccess}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-xs font-semibold text-gray-600">Full name <span className="text-red-500">*</span></label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Jane Doe" />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Email <span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="staff@example.com" />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Role <span className="text-red-500">*</span></label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                        {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Password <span className="text-red-500">*</span></label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Min 8 characters" />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Confirm Password <span className="text-red-500">*</span></label>
                    <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Re-enter password" />
                </div>

                <button type="submit" disabled={submitting} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
                    {submitting ? 'Creating…' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}
