import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openDetail } from '../_redux/schedule-slice';

// ─── Constants ──────────────────────────────────────────────────────────────
const HOUR_HEIGHT = 64; // px per 1-hour slot
const TIME_START  = 7;  // 7 AM
const TIME_END    = 20; // 8 PM
const HOURS       = Array.from({ length: TIME_END - TIME_START }, (_, i) => TIME_START + i);

const DAY_LABELS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_CARD = {
    pending:   'bg-amber-50  border-l-amber-400  text-amber-800',
    confirmed: 'bg-blue-50   border-l-blue-500   text-blue-800',
    completed: 'bg-emerald-50 border-l-emerald-500 text-emerald-800',
    cancelled: 'bg-gray-50   border-l-gray-300   text-gray-400',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getWeekDays(weekStart) {
    const days = [];
    const base = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

function formatHour(h) {
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12} ${suffix}`;
}

function apptTop(time) {
    const [h, m] = (time ?? '00:00').split(':').map(Number);
    return (h - TIME_START + m / 60) * HOUR_HEIGHT;
}

function formatTime(time) {
    const [h, m] = (time ?? '00:00').split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

// ─── Current time indicator ──────────────────────────────────────────────────
function CurrentTimeLine() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes();
    if (h < TIME_START || h >= TIME_END) return null;
    const top = (h - TIME_START + m / 60) * HOUR_HEIGHT;
    return (
        <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center" style={{ top }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 -ml-1.5" />
            <div className="flex-1 h-0.5 bg-red-400" />
        </div>
    );
}

// ─── Single appointment block ─────────────────────────────────────────────────
function AppointmentBlock({ appt, onClick, col, colCount, hoveredId, onHover }) {
    const top = apptTop(appt.time);
    const colorClass = STATUS_CARD[appt.status] ?? STATUS_CARD.pending;
    const isCancelled = appt.status === 'cancelled';
    const isHovered = hoveredId === appt.id;

    // Divide the column width evenly among overlapping appointments
    const widthPct  = 100 / colCount;
    const leftPct   = col * widthPct;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => onHover(appt.id)}
            onMouseLeave={() => onHover(null)}
            className={`absolute rounded-lg border-l-[3px] px-2 pt-1 pb-1.5 cursor-pointer transition-all duration-150 ${colorClass} ${
                isHovered
                    ? 'ring-2 ring-offset-1 ring-blue-400 shadow-lg scale-[1.03] brightness-100'
                    : 'shadow-sm hover:brightness-95'
            }`}
            style={{
                top,
                minHeight: '52px',
                left: `calc(2px + ${leftPct}%)`,
                width: `calc(${widthPct}% - 4px)`,
                zIndex: isHovered ? 50 : 10,
            }}
        >
            <p className={`text-xs font-semibold leading-tight truncate ${isCancelled ? 'line-through opacity-60' : ''}`}>
                {appt.patient_name || 'Patient'}
            </p>
            <p className="text-xs opacity-75 truncate">{appt.service}</p>
            <p className="text-[10px] opacity-55 truncate">Dr. {appt.doctor_name}</p>
            <p className="text-[10px] opacity-60 mt-0.5">{formatTime(appt.time)}</p>
        </div>
    );
}

// ─── One day column ───────────────────────────────────────────────────────────
function DayColumn({ dateStr, appointments, isToday }) {
    const dispatch = useDispatch();
    const totalHeight = HOURS.length * HOUR_HEIGHT;
    const [hoveredId, setHoveredId] = useState(null);

    // ── Compute overlap columns ──────────────────────────────────────────────
    // Sort by time, then assign each appointment to a column slot so overlapping
    // appointments sit side-by-side rather than stacking on top of each other.
    const sorted = [...appointments].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));

    // Each entry: { appt, col, colCount }
    const laid = [];
    const groups = []; // groups of overlapping appointments

    for (const appt of sorted) {
        const top = apptTop(appt.time);
        const bottom = top + 52; // minHeight

        // Find an existing group this overlaps with
        let placed = false;
        for (const group of groups) {
            const overlaps = group.some(({ appt: a }) => {
                const aTop = apptTop(a.time);
                return top < aTop + 52 && bottom > aTop;
            });
            if (overlaps) {
                group.push({ appt, top, bottom });
                placed = true;
                break;
            }
        }
        if (!placed) groups.push([{ appt, top, bottom }]);
    }

    const colMap = new Map(); // appt.id → { col, colCount }
    for (const group of groups) {
        const n = group.length;
        group.forEach(({ appt }, idx) => colMap.set(appt.id, { col: idx, colCount: n }));
    }

    return (
        <div
            className={`relative border-l border-gray-100 ${isToday ? 'bg-indigo-50/30' : ''}`}
            style={{ height: totalHeight }}
        >
            {/* Hour grid lines */}
            {HOURS.map((h) => (
                <div key={h} className="absolute w-full border-t border-gray-100" style={{ top: (h - TIME_START) * HOUR_HEIGHT }} />
            ))}
            {/* Half-hour dashed lines */}
            {HOURS.map((h) => (
                <div key={`${h}-half`} className="absolute w-full border-t border-dashed border-gray-50" style={{ top: (h - TIME_START + 0.5) * HOUR_HEIGHT }} />
            ))}

            {/* Appointments */}
            {sorted.map((appt) => {
                const { col, colCount } = colMap.get(appt.id) ?? { col: 0, colCount: 1 };
                return (
                    <AppointmentBlock
                        key={appt.id}
                        appt={appt}
                        col={col}
                        colCount={colCount}
                        hoveredId={hoveredId}
                        onHover={setHoveredId}
                        onClick={() => dispatch(openDetail(appt))}
                    />
                );
            })}

            {/* Current time line */}
            {isToday && <CurrentTimeLine />}
        </div>
    );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-12 bg-gray-50 border-b border-gray-100" />
            <div className="h-96 bg-gray-50" />
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WeeklyCalendarSection() {
    const { appointments, weekStart, loading } = useSelector((s) => s.schedule);
    const todayStr  = new Date().toISOString().split('T')[0];
    const weekDays  = getWeekDays(weekStart);

    // Group appointments by date string
    const apptsByDay = appointments.reduce((acc, appt) => {
        const key = typeof appt.date === 'string'
            ? appt.date.split('T')[0]
            : appt.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(appt);
        return acc;
    }, {});

    if (loading) return <Skeleton />;

    const totalHeight = HOURS.length * HOUR_HEIGHT;
    const gridTemplate = '56px repeat(7, 1fr)';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Day headers */}
            <div
                className="border-b border-gray-100 bg-white sticky top-0 z-30"
                style={{ display: 'grid', gridTemplateColumns: gridTemplate }}
            >
                {/* time gutter header */}
                <div className="border-r border-gray-100" />

                {weekDays.map((dateStr, i) => {
                    const d       = new Date(dateStr);
                    const isToday = dateStr === todayStr;
                    return (
                        <div
                            key={dateStr}
                            className={`py-3 text-center border-l border-gray-100 ${isToday ? 'bg-indigo-50' : ''}`}
                        >
                            <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? 'text-indigo-500' : 'text-gray-400'}`}>
                                {DAY_LABELS[i]}
                            </p>
                            <p className={`text-lg font-extrabold mt-0.5 w-9 h-9 mx-auto flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-800'}`}>
                                {d.getDate()}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{MONTHS[d.getMonth()]}</p>
                            {/* appointment count badge */}
                            {(apptsByDay[dateStr]?.length ?? 0) > 0 && (
                                <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isToday ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {apptsByDay[dateStr].length}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Scrollable time grid */}
            <div className="overflow-y-auto" style={{ maxHeight: '620px' }}>
                <div
                    className="relative"
                    style={{ display: 'grid', gridTemplateColumns: gridTemplate, height: totalHeight }}
                >
                    {/* Time gutter */}
                    <div className="relative border-r border-gray-100">
                        {HOURS.map((h) => (
                            <div
                                key={h}
                                className="absolute w-full flex items-start justify-end pr-2"
                                style={{ top: (h - TIME_START) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                            >
                                <span className="text-[10px] text-gray-400 font-medium -mt-2 leading-none">
                                    {formatHour(h)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDays.map((dateStr) => (
                        <DayColumn
                            key={dateStr}
                            dateStr={dateStr}
                            appointments={apptsByDay[dateStr] ?? []}
                            isToday={dateStr === todayStr}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
