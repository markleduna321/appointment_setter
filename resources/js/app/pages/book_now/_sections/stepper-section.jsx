import { useSelector, useDispatch } from 'react-redux';
import { goToStep } from '../_redux/book-now-slice';

const STEPS = [
    { number: 1, label: 'Service' },
    { number: 2, label: 'Doctor' },
    { number: 3, label: 'Date & Time' },
    { number: 4, label: 'Confirm' },
];

export default function StepperSection() {
    const { step, booking } = useSelector((s) => s.bookNow);
    const dispatch = useDispatch();

    const isStepComplete = (n) => {
        if (n === 1) return !!booking.service;
        if (n === 2) return !!booking.doctor_name;
        if (n === 3) return !!booking.date && !!booking.time;
        return false;
    };

    return (
        <div className="flex items-center justify-center mb-8">
            {STEPS.map((s, idx) => {
                const complete = isStepComplete(s.number);
                const active   = step === s.number;
                const reachable = s.number < step || complete;

                return (
                    <div key={s.number} className="flex items-center">
                        {/* Circle */}
                        <button
                            onClick={() => reachable && dispatch(goToStep(s.number))}
                            disabled={!reachable}
                            className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold border-2 transition-all
                                ${active   ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110' :
                                  complete ? 'bg-emerald-500 border-emerald-500 text-white cursor-pointer' :
                                             'bg-white border-gray-300 text-gray-400 cursor-default'}`}
                        >
                            {complete && !active ? (
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : s.number}
                        </button>

                        {/* Label (hidden on very small) */}
                        <span className={`hidden sm:block ml-2 mr-1 text-xs font-semibold transition-colors
                            ${active ? 'text-blue-600' : complete ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {s.label}
                        </span>

                        {/* Connector */}
                        {idx < STEPS.length - 1 && (
                            <div className={`w-10 sm:w-16 h-0.5 mx-2 rounded transition-colors
                                ${complete ? 'bg-emerald-400' : 'bg-gray-200'}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
