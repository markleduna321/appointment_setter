import { useDispatch, useSelector } from 'react-redux';
import { resetBooking } from '../_redux/book-now-slice';
import { Link } from '@inertiajs/react';

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d + 'T00:00').toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

export default function SuccessSection() {
    const dispatch    = useDispatch();
    const { booking } = useSelector((s) => s.bookNow);

    return (
        <div className="flex flex-col items-center text-center py-8">
            {/* Check icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900">Booking Submitted!</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm">
                Your appointment request has been submitted and is pending confirmation. We'll notify you once it's confirmed.
            </p>

            {/* Summary pill strip */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-semibold">
                <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">{booking.service}</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">{booking.doctor_name}</span>
                <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">{formatDate(booking.date)}</span>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">{formatTime(booking.time)}</span>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
                <button
                    onClick={() => dispatch(resetBooking())}
                    className="px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                    Book Another
                </button>
                <Link
                    href="/appointments"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
                >
                    View My Appointments
                </Link>
            </div>
        </div>
    );
}
