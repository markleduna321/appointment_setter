import { Link } from '@inertiajs/react';
import {
    PlusCircleIcon,
    ListBulletIcon,
    UserGroupIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const QUICK_ACTIONS = [
    {
        label: 'Book Appointment',
        icon: PlusCircleIcon,
        href: '/appointments/new',
        color: 'text-blue-600',
        bg: 'bg-blue-50 hover:bg-blue-100',
    },
    {
        label: 'View Activities',
        icon: ListBulletIcon,
        href: '/activities',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 hover:bg-emerald-100',
    },
    {
        label: 'Doctors List',
        icon: UserGroupIcon,
        href: '/doctors',
        color: 'text-violet-600',
        bg: 'bg-violet-50 hover:bg-violet-100',
    },
    {
        label: 'My Profile',
        icon: UserIcon,
        href: '/profile',
        color: 'text-amber-600',
        bg: 'bg-amber-50 hover:bg-amber-100',
    },
    {
        label: 'Settings',
        icon: Cog6ToothIcon,
        href: '/settings',
        color: 'text-gray-600',
        bg: 'bg-gray-50 hover:bg-gray-100',
    },
    {
        label: 'Sign Out',
        icon: ArrowRightOnRectangleIcon,
        href: '/logout',
        color: 'text-red-500',
        bg: 'bg-red-50 hover:bg-red-100',
        isForm: true,
    },
];

export default function QuickActionsSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map(({ label, icon: Icon, href, color, bg, isForm }) =>
                    isForm ? (
                        <form key={label} method="POST" action="/logout">
                            <input type="hidden" name="_token" value={document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''} />
                            <button
                                type="submit"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${bg} ${color}`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        </form>
                    ) : (
                        <Link key={label} href={href} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${bg} ${color}`}>
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}
