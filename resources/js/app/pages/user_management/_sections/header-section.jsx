export default function HeaderSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Create and manage administrator accounts for the system.</p>
                </div>
            </div>
        </div>
    );
}
