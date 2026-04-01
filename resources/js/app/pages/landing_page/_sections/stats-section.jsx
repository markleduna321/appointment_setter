import { UserGroupIcon, CalendarDaysIcon, BuildingOffice2Icon, ClockIcon } from '@heroicons/react/24/outline';

const stats = [
    {
        icon: <UserGroupIcon className="w-8 h-8" />,
        value: '50,000+',
        label: 'Patients Served',
        desc: 'Trust us with their healthcare',
        gradient: 'from-blue-500 to-blue-700',
    },
    {
        icon: <CalendarDaysIcon className="w-8 h-8" />,
        value: '120,000+',
        label: 'Appointments Booked',
        desc: 'Successfully completed',
        gradient: 'from-cyan-500 to-teal-600',
    },
    {
        icon: <BuildingOffice2Icon className="w-8 h-8" />,
        value: '80+',
        label: 'Verified Doctors',
        desc: 'Across 15 specialties',
        gradient: 'from-violet-500 to-purple-700',
    },
    {
        icon: <ClockIcon className="w-8 h-8" />,
        value: '< 2 min',
        label: 'Avg. Booking Time',
        desc: 'From search to confirmed',
        gradient: 'from-amber-400 to-orange-500',
    },
];

export default function StatsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="relative overflow-hidden bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100 group"
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} text-white mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                                {s.icon}
                            </div>

                            <p className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</p>
                            <p className="text-sm font-bold text-gray-700 mb-0.5">{s.label}</p>
                            <p className="text-xs text-gray-400">{s.desc}</p>

                            {/* Decorative corner circle */}
                            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
