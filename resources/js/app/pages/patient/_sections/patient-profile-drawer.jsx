import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePage } from '@inertiajs/react';
import {
    XMarkIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ClipboardDocumentListIcon,
    PlusIcon,
    ClockIcon,
    UserIcon,
    BeakerIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { openModal as openAppointmentModal } from '../../appointments/_redux/appointment-slice';
import axios from 'axios';
import { closeDrawer, openRecordModal } from '../_redux/patient-record-slice';
import { fetchPatientRecordsThunk, fetchPatientRecordThunk, deletePatientRecordThunk } from '../_redux/patient-record-thunk';

const AVATAR_GRADIENTS = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-600',
    'from-teal-400 to-cyan-600',
    'from-orange-400 to-red-500',
    'from-green-400 to-emerald-600',
    'from-yellow-400 to-amber-600',
];

function avatarGradient(name) {
    let hash = 0;
    for (const c of (name || '')) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function initials(name) {
    return (name || '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function fmtDate(val) {
    if (!val) return null;
    return new Date(val).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function fmtDateTime(val) {
    if (!val) return '\u2014';
    return new Date(val).toLocaleString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm text-gray-700 font-medium">{value}</p>
            </div>
        </div>
    );
}

function RecordCard({ record, onView, onEdit, onDelete, isAdmin }) {
    return (
        <div className="group border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:bg-green-50/30 transition-all">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <ClockIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-500">{fmtDateTime(record.visited_at)}</span>
                    </div>
                    {record.chief_complaint && (
                        <p className="text-sm font-semibold text-gray-800 truncate">{record.chief_complaint}</p>
                    )}
                    {record.diagnosis && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">Dx: {record.diagnosis}</p>
                    )}
                    {record.doctor && (
                        <p className="text-xs text-gray-400 mt-1">
                            Dr. {record.doctor.name} &middot; {record.doctor.specialty}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={() => onView(record)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                        View
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => onEdit(record)}
                                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(record)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProfileTab({ patient }) {
    return (
        <div className="px-5 py-4 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
                <InfoRow icon={EnvelopeIcon} label="Email" value={patient.email} />
                <InfoRow icon={PhoneIcon} label="Phone" value={patient.phone} />
                <InfoRow icon={CalendarDaysIcon} label="Date of Birth" value={patient.dob ? fmtDate(patient.dob) : null} />
                <InfoRow icon={CalendarDaysIcon} label="Member Since" value={fmtDate(patient.created_at)} />
            </div>
            {patient.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{patient.notes}</p>
                </div>
            )}
        </div>
    );
}

function RecordsTab({ patient, isAdmin }) {
    const dispatch = useDispatch();
    const records = useSelector((s) => s.patientRecords.recordsByPatient[patient.id] || []);
    const loading = useSelector((s) => s.patientRecords.loadingRecords);

    const handleView   = (r) => dispatch(fetchPatientRecordThunk({ patientId: patient.id, recordId: r.id }));
    const handleEdit   = (r) => dispatch(openRecordModal({ mode: 'edit', record: r }));
    const handleDelete = (r) => {
        if (confirm('Delete this checkup record?')) {
            dispatch(deletePatientRecordThunk({ patientId: patient.id, recordId: r.id }));
        }
    };

    return (
        <div className="flex flex-col h-full">
            {isAdmin && (
                <div className="px-5 pt-4 pb-3 flex-shrink-0">
                    <button
                        onClick={() => dispatch(openRecordModal({ mode: 'add', record: null }))}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Checkup Record
                    </button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2">
                {loading ? (
                    [0, 1, 2].map((i) => (
                        <div key={i} className="animate-pulse border border-gray-100 rounded-xl p-4">
                            <div className="h-3 bg-gray-200 rounded w-40 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-56 mb-1" />
                            <div className="h-3 bg-gray-100 rounded w-32" />
                        </div>
                    ))
                ) : records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                            <ClipboardDocumentListIcon className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-500">No checkup records yet</p>
                        {isAdmin && (
                            <p className="text-xs text-gray-400 mt-1">Click Add Checkup Record to start</p>
                        )}
                    </div>
                ) : (
                    records.map((r) => (
                        <RecordCard
                            key={r.id}
                            record={r}
                            isAdmin={isAdmin}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function AppointmentsTab({ patient, isAdmin }) {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        axios.get('/api/appointments', { params: { user_id: patient.id, per_page: 50 } })
            .then((res) => { if (mounted) setAppointments(res.data?.data ?? []); })
            .catch(() => { if (mounted) setAppointments([]); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [patient.id]);

    const handleBookAppointment = () => {
        dispatch(openAppointmentModal({
            _prefill: { patient_name: patient.name, user_id: patient.id },
        }));
    };

    const STATUS_CFG = {
        pending:   { label: 'Pending',   cls: 'bg-yellow-100 text-yellow-700' },
        confirmed: { label: 'Confirmed', cls: 'bg-blue-100 text-blue-700'   },
        completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
        cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-500'    },
    };

    return (
        <div className="flex flex-col h-full">
            {isAdmin && (
                <div className="px-5 pt-4 pb-3 flex-shrink-0">
                    <button
                        onClick={handleBookAppointment}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Book Appointment
                    </button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2">
                {loading ? (
                    [0, 1, 2].map((i) => (
                        <div key={i} className="animate-pulse border border-gray-100 rounded-xl p-4">
                            <div className="h-3 bg-gray-200 rounded w-40 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-56 mb-1" />
                            <div className="h-3 bg-gray-100 rounded w-24" />
                        </div>
                    ))
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                            <CalendarDaysIcon className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-500">No appointments</p>
                        {isAdmin && (
                            <p className="text-xs text-gray-400 mt-1">Click Book Appointment to schedule one</p>
                        )}
                    </div>
                ) : (
                    appointments.map((a) => {
                        const cfg = STATUS_CFG[a.status] ?? { label: a.status, cls: 'bg-gray-100 text-gray-500' };
                        return (
                            <div key={a.id} className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-gray-800 truncate">{a.service}</span>
                                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full ${cfg.cls}`}>{cfg.label}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(a.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    {a.time ? ` · ${a.time.slice(0, 5)}` : ''}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{a.doctor_name}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function DrawerTabs({ patient, role }) {
    const canSeeRecords      = role === 'doctor' || role === 'super_admin';
    const canSeeAppointments = role !== 'doctor';
    const canManageRecords   = role === 'doctor' || role === 'super_admin';
    const canBookAppointment = role === 'admin' || role === 'super_admin' || role === 'appointment_setter';

    const [active, setActive] = useState(role === 'doctor' ? 'records' : 'profile');

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex border-b border-gray-100 flex-shrink-0 px-2">
                <button
                    onClick={() => setActive('profile')}
                    className={[
                        'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                        active === 'profile'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700',
                    ].join(' ')}
                >
                    <UserIcon className="w-4 h-4" />
                    Profile
                </button>
                {canSeeRecords && (
                    <button
                        onClick={() => setActive('records')}
                        className={[
                            'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                            active === 'records'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ].join(' ')}
                    >
                        <BeakerIcon className="w-4 h-4" />
                        Medical Records
                    </button>
                )}
                {canSeeAppointments && (
                    <button
                        onClick={() => setActive('appointments')}
                        className={[
                            'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                            active === 'appointments'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ].join(' ')}
                    >
                        <CalendarDaysIcon className="w-4 h-4" />
                        Appointments
                    </button>
                )}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
                {active === 'profile'
                    ? <ProfileTab patient={patient} />
                    : active === 'appointments'
                        ? <AppointmentsTab patient={patient} isAdmin={canBookAppointment} />
                        : <RecordsTab patient={patient} isAdmin={canManageRecords} />
                }
            </div>
        </div>
    );
}

export default function PatientProfileDrawer() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth && auth.user && auth.user.role;
    const isAdmin = role === 'admin' || role === 'super_admin';
    const canManageRecords = isAdmin || role === 'doctor';

    const drawerOpen    = useSelector((s) => s.patientRecords.drawerOpen);
    const drawerPatient = useSelector((s) => s.patientRecords.drawerPatient);

    useEffect(() => {
        const canSeeRecords = role === 'doctor' || role === 'super_admin';
        if (drawerOpen && drawerPatient && drawerPatient.id && canSeeRecords) {
            dispatch(fetchPatientRecordsThunk(drawerPatient.id));
        }
    }, [drawerOpen, drawerPatient && drawerPatient.id]);

    if (!drawerOpen || !drawerPatient) return null;

    const close = () => dispatch(closeDrawer());

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={close} />
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="font-semibold text-gray-800">Patient Profile</h2>
                    <button
                        onClick={close}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 flex-shrink-0">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient(drawerPatient.name)} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                        {initials(drawerPatient.name || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 truncate">{drawerPatient.name || '\u2014'}</p>
                        {drawerPatient.email && (
                            <p className="text-xs text-gray-500 truncate">{drawerPatient.email}</p>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                            Patient
                        </span>
                    </div>
                </div>
                <DrawerTabs patient={drawerPatient} role={role} />
            </div>
        </>
    );
}
