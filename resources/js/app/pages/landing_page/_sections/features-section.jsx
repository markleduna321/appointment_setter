import {
    ShieldCheckIcon,
    BellAlertIcon,
    DevicePhoneMobileIcon,
    CalendarDaysIcon,
    DocumentTextIcon,
    VideoCameraIcon,
} from '@heroicons/react/24/outline';

const features = [
    {
        icon: <CalendarDaysIcon className="w-6 h-6 text-white" />,
        title: 'Real-Time Availability',
        description: 'See live doctor schedules and book the exact slot that suits you, with zero double-bookings.',
        gradient: 'from-blue-500 to-blue-600',
    },
    {
        icon: <BellAlertIcon className="w-6 h-6 text-white" />,
        title: 'Smart Reminders',
        description: 'Automated emails, and in-app reminders so you never miss an appointment again.',
        gradient: 'from-amber-400 to-orange-500',
    },
    {
        icon: <ShieldCheckIcon className="w-6 h-6 text-white" />,
        title: 'Secure Health Records',
        description: 'Your medical data is encrypted and stored securely, accessible only by you and your doctor.',
        gradient: 'from-emerald-400 to-green-600',
    },
    {
        icon: <VideoCameraIcon className="w-6 h-6 text-white" />,
        title: 'Video Consultations',
        description: 'Skip the commute — connect with your doctor via HD video call right from your home.',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        icon: <DocumentTextIcon className="w-6 h-6 text-white" />,
        title: 'Digital Prescriptions',
        description: 'Receive prescriptions digitally, shareable directly with any pharmacy near you.',
        gradient: 'from-cyan-500 to-teal-600',
    },
    {
        icon: <DevicePhoneMobileIcon className="w-6 h-6 text-white" />,
        title: 'Mobile Friendly',
        description: 'Book, reschedule, and manage appointments from any device — phone, tablet, or desktop.',
        gradient: 'from-rose-400 to-pink-600',
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Image */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80"
                            alt="Online doctor consultation"
                            className="w-full h-[520px] object-cover rounded-3xl shadow-2xl"
                        />
                        {/* Overlay card */}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&q=80"
                                    alt="Doctor"
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">Dr. Sarah Mitchell</p>
                                    <p className="text-xs text-gray-400">Cardiologist • Available Now</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Features */}
                    <div>
                        <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                            Platform Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                            Everything You Need for Seamless Healthcare
                        </h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            AppointDoc combines powerful tools and a clean interface to make healthcare
                            access simple, fast, and stress-free for patients and doctors alike.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-5">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors group"
                                >
                                    <div className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} shadow-md`}>
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">{f.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
