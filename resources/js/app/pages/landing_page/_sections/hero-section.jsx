import { CalendarDaysIcon, ShieldCheckIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

const badges = [
    { icon: <ShieldCheckIcon className="w-4 h-4 text-blue-600" />, text: 'Verified Doctors' },
    { icon: <ClockIcon className="w-4 h-4 text-cyan-600" />, text: '24/7 Booking' },
    { icon: <StarIcon className="w-4 h-4 text-amber-500" />, text: '4.9 Rated' },
];

export default function HeroSection() {
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-white rounded-2xl shadow-lg shadow-blue-100 border border-gray-100 mb-8 max-w-xl">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <CalendarDaysIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Choose a specialty or doctor..."
                                className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                            />
                        </div>
                        <a
                            href="/login?tab=register"
                            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-blue-300 whitespace-nowrap"
                        >
                            Book Now
                            <ArrowRightIcon className="w-4 h-4" />
                        </a>
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
