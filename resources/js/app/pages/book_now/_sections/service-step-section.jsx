import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingField, nextStep } from '../_redux/book-now-slice';
import { fetchBookingServicesThunk } from '../_redux/book-now-thunk';
import { getServiceIcon } from '../../../utils/service-icons';

function formatDuration(mins) {
    if (!mins) return '';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
}

function SkeletonCard() {
    return (
        <div className="border-2 border-gray-100 rounded-2xl p-4 animate-pulse flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-5 bg-gray-100 rounded-full w-16 mt-1" />
            </div>
        </div>
    );
}

export default function ServiceStepSection() {
    const dispatch = useDispatch();
    const { booking, bookingServices, bookingServicesLoading } = useSelector((s) => s.bookNow);

    useEffect(() => {
        if (bookingServices.length === 0) {
            dispatch(fetchBookingServicesThunk());
        }
    }, []);

    const select = (name) => {
        dispatch(setBookingField({ service: name }));
        dispatch(nextStep());
    };

    return (
        <div>
            <h2 className="text-base font-bold text-gray-700 mb-4">Select a Service</h2>

            {bookingServicesLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {!bookingServicesLoading && bookingServices.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                    No services available at the moment.
                </div>
            )}

            {!bookingServicesLoading && bookingServices.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookingServices.map((svc) => {
                        const { emoji, bg } = getServiceIcon(svc.category);
                        const isSelected = booking.service === svc.name;
                        return (
                            <button
                                key={svc.id}
                                onClick={() => select(svc.name)}
                                className={`text-left flex items-start gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                        : 'border-gray-100 bg-white hover:border-blue-200'
                                }`}
                            >
                                {/* Emoji icon */}
                                <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                                    {emoji}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm leading-snug">{svc.name}</p>
                                    {svc.description && (
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{svc.description}</p>
                                    )}
                                    {svc.duration && (
                                        <span className="inline-block mt-1.5 text-[11px] font-semibold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                                            {formatDuration(svc.duration)}
                                        </span>
                                    )}
                                </div>

                                {isSelected && (
                                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

