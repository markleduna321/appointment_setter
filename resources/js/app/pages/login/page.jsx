import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { CalendarDaysIcon, ShieldCheckIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid';
import LoginForm from './_sections/login-form';
import RegisterForm from './_sections/register-form';

const FEATURES = [
    { icon: <CalendarDaysIcon className="w-5 h-5 text-blue-400" />, text: 'Book appointments in under 2 minutes' },
    { icon: <ShieldCheckIcon className="w-5 h-5 text-green-400" />, text: 'HIPAA-compliant secure health records' },
    { icon: <StarIcon className="w-5 h-5 text-amber-400" />, text: 'Rated 4.9/5 by 10,000+ patients' },
    { icon: <ClockIcon className="w-5 h-5 text-cyan-400" />, text: '24/7 online booking availability' },
];

const TESTIMONIAL = {
    quote: "MediBook completely changed how I manage my health appointments. I booked my cardiologist visit during my lunch break!",
    name: "Maria Santos",
    role: "Patient since 2024",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=80&q=80",
};

export default function LoginPage() {
    // Support ?tab=register query param from landing page CTAs
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') === 'register' ? 'register' : 'login';
        }
        return 'login';
    });

    useEffect(() => {
        document.title = activeTab === 'login' ? 'Sign In — MediBook' : 'Create Account — MediBook';
    }, [activeTab]);

    return (
        <div className="min-h-screen flex bg-white font-sans">

            {/* ── Left Panel — Branding ────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col bg-gradient-to-br from-[#0d2137] via-blue-900 to-cyan-800 overflow-hidden">

                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/5 rounded-full" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative flex flex-col justify-between h-full p-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
                            <CalendarDaysIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-extrabold text-white leading-none">MediBook</p>
                            <p className="text-xs text-blue-300 font-medium tracking-wide">Online Clinic Scheduler</p>
                        </div>
                    </Link>

                    {/* Hero image area */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-72 h-72 mb-8">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
                                alt="Healthcare"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                            />
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                    <CalendarDaysIcon className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-xs font-bold text-gray-800">Appointment Confirmed!</p>
                                    <p className="text-[11px] text-gray-400">Tomorrow, 10:00 AM</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-extrabold text-white mb-3">
                            Your Health Journey<br />Starts Here
                        </h2>
                        <p className="text-blue-200/80 text-sm leading-relaxed max-w-xs">
                            Access top medical specialists, manage records, and book appointments — all from one platform.
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                        {FEATURES.map((f) => (
                            <div key={f.text} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    {f.icon}
                                </div>
                                <p className="text-sm text-blue-100/80">{f.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                        <p className="text-sm text-white/90 italic mb-3">"{TESTIMONIAL.quote}"</p>
                        <div className="flex items-center gap-2.5">
                            <img src={TESTIMONIAL.avatar} alt={TESTIMONIAL.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30" />
                            <div>
                                <p className="text-xs font-bold text-white">{TESTIMONIAL.name}</p>
                                <p className="text-[11px] text-blue-300">{TESTIMONIAL.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Panel — Forms ──────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto">

                {/* Mobile logo */}
                <div className="flex lg:hidden items-center gap-2 mb-10">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                        <CalendarDaysIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-900 leading-none">MediBook</p>
                        <p className="text-[10px] text-blue-600 font-medium">Online Clinic Scheduler</p>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto">

                    {/* Tab switcher */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                        {['login', 'register'].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 capitalize ${
                                    activeTab === tab
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        ))}
                    </div>

                    {/* Heading */}
                    <div key={`heading-${activeTab}`} className="mb-6 animate-fade-slide-in">
                        {activeTab === 'login' ? (
                            <>
                                <h1 className="text-2xl font-extrabold text-gray-900">Welcome back!</h1>
                                <p className="text-sm text-gray-500 mt-1">Sign in to manage your appointments.</p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
                                <p className="text-sm text-gray-500 mt-1">Join thousands of patients managing their health online.</p>
                            </>
                        )}
                    </div>

                    {/* Social Login (UI only — can be wired later) 
                    <div className="flex gap-3 mb-6">
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div> */}

                    {/* Divider
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>  */}

                    {/* Active Form */}
                    <div key={`form-${activeTab}`} className="animate-fade-slide-in">
                        {activeTab === 'login' ? (
                            <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
                        ) : (
                            <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
                        )}
                    </div>
                </div>

                {/* Back to landing */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                        ← Back to MediBook Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
