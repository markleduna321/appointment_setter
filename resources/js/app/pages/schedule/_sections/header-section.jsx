import { useDispatch, useSelector } from 'react-redux';
import { prevWeek, nextWeek, goToToday } from '../_redux/schedule-slice';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function getWeekEnd(weekStart) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
}

function formatWeekRange(weekStart) {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);

    if (start.getMonth() === end.getMonth()) {
        return `${MONTH_FULL[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
}

export default function HeaderSection() {
    const dispatch = useDispatch();
    const { weekStart, appointments, loading } = useSelector((s) => s.schedule);

    const total    = appointments.filter((a) => a.status !== 'cancelled').length;
    const pending  = appointments.filter((a) => a.status === 'pending').length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Left: title + week range */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                    <CalendarDaysIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Schedule</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{formatWeekRange(weekStart)}</p>
                </div>
                {!loading && (
                    <div className="flex gap-2 ml-1 flex-wrap">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                            {total} this week
                        </span>
                        {pending > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                                {pending} pending
                            </span>
                        )}
                        {confirmed > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                                {confirmed} confirmed
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Right: navigation */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => dispatch(goToToday())}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                    Today
                </button>
                <div className="flex  border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => dispatch(prevWeek())}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => dispatch(nextWeek())}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-l border-gray-200 disabled:opacity-40"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
