import { useDispatch, useSelector } from 'react-redux';
import { prevStep, resetBooking } from '../_redux/book-now-slice';
import { submitBookingThunk } from '../_redux/book-now-thunk';
import {
    CalendarDaysIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

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

const ROW_CLASS = 'flex items-start gap-3 py-3 border-b border-gray-50 last:border-0';
const ICON_CLASS = 'w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0';

export default function ConfirmStepSection() {
    const dispatch  = useDispatch();
    const { booking, submitting, error } = useSelector((s) => s.bookNow);
    const authUser  = useSelector((s) => s.auth?.user);

    const handleSubmit = () => {
        dispatch(submitBookingThunk({
            ...booking,
            patient_name: authUser?.name ?? 'Patient',
            status: 'pending',
        }));
    };

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-4">Review Your Booking</h2>

            {/* Summary card */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-5">
                <div className={ROW_CLASS}>
                    <ClipboardDocumentListIcon className={ICON_CLASS} />
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Service</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{booking.service || '—'}</p>
                    </div>
                </div>
                <div className={ROW_CLASS}>
                    <UserGroupIcon className={ICON_CLASS} />
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Doctor</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{booking.doctor_name || '—'}</p>
                    </div>
                </div>
                <div className={ROW_CLASS}>
                    <CalendarDaysIcon className={ICON_CLASS} />
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatDate(booking.date) || '—'}</p>
                    </div>
                </div>
                <div className={ROW_CLASS}>
                    <ClockIcon className={ICON_CLASS} />
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Time</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatTime(booking.time) || '—'}</p>
                    </div>
                </div>
                {booking.notes && (
                    <div className={ROW_CLASS}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                        </svg>
                        <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Notes</p>
                            <p className="text-sm text-gray-600 mt-0.5">{booking.notes}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Policy note */}
            <p className="text-[11px] text-gray-400 mb-5 leading-relaxed">
                By confirming, you agree that this booking is subject to availability confirmation. You will receive a notification once your appointment is confirmed.
            </p>

            {error && (
                <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={() => dispatch(prevStep())}
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors disabled:opacity-60"
                >
                    {submitting && (
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    )}
                    {submitting ? 'Submitting…' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
}
