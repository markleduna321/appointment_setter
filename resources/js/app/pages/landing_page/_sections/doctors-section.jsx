import { StarIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { get_doctors_service } from '../../../services/doctor-service';

// Landing shows a small preview of doctors from the DB. Use a static
// placeholder image for now (public/images/doctor-default.svg).

// We'll fetch doctors from the API and display the first four on the
// landing page. The "View all doctors" link navigates to the full listing.
const INITIAL_DOCTORS = [];

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function DoctorsSection() {
    const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await get_doctors_service({});
                if (mounted) setDoctors(data || []);
            } catch (err) {
                if (mounted) setDoctors([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const preview = doctors.slice(0, 4);

    return (
        <section id="doctors" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-14">
                    <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-3">
                        Our Doctors
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                        Meet Our Expert Physicians
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Every doctor on MediBook is credentialed, experienced, and committed
                        to delivering the best patient care possible.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(loading ? Array.from({ length: 4 }) : preview).map((doc, idx) => {
                        const isPlaceholder = loading;
                        const name = isPlaceholder ? `Loading ${idx + 1}` : doc.name;
                        const specialty = isPlaceholder ? '—' : doc.specialty;
                        const rating = isPlaceholder ? '—' : (doc.rating ?? '—');
                        const reviews = isPlaceholder ? 0 : (doc.reviews ?? 0);
                        const location = isPlaceholder ? '—' : (doc.location ?? 'Clinic');
                        const bio = isPlaceholder ? null : (doc.bio ?? '');
                        const scheduleDays = isPlaceholder ? [] : (doc.schedule_days ?? []);
                        const start = isPlaceholder ? null : (doc.schedule_start ?? null);
                        const end = isPlaceholder ? null : (doc.schedule_end ?? null);
                        const available = isPlaceholder ? false : (doc.status === 'available');
                        const tag = isPlaceholder ? null : doc.tag;
                        const tagColor = isPlaceholder ? '' : (doc.tagColor ?? 'bg-gray-100 text-gray-600');

                        const photo = isPlaceholder ? null : (doc.photo ?? null);

                        return (
                            <div
                                key={isPlaceholder ? `ph-${idx}` : (doc.id ?? name)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={photo || '/images/doctor-default.svg'}
                                        alt={name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    {/* Tag */}
                                    {tag && (
                                        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${tagColor}`}>
                                            {tag}
                                        </span>
                                    )}
                                    {/* Availability */}
                                    <div className="absolute bottom-3 left-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                available
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-green-200 animate-pulse' : 'bg-gray-300'}`} />
                                            {available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                                    <p className="text-xs text-blue-600 font-medium mb-2">{specialty}</p>

                                    {/* Short bio */}
                                    {bio && (
                                        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">{bio}</p>
                                    )}

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 my-2">
                                        <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-xs font-bold text-gray-700">{rating}</span>
                                        <span className="text-xs text-gray-400">({reviews} reviews)</span>
                                    </div>

                                    {/* Location & Schedule */}
                                    <div className="flex flex-col gap-1 text-xs text-gray-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="w-3.5 h-3.5" />
                                            <span>{location}</span>
                                        </div>
                                        {(scheduleDays.length > 0 || (start && end)) && (
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
                                                </svg>
                                                <span>
                                                    {scheduleDays.length > 0 ? scheduleDays.join(', ') : 'Days TBA'}
                                                    {start && end && (
                                                        <span className="ml-1">· {formatTime(start)}–{formatTime(end)}</span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/appointments/new"
                                        className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
                                            available
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 shadow-md shadow-blue-100'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <CalendarDaysIcon className="w-4 h-4" />
                                        {available ? 'Book Appointment' : 'Not Available'}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/doctors"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        View all doctors →
                    </Link>
                </div>
            </div>
        </section>
    );
}
