import { useDispatch } from 'react-redux';
import { usePage } from '@inertiajs/react';
import { openModal } from '../_redux/service-slice';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function HeaderSection() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100">
                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Services</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isAdmin
                            ? 'Manage clinic services and offerings.'
                            : 'Browse available clinic services.'}
                    </p>
                </div>
            </div>

            {isAdmin && (
                <button
                    onClick={() => dispatch(openModal(null))}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Service
                </button>
            )}
        </div>
    );
}
