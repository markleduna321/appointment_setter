import { useDispatch } from 'react-redux';
import { usePage } from '@inertiajs/react';
import { openModal } from '../_redux/patient-slice';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function HeaderSection() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const canAddPatient = role === 'admin' || role === 'super_admin' || role === 'appointment_setter';

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100">
                    <UserGroupIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Patients</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage registered patients and their contact details.</p>
                </div>
            </div>

            {canAddPatient && (
                <button
                    onClick={() => dispatch(openModal(null))}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Patient
                </button>
            )}
        </div>
    );
}
