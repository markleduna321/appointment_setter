import { usePage } from '@inertiajs/react';
import { UserIcon } from '@heroicons/react/24/outline';

export default function HeaderSection() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50">
                    <UserIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your account information and settings.</p>
                </div>
            </div>
        </div>
    );
}
