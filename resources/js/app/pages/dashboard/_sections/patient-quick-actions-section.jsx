import { Link } from '@inertiajs/react';
import {
    PlusCircleIcon,
    CalendarDaysIcon,
    UserIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

const ACTIONS = [
    {
        label: 'Book Appointment',
        desc:  'Schedule a new clinic visit',
        href:  '/appointments/new',
        icon:  PlusCircleIcon,
        color: 'text-blue-600',
        bg:    'bg-blue-50',
        border:'border-blue-100',
        hover: 'hover:bg-blue-100',
    },
    {
        label: 'My Appointments',
        desc:  'View and manage your bookings',
        href:  '/appointments',
        icon:  CalendarDaysIcon,
        color: 'text-emerald-600',
        bg:    'bg-emerald-50',
        border:'border-emerald-100',
        hover: 'hover:bg-emerald-100',
    },
    {
        label: 'My Profile',
        desc:  'Update your personal details',
        href:  '/profile',
        icon:  UserIcon,
        color: 'text-violet-600',
        bg:    'bg-violet-50',
        border:'border-violet-100',
        hover: 'hover:bg-violet-100',
    },
    {
        label: 'Our Doctors',
        desc:  'Browse available specialists',
        href:  '/doctors',
        icon:  HeartIcon,
        color: 'text-rose-600',
        bg:    'bg-rose-50',
        border:'border-rose-100',
        hover: 'hover:bg-rose-100',
    },
];

export default function PatientQuickActionsSection() {
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACTIONS.map(({ label, desc, href, icon: Icon, color, bg, border, hover }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`flex flex-col items-center text-center gap-2.5 p-4 rounded-2xl border ${bg} ${border} ${hover} transition-colors`}
                    >
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center border ${border}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${color}`}>{label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
