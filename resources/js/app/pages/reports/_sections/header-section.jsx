import { useDispatch } from 'react-redux';
import { usePage } from '@inertiajs/react';
import { ChartBarSquareIcon } from '@heroicons/react/24/outline';

export default function HeaderSection() {
    const { auth } = usePage().props;

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                    <ChartBarSquareIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reports</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Appointment summaries and doctor performance.</p>
                </div>
            </div>
        </div>
    );
}
