import {
    UserCircleIcon,
    CalendarDaysIcon,
    ClipboardDocumentCheckIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

const steps = [
    {
        step: '01',
        icon: <UserCircleIcon className="w-8 h-8" />,
        title: 'Create Your Account',
        description:
            'Sign up in under a minute. Fill in your basic details and create your personal health profile.',
        color: 'bg-blue-600',
        ring: 'ring-blue-100',
    },
    {
        step: '02',
        icon: <CalendarDaysIcon className="w-8 h-8" />,
        title: 'Choose a Doctor & Time',
        description:
            'Browse verified doctors by specialty, read profiles, check availability, and pick a time that works for you.',
        color: 'bg-cyan-500',
        ring: 'ring-cyan-100',
    },
    {
        step: '03',
        icon: <ClipboardDocumentCheckIcon className="w-8 h-8" />,
        title: 'Confirm Your Booking',
        description:
            'Review your appointment details, receive an instant confirmation, and get reminders via SMS or email.',
        color: 'bg-violet-500',
        ring: 'ring-violet-100',
    },
    {
        step: '04',
        icon: <CheckBadgeIcon className="w-8 h-8" />,
        title: 'Attend & Get Better',
        description:
            'Visit the clinic or join a video consultation. Your health records and prescriptions are saved securely.',
        color: 'bg-emerald-500',
        ring: 'ring-emerald-100',
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50/80 border border-blue-100 px-4 py-1.5 rounded-full mb-3">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                        Book an Appointment in 4 Easy Steps
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Getting the care you need has never been simpler. Our streamlined process
                        gets you from browsing to booked in just minutes.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative grid md:grid-cols-4 gap-8">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 z-0" />

                    {steps.map((step, i) => (
                        <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                            {/* Icon Circle */}
                            <div
                                className={`flex items-center justify-center w-20 h-20 rounded-full ${step.color} text-white ring-8 ${step.ring} shadow-lg mb-5`}
                            >
                                {step.icon}
                            </div>

                            {/* Step Number */}
                            <span className="text-xs font-bold text-gray-300 tracking-widest mb-2">
                                STEP {step.step}
                            </span>

                            <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-14">
                    <Link
                        href="/appointments/new"
                        className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
                    >
                        <CalendarDaysIcon className="w-5 h-5" />
                        Book Your Appointment Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
