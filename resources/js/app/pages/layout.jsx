import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import NotificationBell from '../notifications/NotificationBell';
import {
    CalendarDaysIcon,
    ClockIcon,
    UserGroupIcon,
    UserIcon,
    Cog6ToothIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

const DASHBOARD_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    </svg>
);

/** Nav shown to patients / clients */
const clientNavItems = [
    { label: 'Home',            href: '/dashboard',        icon: DASHBOARD_ICON },
    { label: 'My Appointments', href: '/appointments',     icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { label: 'Book Now',        href: '/appointments/new', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { label: 'My Profile',      href: '/profile',          icon: <UserIcon className="w-5 h-5" /> },
];

/** Nav shown to clinic admins */
const adminNavItems = [
    { label: 'Dashboard',    href: '/dashboard',    icon: DASHBOARD_ICON },
    { label: 'User Management', href: '/user-management', icon: <UserGroupIcon className="w-5 h-5" />, onlySuperAdmin: true },
    { label: 'Appointments', href: '/appointments', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    {
        label: 'Schedule',
        href: '/schedule',
        icon: <ClockIcon className="w-5 h-5" />,
    },
    { label: 'Patients', href: '/patients', icon: <HeartIcon className="w-5 h-5" /> },
    { label: 'Doctors',  href: '/doctors',  icon: <UserGroupIcon className="w-5 h-5" /> },
    {
        label: 'Services',
        href: '/services',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
        ),
    },
    {
        label: 'Reports',
        href: '/reports',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
        ),
    },
];

/** Nav shown to doctors */
const doctorNavItems = [
    { label: 'Dashboard',    href: '/dashboard',    icon: DASHBOARD_ICON },
    { label: 'Appointments', href: '/appointments', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { label: 'Patients',     href: '/patients',     icon: <HeartIcon className="w-5 h-5" /> },
    { label: 'My Profile',   href: '/profile',      icon: <UserIcon className="w-5 h-5" /> },
];

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { url, props } = usePage();
    const authUser = props.auth?.user;
    const userInitial = authUser?.name?.[0]?.toUpperCase() ?? 'U';
    const role = authUser?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';
    const isDoctor = role === 'doctor';
    const isStaff = isAdmin || role === 'appointment_setter';
    const navItems = isStaff ? adminNavItems : (isDoctor ? doctorNavItems : clientNavItems);

    const ROLE_LABELS = {
        super_admin:         'Super Admin',
        admin:               'Admin',
        appointment_setter:  'Appointment Setter',
        doctor:              'Doctor',
        patient:             'Patient',
    };
    const ROLE_COLORS = {
        super_admin:         'bg-red-500/20 text-red-200',
        admin:               'bg-blue-500/20 text-blue-200',
        appointment_setter:  'bg-purple-500/20 text-purple-200',
        doctor:              'bg-teal-500/20 text-teal-200',
        patient:             'bg-emerald-500/20 text-emerald-200',
    };
    const roleBadge      = ROLE_LABELS[role] ?? role;
    const roleBadgeColor = ROLE_COLORS[role] ?? 'bg-gray-500/20 text-gray-200';

    const normalize = (u = '') => u.replace(/\/+$/, '');
    const isActive = (href) => normalize(url) === normalize(href);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Sidebar Overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    flex flex-col w-56 bg-[#0d2137] text-white
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                            <span className="text-base font-bold tracking-wide">CampanyName</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded hover:bg-white/10 transition-colors lg:hidden"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="hidden lg:block p-1 rounded hover:bg-white/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Role badge */}
                <div className="px-4 py-2 border-b border-white/10">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${roleBadgeColor}`}>
                        {roleBadge}
                    </span>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
                    {navItems.map((item) => {
                        if (item.onlySuperAdmin && authUser?.role !== 'super_admin') return null;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive(item.href)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                <span className={isActive(item.href) ? 'text-white' : 'text-blue-200/60'}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <header className="flex items-center gap-4 px-6 py-3 bg-white shadow-sm z-10 flex-shrink-0">
                    {/* Hamburger */}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    )}

                    {/* Search */}
                    <div className="flex-1 max-w-md relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        {/* Notification Bell */}
                        <NotificationBell />

                        {/* User Info + dropdown wrapper */}
                        <div className="relative">
                            <button onClick={() => setUserMenuOpen((s) => !s)} className="flex items-center gap-2 cursor-pointer group focus:outline-none">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-semibold select-none">
                                    {userInitial}
                                </div>
                                <div className="hidden sm:block leading-tight">
                                    <p className="text-sm font-semibold text-gray-800">{authUser?.name ?? 'User'}</p>
                                    <p className="text-xs text-gray-400">{authUser?.email ?? ''}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>

                            {/* User dropdown anchored to wrapper */}
                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border py-1 z-50 origin-top-right">
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                    <Link href="/logout" method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
