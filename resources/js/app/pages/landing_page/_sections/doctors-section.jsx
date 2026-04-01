import { StarIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';

const doctors = [
    {
        name: 'Dr. Sarah Mitchell',
        specialty: 'Cardiologist',
        rating: 4.9,
        reviews: 312,
        location: 'Main Branch',
        available: true,
        img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
        tag: 'Top Rated',
        tagColor: 'bg-amber-100 text-amber-700',
    },
    {
        name: 'Dr. James Carter',
        specialty: 'General Physician',
        rating: 4.8,
        reviews: 208,
        location: 'North Wing',
        available: true,
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
        tag: 'Most Booked',
        tagColor: 'bg-blue-100 text-blue-700',
    },
    {
        name: 'Dr. Anika Patel',
        specialty: 'Dermatologist',
        rating: 4.7,
        reviews: 175,
        location: 'Main Branch',
        available: false,
        img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
        tag: 'Specialist',
        tagColor: 'bg-violet-100 text-violet-700',
    },
    {
        name: 'Dr. Marcus Lee',
        specialty: 'Orthopedic Surgeon',
        rating: 4.9,
        reviews: 291,
        location: 'Surgical Wing',
        available: true,
        img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
        tag: 'New',
        tagColor: 'bg-green-100 text-green-700',
    },
];

export default function DoctorsSection() {
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
                    {doctors.map((doc) => (
                        <div
                            key={doc.name}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
                        >
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={doc.img}
                                    alt={doc.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                {/* Tag */}
                                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${doc.tagColor}`}>
                                    {doc.tag}
                                </span>
                                {/* Availability */}
                                <div className="absolute bottom-3 left-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                            doc.available
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-500 text-white'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-green-200 animate-pulse' : 'bg-gray-300'}`} />
                                        {doc.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-gray-900">{doc.name}</h3>
                                <p className="text-xs text-blue-600 font-medium mb-2">{doc.specialty}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs font-bold text-gray-700">{doc.rating}</span>
                                    <span className="text-xs text-gray-400">({doc.reviews} reviews)</span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                                    <MapPinIcon className="w-3.5 h-3.5" />
                                    {doc.location}
                                </div>

                                <a
                                    href="#book"
                                    className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
                                        doc.available
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 shadow-md shadow-blue-100'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <CalendarDaysIcon className="w-4 h-4" />
                                    {doc.available ? 'Book Appointment' : 'Not Available'}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        View all doctors →
                    </a>
                </div>
            </div>
        </section>
    );
}
