import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function PatientHeaderSection() {
    const { props } = usePage();
    const user = props.auth?.user;
    const firstName = user?.name?.split(' ')[0] ?? 'there';

    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 12 ? 'Good morning' :
        hour < 18 ? 'Good afternoon' :
                    'Good evening';

    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-sm text-blue-200 font-medium">{greeting},</p>
                    <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">{firstName}! 👋</h1>
                    <p className="text-sm text-blue-100/80 mt-1">
                        How are you feeling today? Let us help you get the care you need.
                    </p>
                </div>
                <Link
                    href="/appointments/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl shadow hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                    <CalendarDaysIcon className="w-4 h-4" />
                    Book Appointment
                </Link>
            </div>
        </div>
    );
}
