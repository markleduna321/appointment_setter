import { useDispatch } from 'react-redux';
import { Link, usePage } from '@inertiajs/react';
import { openModal } from '../_redux/appointment-slice';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function HeaderSection() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isPatient = role === 'patient';

    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {isPatient ? 'My Appointments' : 'Appointments'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    {isPatient ? 'View and manage your clinic appointments.' : 'Manage and track all clinic appointments.'}
                </p>
            </div>
            {isPatient ? (
                <Link
                    href="/appointments/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Book Appointment
                </Link>
            ) : (
                <button
                    onClick={() => dispatch(openModal(null))}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    New Appointment
                </button>
            )}
        </div>
    );
}
