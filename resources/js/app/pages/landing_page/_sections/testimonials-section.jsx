import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

const testimonials = [
    {
        name: 'Emily Rodriguez',
        role: 'Marketing Manager',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        rating: 5,
        text: "Booking an appointment used to take hours on hold. With AppointDoc I had a confirmed slot with my cardiologist in under 2 minutes. Absolutely game-changing!",
        tag: 'Cardiology',
    },
    {
        name: 'Daniel Kim',
        role: 'Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        rating: 5,
        text: "The video consultation feature saved me so much time. I had a follow-up with my GP from my office during lunch. The digital prescription reached my pharmacy instantly.",
        tag: 'General Care',
    },
    {
        name: 'Maria Santos',
        role: 'Teacher',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100&q=80',
        rating: 5,
        text: "I love that I can see my full health history and upcoming appointments in one dashboard. The reminder notifications are a lifesaver for my busy schedule.",
        tag: 'Dental',
    },
    {
        name: 'Robert Chen',
        role: 'Retired Civil Engineer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
        rating: 4,
        text: "Even at my age I found the platform incredibly easy to use. My son helped me set it up once and now I manage all my senior health appointments myself.",
        tag: 'Orthopedics',
    },
    {
        name: 'Priya Nair',
        role: 'Nurse Practitioner',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
        rating: 5,
        text: "Worth every penny. As a healthcare professional I appreciate how accurately patient information is captured. It reduces errors and speeds up consultations significantly.",
        tag: 'Mental Health',
    },
    {
        name: 'Alex Thompson',
        role: 'Freelance Designer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        rating: 5,
        text: "Rescheduling is painless — one tap and I get a new slot without any back-and-forth calls. The UX is clean. This is what healthcare apps should look like.",
        tag: 'Dermatology',
    },
];

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-600 to-cyan-500 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                        Patient Stories
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                        Trusted by Thousands of Patients
                    </h2>
                    <p className="text-blue-100 max-w-xl mx-auto">
                        Real stories from real patients who transformed how they manage
                        their healthcare with AppointDoc.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors"
                        >
                            {/* Stars */}
                            <div className="flex gap-0.5 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-4 h-4 ${i < t.rating ? 'text-amber-400' : 'text-white/20'}`}
                                    />
                                ))}
                            </div>

                            {/* Tag */}
                            <span className="inline-block text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full mb-3">
                                {t.tag}
                            </span>

                            <p className="text-sm text-white/90 leading-relaxed mb-5">"{t.text}"</p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                                />
                                <div>
                                    <p className="text-sm font-bold text-white">{t.name}</p>
                                    <p className="text-xs text-blue-200">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Aggregate rating */}
                <div className="mt-14 flex flex-wrap justify-center gap-8 text-center">
                    <div>
                        <p className="text-4xl font-extrabold text-white">4.9/5</p>
                        <div className="flex justify-center gap-0.5 my-1">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
                        </div>
                        <p className="text-sm text-blue-100">Average Rating</p>
                    </div>
                    <div className="w-px bg-white/20 hidden sm:block" />
                    <div>
                        <p className="text-4xl font-extrabold text-white">10k+</p>
                        <p className="text-sm text-blue-100 mt-1">Reviews Written</p>
                    </div>
                    <div className="w-px bg-white/20 hidden sm:block" />
                    <div>
                        <p className="text-4xl font-extrabold text-white">98%</p>
                        <p className="text-sm text-blue-100 mt-1">Would Recommend</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
