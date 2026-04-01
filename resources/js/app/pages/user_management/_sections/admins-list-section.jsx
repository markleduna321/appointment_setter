import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffUsersThunk, deleteStaffUserThunk } from '../_redux/user-management-thunk';

const ROLE_BADGE = {
    super_admin:       'bg-red-100 text-red-700',
    admin:             'bg-blue-100 text-blue-700',
    appointment_setter: 'bg-purple-100 text-purple-700',
};

const ROLE_LABEL = {
    super_admin:       'Super Admin',
    admin:             'Admin',
    appointment_setter: 'Appointment Setter',
};

export default function AdminsListSection() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((s) => s.userManagement);

    useEffect(() => { dispatch(fetchStaffUsersThunk()); }, [dispatch]);

    function handleDelete(id, role) {
        if (role === 'super_admin') return;
        if (!confirm('Are you sure you want to delete this account?')) return;
        dispatch(deleteStaffUserThunk(id));
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Staff Accounts</h3>
                <span className="text-xs text-gray-400">{users.length} {users.length === 1 ? 'user' : 'users'}</span>
            </div>

            {loading ? (
                <div className="p-5 space-y-2">
                    {[1,2,3].map((i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="p-5 text-sm text-red-600">{error}</div>
            ) : users.length === 0 ? (
                <div className="p-5 text-sm text-gray-500">No staff accounts yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Role</th>
                                <th className="px-5 py-3">Created</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {ROLE_LABEL[u.role] ?? u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-3">
                                        {u.role !== 'super_admin' && (
                                            <button onClick={() => handleDelete(u.id, u.role)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
