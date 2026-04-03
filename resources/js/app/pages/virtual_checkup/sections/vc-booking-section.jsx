import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import StepperSection from '../../book_now/_sections/stepper-section';
import ServiceStepSection from '../../book_now/_sections/service-step-section';
import DoctorStepSection from '../../book_now/_sections/doctor-step-section';
import DateTimeStepSection from '../../book_now/_sections/datetime-step-section';
import ConfirmStepSection from '../../book_now/_sections/confirm-step-section';
import SuccessSection from '../../book_now/_sections/success-section';
import { resetBooking } from '../../book_now/_redux/book-now-slice';

export default function VcBookingSection({ open, onClose }) {
    const dispatch = useDispatch();
    const { step, submitted } = useSelector((s) => s.bookNow);

    if (!open) return null;

    const handleClose = () => {
        if (!submitted) dispatch(resetBooking());
        onClose();
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            {/* Panel */}
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Apply for a Virtual Check Up</h2>
                            <p className="text-xs text-gray-500">Admin will review and confirm your request.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {submitted ? (
                        <SuccessSection onClose={handleClose} />
                    ) : (
                        <>
                            <StepperSection />
                            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                {step === 1 && <ServiceStepSection />}
                                {step === 2 && <DoctorStepSection />}
                                {step === 3 && <DateTimeStepSection />}
                                {step === 4 && <ConfirmStepSection />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
