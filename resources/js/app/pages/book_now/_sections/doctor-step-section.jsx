import { useDispatch, useSelector } from 'react-redux';
import { setBookingField, nextStep, prevStep } from '../_redux/book-now-slice';

const DOCTORS = [
    { name: 'Dr. Juan Dela Cruz', specialty: 'General Practitioner', image: null, available: true },
    { name: 'Dr. Ana Garcia',     specialty: 'Dermatologist',        image: null, available: true },
    { name: 'Dr. Jose Ramos',     specialty: 'Ophthalmologist',      image: null, available: true },
    { name: 'Dr. Maria Lim',      specialty: 'Cardiologist',         image: null, available: false },
    { name: 'Dr. Roberto Santos', specialty: 'Orthopedic Surgeon',   image: null, available: true },
    { name: 'Dr. Lorna Bautista', specialty: 'Pediatrician',         image: null, available: true },
];

function initials(name) {
    return name
        .split(' ')
        .filter((w) => !w.startsWith('Dr'))
        .slice(0, 2)
        .map((w) => w[0])
        .join('');
}

export default function DoctorStepSection() {
    const dispatch  = useDispatch();
    const { booking } = useSelector((s) => s.bookNow);

    const select = (name) => {
        dispatch(setBookingField({ doctor_name: name }));
        dispatch(nextStep());
    };

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-4">Choose a Doctor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DOCTORS.map((doc) => (
                    <button
                        key={doc.name}
                        disabled={!doc.available}
                        onClick={() => doc.available && select(doc.name)}
                        className={`text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                            ${!doc.available
                                ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                                : booking.doctor_name === doc.name
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'}`}
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 select-none">
                            {initials(doc.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{doc.specialty}</p>
                            <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                doc.available ? 'text-emerald-700 bg-emerald-100' : 'text-red-600 bg-red-100'
                            }`}>
                                {doc.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        {booking.doctor_name === doc.name && (
                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <button onClick={() => dispatch(prevStep())}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    ← Back
                </button>
            </div>
        </div>
    );
}
