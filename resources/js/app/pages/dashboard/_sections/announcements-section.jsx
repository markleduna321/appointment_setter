import { useSelector } from 'react-redux';

export default function AnnouncementsSection() {
    const { announcements } = useSelector((state) => state.dashboard);

    const list = (announcements && announcements.length > 0) ? announcements : [
        {
            id: 1,
            title: 'Welcome to MediBook!',
            message: 'Your clinic scheduling portal is ready. Book your first appointment today.',
            type: 'info',
            created_at: 'Just now',
        },
        {
            id: 2,
            title: 'System Maintenance',
            message: 'Scheduled maintenance on Apr 10 at 2:00 AM. The system will be briefly unavailable.',
            type: 'warning',
            created_at: 'Apr 4, 2026',
        },
        {
            id: 3,
            title: 'New Doctors Available',
            message: 'Three new specialists have joined our network this week.',
            type: 'success',
            created_at: 'Apr 3, 2026',
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-800">Announcements</h3>
            </div>
            <div className="p-4 space-y-3">
                {list.map((item) => {
                    const typeStyles = {
                        info:    'bg-blue-50 border-blue-200 text-blue-800',
                        warning: 'bg-amber-50 border-amber-200 text-amber-800',
                        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
                        error:   'bg-red-50 border-red-200 text-red-800',
                    };
                    const dotColors = {
                        info: 'bg-blue-400', warning: 'bg-amber-400',
                        success: 'bg-emerald-400', error: 'bg-red-400',
                    };
                    return (
                        <div key={item.id} className={`rounded-xl border p-3.5 ${typeStyles[item.type] ?? typeStyles.info}`}>
                            <div className="flex items-start gap-2">
                                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColors[item.type] ?? dotColors.info}`} />
                                <div>
                                    <p className="text-xs font-bold">{item.title}</p>
                                    <p className="text-[11px] mt-0.5 leading-relaxed opacity-80">{item.message}</p>
                                    <p className="text-[10px] mt-1 opacity-60">{item.created_at}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
