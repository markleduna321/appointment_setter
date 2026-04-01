import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    UserIcon, EnvelopeIcon, LockClosedIcon,
    EyeIcon, EyeSlashIcon, ArrowRightIcon, CheckIcon,
} from '@heroicons/react/24/outline';
import { registerThunk } from '../_redux/auth-thunk';
import { clearError } from '../_redux/auth-slice';

const passwordRules = [
    { label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { label: 'One number', test: (v) => /[0-9]/.test(v) },
];

export default function RegisterForm({ onSwitchToLogin }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(clearError());
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerThunk(form));
    };

    const passwordsMatch = form.password && form.password === form.password_confirmation;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </div>
            )}

            {/* Full Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Juan dela Cruz"
                        className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition"
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition"
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                    <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a strong password"
                        className="w-full pl-11 pr-11 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition"
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>

                {/* Password strength checklist */}
                {form.password && (
                    <div className="mt-2 grid grid-cols-3 gap-1">
                        {passwordRules.map((rule) => {
                            const passed = rule.test(form.password);
                            return (
                                <div key={rule.label} className={`flex items-center gap-1 text-[11px] font-medium ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                                    <CheckIcon className={`w-3 h-3 ${passed ? 'text-green-500' : 'text-gray-300'}`} />
                                    {rule.label}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                    <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                        placeholder="Repeat your password"
                        className={`w-full pl-11 pr-11 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition ${
                            form.password_confirmation
                                ? passwordsMatch
                                    ? 'border-green-400 focus:ring-green-500/30'
                                    : 'border-red-300 focus:ring-red-500/30'
                                : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-400'
                        }`}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
                {form.password_confirmation && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading || (form.password_confirmation && !passwordsMatch)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:opacity-90 disabled:opacity-60 transition shadow-md shadow-blue-200"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Creating account…
                    </>
                ) : (
                    <>
                        Create Account <ArrowRightIcon className="w-4 h-4" />
                    </>
                )}
            </button>

            {/* Terms note */}
            <p className="text-center text-xs text-gray-400">
                By creating an account you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Sign in instead
                </button>
            </p>
        </form>
    );
}
