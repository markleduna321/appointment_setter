import { useSelector } from 'react-redux';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ClockIcon } from '@heroicons/react/24/solid';

const STATUS_STYLES = {
    confirmed: 'bg-green-100 text-green-700',
    pending:   'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-600',
};

// Demo rows shown when there's no real data yet
const DEMO_APPOINTMENTS = [
    {
        id: 1,
        doctor: 'Dr. Sarah Mitchell',
        specialty: 'Cardiologist',
        date: 'Apr 5, 2026',
        time: '10:00 AM',
        location: 'Main Branch',
        status: 'confirmed',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&q=80',
    },
    {
        id: 2,
        doctor: 'Dr. James Carter',
        specialty: 'General Physician',
        date: 'Apr 8, 2026',
        time: '2:30 PM',
        location: 'North Wing',
        status: 'pending',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&q=80',
    },
    {
        id: 3,
        doctor: 'Dr. Anika Patel',
        specialty: 'Dermatologist',
        date: 'Apr 12, 2026',
        time: '11:15 AM',
        location: 'Main Branch',
        status: 'confirmed',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&q=80',
    },
];

export default function DashboardTableSection() {
    const { upcoming_appointments, loading } = useSelector((state) => state.dashboard);
    const rows = upcoming_appointments.length > 0 ? upcoming_appointments : DEMO_APPOINTMENTS;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-gray-800">Upcoming Appointments</h3>
                    {upcoming_appointments.length === 0 && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                            Demo data
                        </span>
                    )}
                </div>
                <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">
                    View all →
                </a>
            </div>

            {loading ? (
                <div className="p-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500">Doctor</th>
                                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500">Date & Time</th>
                                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500">Location</th>
                                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                                    <th className="px-5 py-2.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {rows.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={appt.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctor)}&background=3b82f6&color=fff&size=40`}
                                                    alt={appt.doctor}
                                                    className="w-9 h-9 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800">{appt.doctor}</p>
                                                    <p className="text-[11px] text-blue-600">{appt.specialty}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-xs font-semibold text-gray-700">{appt.date}</p>
                                            <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                                                <ClockIcon className="w-3 h-3" />
                                                <span className="text-[11px]">{appt.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <MapPinIcon className="w-3.5 h-3.5" />
                                                <span className="text-xs">{appt.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button className="text-xs text-blue-600 font-semibold hover:underline">
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-gray-50">
                        {rows.map((appt) => (
                            <div key={appt.id} className="px-4 py-3 flex items-start gap-3">
                                <img
                                    src={appt.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctor)}&background=3b82f6&color=fff&size=40`}
                                    alt={appt.doctor}
                                    className="w-10 h-10 rounded-full object-cover mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-bold text-gray-800 truncate">{appt.doctor}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-blue-600 mb-1">{appt.specialty}</p>
                                    <p className="text-[11px] text-gray-500">{appt.date} • {appt.time}</p>
                                    <p className="text-[11px] text-gray-400">{appt.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
