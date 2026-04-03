import { CalendarDaysIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function CtaSection() {
    return (
        <section id="book" className="py-24 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Background image overlay */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />

                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    <div className="relative px-8 py-16 sm:px-16 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Doctors Available Now
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                            Take Control of Your Health Today
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Don't put off your health. Book an appointment in under 2 minutes and
                            connect with a trusted doctor — in person or online.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/appointments/new"
                                className="flex items-center gap-2 px-8 py-4 text-blue-700 bg-white font-bold text-sm rounded-2xl hover:bg-blue-50 transition-colors shadow-lg w-full sm:w-auto justify-center"
                            >
                                <CalendarDaysIcon className="w-5 h-5" />
                                Book an Appointment
                            </Link>
                            <a
                                href="tel:+18005551234"
                                className="flex items-center gap-2 px-8 py-4 text-white border-2 border-white/60 font-bold text-sm rounded-2xl hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
                            >
                                <PhoneIcon className="w-5 h-5" />
                                Call Us: +1 (800) 555-1234
                            </a>
                        </div>

                        {/* Trust note */}
                        <p className="mt-8 text-xs text-blue-200">
                            No credit card required &nbsp;•&nbsp; Free to sign up &nbsp;•&nbsp; Cancel anytime
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
