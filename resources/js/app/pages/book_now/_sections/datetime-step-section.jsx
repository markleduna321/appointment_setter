import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingField, nextStep, prevStep } from '../_redux/book-now-slice';

const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
];

function formatTime(t) {
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

// Minimum date = today
const today = new Date().toISOString().slice(0, 10);

export default function DateTimeStepSection() {
    const dispatch  = useDispatch();
    const { booking } = useSelector((s) => s.bookNow);
    const [dateError, setDateError] = useState('');

    const handleNext = () => {
        if (!booking.date) { setDateError('Please select a date.'); return; }
        if (!booking.time) { setDateError('Please select a time slot.'); return; }
        setDateError('');
        dispatch(nextStep());
    };

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-4">Pick a Date & Time</h2>

            {/* Date picker */}
            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    min={today}
                    value={booking.date}
                    onChange={(e) => { dispatch(setBookingField({ date: e.target.value })); setDateError(''); }}
                    className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
            </div>

            {/* Time slots grid */}
            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((slot) => (
                        <button
                            key={slot}
                            onClick={() => { dispatch(setBookingField({ time: slot })); setDateError(''); }}
                            className={`py-2 text-xs font-semibold rounded-xl border transition-all
                                ${booking.time === slot
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'}`}
                        >
                            {formatTime(slot)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional Notes</label>
                <textarea
                    rows={3}
                    value={booking.notes}
                    onChange={(e) => dispatch(setBookingField({ notes: e.target.value }))}
                    placeholder="Any symptoms, concerns, or special requests..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                />
            </div>

            {dateError && <p className="text-xs text-red-500 mb-3">{dateError}</p>}

            <div className="flex gap-3">
                <button onClick={() => dispatch(prevStep())}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    ← Back
                </button>
                <button onClick={handleNext}
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors">
                    Review Booking →
                </button>
            </div>
        </div>
    );
}
