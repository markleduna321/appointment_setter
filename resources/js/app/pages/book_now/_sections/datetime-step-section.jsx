import { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setBookingField, nextStep, prevStep } from '../_redux/book-now-slice';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
];

function generateSlots(start, end) {
    if (!start || !end) return DEFAULT_SLOTS;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let cur = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const slots = [];
    while (cur < endMin) {
        const h = Math.floor(cur / 60);
        const m = cur % 60;
        // skip 12:00–13:00 lunch block
        if (h !== 12) {
            slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
        cur += 30;
    }
    return slots;
}

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

const today = new Date().toISOString().slice(0, 10);

export default function DateTimeStepSection() {
    const dispatch = useDispatch();
    const { booking, selectedDoctor } = useSelector((s) => s.bookNow);
    const [dateError, setDateError]     = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    // Time slots derived from the doctor's schedule window
    const timeSlots = useMemo(
        () => generateSlots(selectedDoctor?.schedule_start, selectedDoctor?.schedule_end),
        [selectedDoctor]
    );

    // Day-of-week name for the selected date
    const selectedDayName = useMemo(() => {
        if (!booking.date) return null;
        return DAY_NAMES[new Date(booking.date + 'T00:00:00').getDay()];
    }, [booking.date]);

    // Does the doctor work on the picked weekday?
    const doctorWorksOnDate = useMemo(() => {
        if (!selectedDoctor || !booking.date || !selectedDoctor.schedule_days) return true;
        return selectedDoctor.schedule_days.includes(selectedDayName);
    }, [selectedDoctor, booking.date, selectedDayName]);

    // Set of slots that are in the past when the selected date is today.
    // Re-evaluated every render so the page stays live while the user is on it.
    const pastSlots = useMemo(() => {
        if (booking.date !== today) return new Set();
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        return new Set(
            timeSlots.filter((slot) => {
                const [h, m] = slot.split(':').map(Number);
                return h * 60 + m <= nowMins;
            })
        );
    }, [booking.date, timeSlots]);

    // Fetch booked slots whenever doctor + date are both known
    const fetchBooked = useCallback(async (doctorName, date) => {
        setSlotsLoading(true);
        try {
            const res = await axios.get('/api/availability', {
                params: { doctor_name: doctorName, date },
            });
            setBookedSlots(res.data.booked ?? []);
        } catch {
            setBookedSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (booking.doctor_name && booking.date) {
            fetchBooked(booking.doctor_name, booking.date);
        } else {
            setBookedSlots([]);
        }
    }, [booking.doctor_name, booking.date]);

    const handleDateChange = (val) => {
        // Clear time when date changes so a stale value isn't carried over
        dispatch(setBookingField({ date: val, time: '' }));
        setDateError('');
    };

    const handleNext = () => {
        if (!booking.date) { setDateError('Please select a date.'); return; }
        if (!booking.time) { setDateError('Please select a time slot.'); return; }
        setDateError('');
        dispatch(nextStep());
    };

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-1">Pick a Date &amp; Time</h2>

            {/* Doctor schedule summary banner */}
            {selectedDoctor && (
                <div className="mb-4 flex items-start gap-2 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700">
                    <span className="text-base flex-shrink-0">📅</span>
                    <div className="leading-relaxed">
                        <span className="font-semibold">Dr. {selectedDoctor.name}</span>
                        {selectedDoctor.schedule_days?.length > 0 && (
                            <span> available on <span className="font-medium">{selectedDoctor.schedule_days.join(', ')}</span></span>
                        )}
                        {selectedDoctor.schedule_start && selectedDoctor.schedule_end && (
                            <span> · {formatTime(selectedDoctor.schedule_start)} – {formatTime(selectedDoctor.schedule_end)}</span>
                        )}
                    </div>
                </div>
            )}

            {/* Date picker */}
            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    min={today}
                    value={booking.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />

                {/* Warning: doctor not scheduled on this weekday */}
                {booking.date && selectedDoctor && !doctorWorksOnDate && (
                    <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                        <span className="flex-shrink-0 mt-0.5">⚠️</span>
                        <span>
                            <span className="font-semibold">Dr. {selectedDoctor.name}</span> is not scheduled on{' '}
                            <span className="font-semibold">{selectedDayName}s</span>. You can still book but the appointment may be rescheduled or require admin confirmation.
                        </span>
                    </div>
                )}
            </div>

            {/* Time slots */}
            <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Time Slot <span className="text-red-500">*</span>
                    {slotsLoading && (
                        <span className="ml-2 text-gray-400 font-normal">Checking availability…</span>
                    )}
                </label>

                {!booking.date && (
                    <p className="text-xs text-gray-400">Select a date first to see available slots.</p>
                )}

                {booking.date && timeSlots.length === 0 && (
                    <p className="text-xs text-gray-400">No time slots available for this doctor.</p>
                )}

                {booking.date && timeSlots.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {timeSlots.map((slot) => {
                            const isBooked   = bookedSlots.includes(slot);
                            const isPast     = pastSlots.has(slot);
                            const isDisabled = isBooked || isPast || slotsLoading;
                            const isSelected = booking.time === slot;
                            const label      = isBooked ? 'Booked' : isPast ? 'Passed' : null;
                            const title      = isBooked ? 'This slot is already booked'
                                             : isPast   ? 'This time has already passed'
                                             : undefined;
                            return (
                                <button
                                    key={slot}
                                    disabled={isDisabled}
                                    onClick={() => { dispatch(setBookingField({ time: slot })); setDateError(''); }}
                                    title={title}
                                    className={`py-2 text-xs font-semibold rounded-xl border transition-all
                                        ${isDisabled
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                                            : isSelected
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    {formatTime(slot)}
                                    {label && (
                                        <span className="block text-[9px] font-normal not-italic no-underline text-gray-400 leading-none mt-0.5">
                                            {label}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
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
