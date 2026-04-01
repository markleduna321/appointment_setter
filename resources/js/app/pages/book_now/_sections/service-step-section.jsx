import { useDispatch, useSelector } from 'react-redux';
import { setBookingField, nextStep } from '../_redux/book-now-slice';

const SERVICES = [
    { name: 'General Consultation', icon: '🩺', duration: '30 min', desc: 'Primary care visit for general health concerns.' },
    { name: 'Dental Check-up',      icon: '🦷', duration: '45 min', desc: 'Routine oral examination and cleaning.' },
    { name: 'Eye Examination',      icon: '👁️', duration: '30 min', desc: 'Vision test and eye health screening.' },
    { name: 'Cardiology',           icon: '❤️', duration: '60 min', desc: 'Heart health evaluation and consultation.' },
    { name: 'Pediatrics',           icon: '🧒', duration: '30 min', desc: 'Health check-ups and care for children.' },
    { name: 'Dermatology',          icon: '🔬', duration: '30 min', desc: 'Skin condition consultation and treatment.' },
    { name: 'Orthopedics',          icon: '🦴', duration: '45 min', desc: 'Bone and joint consultation.' },
    { name: 'OB-GYN',               icon: '💊', duration: '45 min', desc: "Women's health and prenatal care." },
];

export default function ServiceStepSection() {
    const dispatch  = useDispatch();
    const { booking } = useSelector((s) => s.bookNow);

    const select = (name) => {
        dispatch(setBookingField({ service: name }));
        dispatch(nextStep());
    };

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((svc) => (
                    <button
                        key={svc.name}
                        onClick={() => select(svc.name)}
                        className={`text-left flex items-start gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-md
                            ${booking.service === svc.name
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-blue-200'}`}
                    >
                        <span className="text-2xl mt-0.5 select-none">{svc.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm">{svc.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{svc.desc}</p>
                            <span className="inline-block mt-1.5 text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                {svc.duration}
                            </span>
                        </div>
                        {booking.service === svc.name && (
                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
