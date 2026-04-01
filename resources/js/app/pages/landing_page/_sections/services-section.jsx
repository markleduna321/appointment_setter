import { ArrowRightIcon } from '@heroicons/react/24/outline';

const services = [
    {
        emoji: '🩺',
        title: 'General Consultation',
        description: 'Routine check-ups, health assessments, and primary care with experienced GPs.',
        bg: 'from-blue-50 to-blue-100',
        accent: 'text-blue-600',
        img: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400&q=80',
    },
    {
        emoji: '❤️',
        title: 'Cardiology',
        description: 'Heart health consultations, ECG evaluations, and cardiovascular risk screening.',
        bg: 'from-red-50 to-rose-100',
        accent: 'text-rose-500',
        img: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=400&q=80',
    },
    {
        emoji: '🦷',
        title: 'Dental Care',
        description: 'Comprehensive dental services including cleaning, fillings, and orthodontics.',
        bg: 'from-cyan-50 to-cyan-100',
        accent: 'text-cyan-600',
        img: 'https://images.unsplash.com/photo-1606811941341-69d3e0a11c3f?w=400&q=80',
    },
    {
        emoji: '🧬',
        title: 'Laboratory & Diagnostics',
        description: 'Fast, accurate lab tests — blood panels, urinalysis, imaging, and more.',
        bg: 'from-violet-50 to-purple-100',
        accent: 'text-violet-600',
        img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',
    },
    {
        emoji: '👁️',
        title: 'Ophthalmology',
        description: 'Eye exams, vision correction consultations, and eye disease management.',
        bg: 'from-amber-50 to-amber-100',
        accent: 'text-amber-600',
        img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    },
    {
        emoji: '🧠',
        title: 'Mental Health',
        description: 'Confidential sessions with licensed psychiatrists and counselors online or in-person.',
        bg: 'from-emerald-50 to-green-100',
        accent: 'text-emerald-600',
        img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-14">
                    <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-3">
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                        Comprehensive Medical Care
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        From routine check-ups to specialized treatments — book any service
                        instantly and get expert care right when you need it.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s) => (
                        <div
                            key={s.title}
                            className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={s.img}
                                    alt={s.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                {/* Emoji badge */}
                                <span className="absolute top-3 left-3 text-2xl bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow">
                                    {s.emoji}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-5">
                                <h3 className={`text-base font-bold ${s.accent} mb-1`}>{s.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.description}</p>
                                <a
                                    href="#book"
                                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${s.accent} hover:gap-2.5 transition-all`}
                                >
                                    Book Now <ArrowRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* More services link */}
                <div className="text-center mt-10">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                    >
                        View All Services <ArrowRightIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
