import { useState } from 'react';
import { Bars3Icon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
];

export default function HeaderSection() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    if (typeof window !== 'undefined') {
        window.onscroll = () => setScrolled(window.scrollY > 20);
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                        <CalendarDaysIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="leading-tight">
                        <span className="block text-base font-bold text-gray-900 leading-none">MediBook</span>
                        <span className="block text-[10px] text-blue-600 font-medium tracking-wide">Online Clinic Scheduler</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="/login"
                        className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Log In
                    </a>
                    <Link
                        href="/appointments/new"
                        className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-blue-200"
                    >
                        Book Appointment
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1 shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-2 flex flex-col gap-2">
                        <a href="/login" className="block text-center py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            Log In
                        </a>
                        <Link href="/appointments/new" className="block text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                            Book Appointment
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
