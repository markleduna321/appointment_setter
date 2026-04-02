import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingField, nextStep, prevStep } from '../_redux/book-now-slice';
import { fetchBookingDoctorsThunk } from '../_redux/book-now-thunk';

const AVATAR_GRADIENTS = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-600',
    'from-teal-400 to-cyan-600',
    'from-orange-400 to-red-500',
    'from-green-400 to-emerald-600',
    'from-yellow-400 to-amber-600',
];

function avatarGradient(name = '') {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    return AVATAR_GRADIENTS[Math.abs(h) % AVATAR_GRADIENTS.length];
}

function initials(name = '') {
    return name.trim().split(/\s+/)
        .filter((w) => !w.toLowerCase().startsWith('dr'))
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

const STATUS_STYLES = {
    available:   'bg-emerald-100 text-emerald-700',
    unavailable: 'bg-amber-100 text-amber-700',
    on_leave:    'bg-red-100 text-red-600',
};
const STATUS_LABELS = {
    available:   'Available',
    unavailable: 'Unavailable',
    on_leave:    'On Leave',
};

function SkeletonCard() {
    return (
        <div className="border-2 border-gray-100 rounded-2xl p-4 animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-5 bg-gray-100 rounded-full w-20 mt-1" />
            </div>
        </div>
    );
}

export default function DoctorStepSection() {
    const dispatch = useDispatch();
    const { booking, bookingDoctors, bookingDoctorsLoading } = useSelector((s) => s.bookNow);

    useEffect(() => {
        if (booking.service_category) {
            dispatch(fetchBookingDoctorsThunk(booking.service_category));
        }
    }, [booking.service_category]);

    const select = (name) => {
        dispatch(setBookingField({ doctor_name: name }));
        dispatch(nextStep());
    };

    const isAvailable = (doc) => doc.status === 'available';

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-1">Choose a Doctor</h2>
            {booking.service && (
                <p className="text-xs text-gray-500 mb-4">
                    Showing doctors for <span className="font-semibold text-blue-600">{booking.service}</span>
                </p>
            )}

            {bookingDoctorsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {!bookingDoctorsLoading && bookingDoctors.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                    No available doctors for this service at the moment.
                </div>
            )}

            {!bookingDoctorsLoading && bookingDoctors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookingDoctors.map((doc) => {
                        const available = isAvailable(doc);
                        const isSelected = booking.doctor_name === doc.name;
                        return (
                            <button
                                key={doc.id}
                                disabled={!available}
                                onClick={() => available && select(doc.name)}
                                className={`text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                                    ${!available
                                        ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                                        : isSelected
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient(doc.name)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 select-none`}>
                                    {initials(doc.name)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm truncate">Dr. {doc.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.specialty}</p>
                                    <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[doc.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                        {STATUS_LABELS[doc.status] ?? doc.status}
                                    </span>
                                </div>

                                {isSelected && (
                                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={() => dispatch(prevStep())}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}
