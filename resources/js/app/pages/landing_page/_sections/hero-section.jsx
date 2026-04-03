import { CalendarDaysIcon, ShieldCheckIcon, ClockIcon, StarIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setBookingField, setSelectedDoctor, goToStep } from '../../book_now/_redux/book-now-slice';
import { getServiceIcon } from '../../../utils/service-icons';

const badges = [
    { icon: <ShieldCheckIcon className="w-4 h-4 text-blue-600" />, text: 'Verified Doctors' },
    { icon: <ClockIcon className="w-4 h-4 text-cyan-600" />, text: '24/7 Booking' },
    { icon: <StarIcon className="w-4 h-4 text-amber-500" />, text: '4.9 Rated' },
];

export default function HeroSection() {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ services: [], doctors: [] });
    const [open, setOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Debounced search against public API
    useEffect(() => {
        if (!query.trim()) {
            setResults({ services: [], doctors: [] });
            setOpen(false);
            return;
        }
        clearTimeout(debounceRef.current);
        setSearching(true);
        setOpen(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const [svcRes, docRes] = await Promise.all([
                    axios.get('/api/services', { params: { search: query, status: 'active' } }),
                    axios.get('/api/doctors',  { params: { search: query } }),
                ]);
                const svcs = (svcRes.data ?? []).slice(0, 5);
                const docs = (docRes.data?.data ?? []).slice(0, 5);
                setResults({ services: svcs, doctors: docs });
            } catch {
                setResults({ services: [], doctors: [] });
            } finally {
                setSearching(false);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const hasResults = results.services.length > 0 || results.doctors.length > 0;

    const selectService = (svc) => {
        dispatch(goToStep(1));
        dispatch(setBookingField({ service: svc.name, service_category: svc.category }));
        setOpen(false);
        router.visit('/appointments/new');
    };

    const selectDoctor = (doc) => {
        dispatch(setSelectedDoctor(doc));
        dispatch(setBookingField({ doctor_name: doc.name, service_category: doc.specialty }));
        dispatch(goToStep(2));
        setOpen(false);
        router.visit('/appointments/new');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOpen(false);
        router.visit('/appointments/new');
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden pt-20"
        >
            {/* Decorative blobs */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-cyan-100 rounded-full opacity-50 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-14 items-center">
                {/* Left — Text */}
                <div>
                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Now accepting new patients
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        Your Health,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                            Scheduled
                        </span>{' '}
                        Your Way
                    </h1>

                    <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                        Book appointments with trusted doctors in seconds. Manage your health
                        records, reminders, and consultations — all from one place.
                    </p>

                    {/* Quick Book Bar */}
                    <div ref={containerRef} className="relative mb-8 max-w-xl">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-white rounded-2xl shadow-lg shadow-blue-100 border border-gray-100"
                        >
                            <div className="flex-1 flex items-center gap-2 px-3">
                                <CalendarDaysIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Choose a specialty or doctor..."
                                    className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                                    autoComplete="off"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => { setQuery(''); setOpen(false); }}
                                        className="text-gray-300 hover:text-gray-500 flex-shrink-0"
                                    >
                                        <XCircleIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-blue-300 whitespace-nowrap"
                            >
                                Book Now
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Dropdown */}
                        {open && (searching || hasResults) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                {searching && (
                                    <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400">
                                        <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                        Searching…
                                    </div>
                                )}

                                {!searching && results.services.length > 0 && (
                                    <>
                                        <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Services</p>
                                        {results.services.map((svc) => {
                                            const { emoji } = getServiceIcon(svc.category);
                                            return (
                                                <button
                                                    key={svc.id}
                                                    type="button"
                                                    onClick={() => selectService(svc)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-left transition-colors"
                                                >
                                                    <span className="text-xl w-8 text-center">{emoji}</span>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{svc.name}</p>
                                                        <p className="text-xs text-gray-400">{svc.category}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </>
                                )}

                                {!searching && results.doctors.length > 0 && (
                                    <>
                                        <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doctors</p>
                                        {results.doctors.map((doc) => (
                                            <button
                                                key={doc.id}
                                                type="button"
                                                onClick={() => selectDoctor(doc)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-left transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                                                    {doc.name?.[0] ?? '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.specialty}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {!searching && !hasResults && (
                                    <div className="px-4 py-4 text-sm text-gray-400 text-center">
                                        No results for "{query}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        {badges.map((b) => (
                            <div key={b.text} className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                                {b.icon}
                                {b.text}
                            </div>
                        ))}
                    </div>

                    <a
                        href="#how-it-works"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        <PlayCircleIcon className="w-5 h-5" />
                        See how it works
                    </a>
                </div>

                {/* Right — Hero Image + Floating Cards */}
                <div className="relative flex justify-center">
                    {/* Main image */}
                    <div className="relative w-full max-w-md">
                        <img
                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80"
                            alt="Doctor consultation"
                            className="w-full h-[480px] object-cover rounded-3xl shadow-2xl"
                        />
                        {/* Gradient overlay bottom */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-blue-900/20 to-transparent" />
                    </div>

                    {/* Floating card — Appointment confirmed */}
                    <div className="absolute -left-6 bottom-28 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 w-52 animate-bounce-slow">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">Appointment Booked!</p>
                            <p className="text-[11px] text-gray-400">Tomorrow, 10:00 AM</p>
                        </div>
                    </div>

                    {/* Floating card — Rating */}
                    <div className="absolute -right-4 top-12 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 w-48">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <StarIcon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">Top Rated</p>
                            <div className="flex gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="w-3 h-3 text-amber-400" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating card — Patients */}
                    <div className="absolute -right-2 bottom-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl px-4 py-3 text-white w-44">
                        <p className="text-2xl font-extrabold">10k+</p>
                        <p className="text-xs text-blue-100">Happy Patients</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
