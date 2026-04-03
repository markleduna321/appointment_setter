import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePage } from '@inertiajs/react';
import {
    XMarkIcon,
    PlusIcon,
    TrashIcon,
    HeartIcon,
    BeakerIcon,
    DocumentMagnifyingGlassIcon,
    ClipboardDocumentListIcon,
    PencilIcon,
    PrinterIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { closeRecordModal, openRecordModal } from '../_redux/patient-record-slice';
import { createPatientRecordThunk, updatePatientRecordThunk } from '../_redux/patient-record-thunk';

// ─── helpers ────────────────────────────────────────────────────────────────

function printPrescription(record, patient) {
    const meds = record.medications || [];
    if (!meds.length) return;

    const doctorName = record.doctor ? `Dr. ${record.doctor.name}` : '';
    const specialty  = record.doctor?.specialty ?? '';
    const visitDate  = record.visited_at
        ? new Date(record.visited_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';
    const patientName = patient?.name ?? 'Unknown Patient';
    const appName = import.meta.env.VITE_APP_NAME || 'AppointDoc';

    const medRows = meds.map((m, i) => `
        <div class="med-item">
            <div class="med-number">${i + 1}.</div>
            <div class="med-detail">
                <div class="med-name">${m.name}${m.dosage ? ` <span class="med-dosage">${m.dosage}</span>` : ''}</div>
                <div class="med-sig">
                    ${[m.frequency, m.duration ? `for ${m.duration}` : '', m.instructions].filter(Boolean).join(' &middot; ')}
                </div>
            </div>
        </div>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Prescription</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; color: #111; background: #fff; padding: 40px 48px; }
    .header { border-bottom: 2px solid #16a34a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .clinic-name { font-size: 22px; font-weight: 700; color: #16a34a; letter-spacing: -0.5px; }
    .clinic-sub  { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .doctor-block { text-align: right; }
    .doctor-name  { font-size: 15px; font-weight: 600; }
    .doctor-spec  { font-size: 11px; color: #6b7280; }
    .patient-row  { display: flex; gap: 40px; margin-bottom: 28px; }
    .field-group  { }
    .field-label  { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-bottom: 2px; }
    .field-value  { font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; min-width: 160px; }
    .rx-symbol    { font-size: 36px; font-weight: 700; color: #16a34a; line-height: 1; margin-bottom: 12px; font-style: italic; }
    .med-item     { display: flex; gap: 12px; margin-bottom: 18px; page-break-inside: avoid; }
    .med-number   { font-size: 13px; color: #6b7280; padding-top: 2px; min-width: 18px; }
    .med-name     { font-size: 16px; font-weight: 700; }
    .med-dosage   { font-weight: 400; font-size: 14px; color: #374151; }
    .med-sig      { font-size: 12px; color: #6b7280; margin-top: 3px; font-style: italic; }
    .diagnosis    { margin-bottom: 24px; font-size: 13px; color: #374151; }
    .dx-label     { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; }
    .footer       { margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-line     { width: 180px; border-top: 1px solid #374151; text-align: center; padding-top: 6px; font-size: 11px; color: #6b7280; }
    .print-note   { font-size: 10px; color: #9ca3af; }
    @media print { body { padding: 20px 28px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="clinic-name">${appName}</div>
      <div class="clinic-sub">Medical Clinic &mdash; Patient Prescription</div>
    </div>
    <div class="doctor-block">
      <div class="doctor-name">${doctorName}</div>
      <div class="doctor-spec">${specialty}</div>
    </div>
  </div>

  <div class="patient-row">
    <div class="field-group">
      <div class="field-label">Patient Name</div>
      <div class="field-value">${patientName}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Date</div>
      <div class="field-value">${visitDate}</div>
    </div>
  </div>

  ${record.diagnosis ? `<div class="diagnosis"><span class="dx-label">Diagnosis:</span> ${record.diagnosis}</div>` : ''}

  <div class="rx-symbol">Rx</div>

  ${medRows}

  <div class="footer">
    <div class="print-note">This prescription was generated electronically via ${appName}.</div>
    <div class="sig-line">Physician's Signature</div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=720,height=900');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.onload = () => win.print();
    // Fallback if onload already fired
    setTimeout(() => { try { win.print(); } catch (_) {} }, 600);
}

function fmtDate(val) {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function fmtDateTime(val) {
    if (!val) return '—';
    return new Date(val).toLocaleString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

const STATUS_COLORS = {
    normal:   'bg-green-100 text-green-700',
    abnormal: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700',
};

// ─── View sub-sections ───────────────────────────────────────────────────────

function VitalsCard({ record }) {
    const vitals = [
        { label: 'Blood Pressure', value: record.blood_pressure, unit: 'mmHg' },
        { label: 'Heart Rate',     value: record.heart_rate,     unit: 'bpm'  },
        { label: 'Temperature',    value: record.temperature,    unit: '°C'   },
        { label: 'Weight',         value: record.weight,         unit: 'kg'   },
        { label: 'Height',         value: record.height,         unit: 'cm'   },
        { label: 'O₂ Saturation',  value: record.oxygen_saturation, unit: '%' },
    ].filter((v) => v.value != null && v.value !== '');

    if (!vitals.length) return null;

    return (
        <Section icon={HeartIcon} title="Vitals">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vitals.map((v) => (
                    <div key={v.label} className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">{v.label}</p>
                        <p className="text-base font-bold text-gray-800 mt-0.5">
                            {v.value} <span className="text-xs font-normal text-gray-400">{v.unit}</span>
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function MedicationsView({ medications }) {
    if (!medications?.length) return null;
    return (
        <Section icon={ClipboardDocumentListIcon} title="Medications">
            <div className="space-y-2">
                {medications.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                {m.dosage    && <span className="text-xs text-gray-500">{m.dosage}</span>}
                                {m.frequency && <span className="text-xs text-gray-500">{m.frequency}</span>}
                                {m.duration  && <span className="text-xs text-gray-500">for {m.duration}</span>}
                            </div>
                            {m.instructions && <p className="text-xs text-gray-400 mt-1 italic">{m.instructions}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function LabResultsView({ labResults }) {
    if (!labResults?.length) return null;
    return (
        <Section icon={BeakerIcon} title="Laboratory Results">
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-3 py-2 text-xs font-semibold text-gray-500">Test</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-500">Result</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-500">Reference</th>
                            <th className="px-3 py-2 text-xs font-semibold text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labResults.map((r, i) => (
                            <tr key={i} className="border-t border-gray-50">
                                <td className="px-3 py-2.5 font-medium text-gray-800">{r.test_name}</td>
                                <td className="px-3 py-2.5 text-gray-700">
                                    {r.result} {r.unit && <span className="text-xs text-gray-400">{r.unit}</span>}
                                </td>
                                <td className="px-3 py-2.5 text-xs text-gray-400">{r.reference_range ?? '—'}</td>
                                <td className="px-3 py-2.5">
                                    {r.status
                                        ? <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_COLORS[r.status] ?? ''}`}>{r.status}</span>
                                        : '—'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
}

function TestResultsView({ testResults }) {
    if (!testResults?.length) return null;
    return (
        <Section icon={DocumentMagnifyingGlassIcon} title="Diagnostic Tests">
            <div className="space-y-2">
                {testResults.map((t, i) => (
                    <div key={i} className="p-3 border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">{t.type}</span>
                            {t.description && <span className="text-sm font-medium text-gray-700">{t.description}</span>}
                            {t.conducted_at && <span className="ml-auto text-xs text-gray-400">{fmtDate(t.conducted_at)}</span>}
                        </div>
                        {t.findings && <p className="text-sm text-gray-600 leading-relaxed">{t.findings}</p>}
                    </div>
                ))}
            </div>
        </Section>
    );
}

function Section({ icon: Icon, title, children }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
            </div>
            {children}
        </div>
    );
}

// ─── View mode ───────────────────────────────────────────────────────────────

function ViewRecord({ record, isAdmin, onEdit, patient }) {
    const hasMeds = record.medications?.length > 0;

    return (
        <div className="space-y-6">
            {/* Meta */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs text-gray-400">Visit Date</p>
                    <p className="text-sm font-semibold text-gray-800">{fmtDateTime(record.visited_at)}</p>
                    {record.doctor && (
                        <p className="text-xs text-gray-500 mt-0.5">Dr. {record.doctor.name} · {record.doctor.specialty}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {hasMeds && (
                        <button
                            onClick={() => printPrescription(record, patient)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                            <PrinterIcon className="w-3.5 h-3.5" />
                            Print Rx
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <PencilIcon className="w-3.5 h-3.5" />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Chief complaint + Diagnosis + Notes */}
            {(record.chief_complaint || record.diagnosis || record.notes) && (
                <Section icon={ClipboardDocumentListIcon} title="Clinical Summary">
                    <div className="space-y-3">
                        {record.chief_complaint && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Chief Complaint</p>
                                <p className="text-sm text-gray-700 mt-0.5">{record.chief_complaint}</p>
                            </div>
                        )}
                        {record.diagnosis && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Diagnosis</p>
                                <p className="text-sm text-gray-700 mt-0.5">{record.diagnosis}</p>
                            </div>
                        )}
                        {record.notes && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Notes / Follow-up</p>
                                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{record.notes}</p>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            <VitalsCard record={record} />
            <MedicationsView medications={record.medications} />
            <LabResultsView labResults={record.lab_results} />
            <TestResultsView testResults={record.test_results} />
        </div>
    );
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

const EMPTY_MED = { name: '', dosage: '', frequency: '', duration: '', instructions: '' };
const EMPTY_LAB = { test_name: '', result: '', unit: '', reference_range: '', status: '', remarks: '', tested_at: '' };
const EMPTY_TEST = { type: '', description: '', findings: '', conducted_at: '' };

function buildInitialForm(record) {
    const followupDefaults = {
        followup_enabled: false,
        followup_date:    '',
        followup_time:    '',
        followup_service: '',
        followup_doctor:  '',
        followup_notes:   '',
        complete_upcoming: false,
    };
    if (!record) {
        const now = new Date();
        // format local datetime for input
        const pad = (n) => String(n).padStart(2, '0');
        const localDt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
        return {
            appointment_id: '',
            visited_at: localDt,
            doctor_id: '',
            chief_complaint: '',
            diagnosis: '',
            notes: '',
            blood_pressure: '',
            heart_rate: '',
            temperature: '',
            weight: '',
            height: '',
            oxygen_saturation: '',
            medications: [],
            lab_results: [],
            test_results: [],
            ...followupDefaults,
        };
    }
    const dt = record.visited_at
        ? record.visited_at.replace(' ', 'T').slice(0, 16)
        : '';
    return {
        appointment_id:    record.appointment_id ?? '',
        visited_at:        dt,
        doctor_id:         record.doctor_id ?? '',
        chief_complaint:   record.chief_complaint ?? '',
        diagnosis:         record.diagnosis ?? '',
        notes:             record.notes ?? '',
        blood_pressure:    record.blood_pressure ?? '',
        heart_rate:        record.heart_rate ?? '',
        temperature:       record.temperature ?? '',
        weight:            record.weight ?? '',
        height:            record.height ?? '',
        oxygen_saturation: record.oxygen_saturation ?? '',
        medications:       (record.medications ?? []).map((m) => ({ ...EMPTY_MED, ...m })),
        lab_results:       (record.lab_results ?? []).map((r) => ({ ...EMPTY_LAB, ...r })),
        test_results:      (record.test_results ?? []).map((t) => ({ ...EMPTY_TEST, ...t })),
        ...followupDefaults,
    };
}

// ─── Form mode ──────────────────────────────────────────────────────────────

function ArraySection({ title, icon: Icon, items, onAdd, onRemove, renderRow }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">{title}</span>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700"
                >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Add
                </button>
            </div>
            {items.length === 0
                ? <p className="text-xs text-gray-400 italic py-2">None added yet.</p>
                : <div className="space-y-2">{items.map((item, i) => (
                    <div key={i} className="relative p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                        <button
                            type="button"
                            onClick={() => onRemove(i)}
                            className="absolute top-2 right-2 p-0.5 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                        {renderRow(item, i)}
                    </div>
                ))}</div>
            }
        </div>
    );
}

function FormInput({ label, type = 'text', value, onChange, required, placeholder, small }) {
    return (
        <div className={small ? '' : ''}>
            {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
            />
        </div>
    );
}

function RecordForm({ patientId, mode, record, onCancel }) {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const isDoctor = auth?.user?.role === 'doctor';
    const myDoctorId = isDoctor ? (auth?.user?.doctor?.id ?? null) : null;
    const myDoctorName = isDoctor ? (auth?.user?.doctor?.name ?? '') : '';
    const { submitting, formError, drawerPatient } = useSelector((s) => s.patientRecords);

    const getInitialForm = (r) => {
        const f = buildInitialForm(r);
        if (!r) {
            // Doctor role: pre-fill doctor_id and default follow-up doctor to themselves
            if (isDoctor && myDoctorId) {
                f.doctor_id = String(myDoctorId);
                f.followup_doctor = myDoctorName;
            }
            // Auto-link today's appointment for all roles
            const ta = drawerPatient?.today_appointment;
            if (ta && ['pending', 'confirmed'].includes(ta.status)) {
                // For doctor role, only link their own appointment; admins link whatever is today's
                if (!isDoctor || ta.doctor_name === myDoctorName) {
                    f.appointment_id = ta.id;
                }
            }
        }
        return f;
    };

    const [form, setForm] = useState(() => getInitialForm(record));

    useEffect(() => { setForm(getInitialForm(record)); }, [record]);

    const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    const setItem = (list, i, key, val) => {
        setForm((p) => {
            const next = [...p[list]];
            next[i] = { ...next[i], [key]: val };
            return { ...p, [list]: next };
        });
    };

    const addItem  = (list, empty) => setForm((p) => ({ ...p, [list]: [...p[list], { ...empty }] }));
    const removeItem = (list, i) => setForm((p) => ({ ...p, [list]: p[list].filter((_, idx) => idx !== i) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Build clean payload — strip empty strings to null
        const clean = (v) => (v === '' || v === undefined) ? null : v;
        const payload = {
            visited_at:               clean(form.visited_at),
            appointment_id:           form.appointment_id ? Number(form.appointment_id) : null,
            doctor_id:                clean(form.doctor_id) ? Number(form.doctor_id) : null,
            chief_complaint:   clean(form.chief_complaint),
            diagnosis:         clean(form.diagnosis),
            notes:             clean(form.notes),
            blood_pressure:    clean(form.blood_pressure),
            heart_rate:        clean(form.heart_rate) ? Number(form.heart_rate) : null,
            temperature:       clean(form.temperature) ? Number(form.temperature) : null,
            weight:            clean(form.weight) ? Number(form.weight) : null,
            height:            clean(form.height) ? Number(form.height) : null,
            oxygen_saturation: clean(form.oxygen_saturation) ? Number(form.oxygen_saturation) : null,
            medications:  form.medications.filter((m) => m.name).map((m) => ({
                name: m.name, dosage: clean(m.dosage), frequency: clean(m.frequency),
                duration: clean(m.duration), instructions: clean(m.instructions),
            })),
            lab_results:  form.lab_results.filter((r) => r.test_name && r.result).map((r) => ({
                test_name: r.test_name, result: r.result, unit: clean(r.unit),
                reference_range: clean(r.reference_range), status: clean(r.status),
                remarks: clean(r.remarks), tested_at: clean(r.tested_at),
            })),
            test_results: form.test_results.filter((t) => t.type).map((t) => ({
                type: t.type, description: clean(t.description),
                findings: clean(t.findings), conducted_at: clean(t.conducted_at),
            })),
            followup: (mode === 'add' && form.followup_enabled && form.followup_date) ? {
                date:        form.followup_date,
                time:        clean(form.followup_time) || '09:00',
                service:     clean(form.followup_service) || 'Follow-up Checkup',
                doctor_name: clean(form.followup_doctor),
                notes:       clean(form.followup_notes),
            } : null,
            complete_appointment_id: (mode === 'add' && form.complete_upcoming && drawerPatient?.upcoming_appointment?.id)
                ? drawerPatient.upcoming_appointment.id
                : null,
        };

        const action = mode === 'edit'
            ? updatePatientRecordThunk({ patientId, recordId: record.id, data: payload })
            : createPatientRecordThunk({ patientId, data: payload });

        const result = await dispatch(action);
        if (!result.error) dispatch(closeRecordModal());
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    {formError}
                </div>
            )}

            {/* Visit info */}
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                    <FormInput label="Visit Date & Time" type="datetime-local" value={form.visited_at} onChange={(v) => set('visited_at', v)} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    {isDoctor ? (
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Doctor</label>
                            <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-600">
                                {myDoctorName || 'You'}
                            </div>
                        </div>
                    ) : (
                        <FormInput label="Doctor ID" type="number" value={form.doctor_id} onChange={(v) => set('doctor_id', v)} placeholder="optional" />
                    )}
                </div>
            </div>

            {/* Clinical */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Chief Complaint</label>
                <textarea
                    rows={2}
                    value={form.chief_complaint}
                    onChange={(e) => set('chief_complaint', e.target.value)}
                    placeholder="Patient's presenting complaint…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition resize-none"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Diagnosis</label>
                <textarea
                    rows={2}
                    value={form.diagnosis}
                    onChange={(e) => set('diagnosis', e.target.value)}
                    placeholder="Doctor's diagnosis…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition resize-none"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes / Follow-up</label>
                <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    placeholder="Follow-up plan, additional notes…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition resize-none"
                />
            </div>

            {/* Vitals */}
            <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Vitals</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <FormInput label="Blood Pressure" value={form.blood_pressure} onChange={(v) => set('blood_pressure', v)} placeholder="120/80" />
                    <FormInput label="Heart Rate (bpm)" type="number" value={form.heart_rate} onChange={(v) => set('heart_rate', v)} placeholder="72" />
                    <FormInput label="Temperature (°C)" type="number" value={form.temperature} onChange={(v) => set('temperature', v)} placeholder="36.5" />
                    <FormInput label="Weight (kg)" type="number" value={form.weight} onChange={(v) => set('weight', v)} placeholder="65" />
                    <FormInput label="Height (cm)" type="number" value={form.height} onChange={(v) => set('height', v)} placeholder="165" />
                    <FormInput label="O₂ Saturation (%)" type="number" value={form.oxygen_saturation} onChange={(v) => set('oxygen_saturation', v)} placeholder="98" />
                </div>
            </div>

            {/* Medications */}
            <ArraySection
                title="Medications"
                icon={ClipboardDocumentListIcon}
                items={form.medications}
                onAdd={() => addItem('medications', EMPTY_MED)}
                onRemove={(i) => removeItem('medications', i)}
                renderRow={(m, i) => (
                    <div className="grid grid-cols-2 gap-2 pr-5">
                        <div className="col-span-2"><FormInput label="Drug Name" value={m.name} onChange={(v) => setItem('medications', i, 'name', v)} required /></div>
                        <FormInput label="Dosage" value={m.dosage} onChange={(v) => setItem('medications', i, 'dosage', v)} placeholder="500mg" />
                        <FormInput label="Frequency" value={m.frequency} onChange={(v) => setItem('medications', i, 'frequency', v)} placeholder="twice daily" />
                        <FormInput label="Duration" value={m.duration} onChange={(v) => setItem('medications', i, 'duration', v)} placeholder="7 days" />
                        <FormInput label="Instructions" value={m.instructions} onChange={(v) => setItem('medications', i, 'instructions', v)} placeholder="after meals" />
                    </div>
                )}
            />

            {/* Lab Results */}
            <ArraySection
                title="Laboratory Results"
                icon={BeakerIcon}
                items={form.lab_results}
                onAdd={() => addItem('lab_results', EMPTY_LAB)}
                onRemove={(i) => removeItem('lab_results', i)}
                renderRow={(r, i) => (
                    <div className="grid grid-cols-2 gap-2 pr-5">
                        <FormInput label="Test Name" value={r.test_name} onChange={(v) => setItem('lab_results', i, 'test_name', v)} required placeholder="Blood Glucose" />
                        <div className="flex gap-1.5">
                            <div className="flex-1"><FormInput label="Result" value={r.result} onChange={(v) => setItem('lab_results', i, 'result', v)} required /></div>
                            <div className="w-16"><FormInput label="Unit" value={r.unit} onChange={(v) => setItem('lab_results', i, 'unit', v)} placeholder="mg/dL" /></div>
                        </div>
                        <FormInput label="Reference Range" value={r.reference_range} onChange={(v) => setItem('lab_results', i, 'reference_range', v)} placeholder="70–100 mg/dL" />
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                            <select
                                value={r.status}
                                onChange={(e) => setItem('lab_results', i, 'status', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition bg-white"
                            >
                                <option value="">—</option>
                                <option value="normal">Normal</option>
                                <option value="abnormal">Abnormal</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <FormInput label="Remarks" value={r.remarks} onChange={(v) => setItem('lab_results', i, 'remarks', v)} placeholder="optional" />
                        </div>
                    </div>
                )}
            />

            {/* Diagnostic Tests */}
            <ArraySection
                title="Diagnostic Tests"
                icon={DocumentMagnifyingGlassIcon}
                items={form.test_results}
                onAdd={() => addItem('test_results', EMPTY_TEST)}
                onRemove={(i) => removeItem('test_results', i)}
                renderRow={(t, i) => (
                    <div className="grid grid-cols-2 gap-2 pr-5">
                        <FormInput label="Type" value={t.type} onChange={(v) => setItem('test_results', i, 'type', v)} required placeholder="X-Ray / MRI…" />
                        <FormInput label="Description" value={t.description} onChange={(v) => setItem('test_results', i, 'description', v)} placeholder="Chest PA" />
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Findings</label>
                            <textarea
                                rows={2}
                                value={t.findings}
                                onChange={(e) => setItem('test_results', i, 'findings', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition resize-none"
                            />
                        </div>
                        <FormInput label="Conducted At" type="date" value={t.conducted_at} onChange={(v) => setItem('test_results', i, 'conducted_at', v)} />
                    </div>
                )}
            />

            {/* Walk-in notice: upcoming appointment exists but no same-day appointment */}
            {mode === 'add' && drawerPatient?.upcoming_appointment && !form.appointment_id && (
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <CalendarDaysIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-800">
                            Upcoming appointment on{' '}
                            {new Date(drawerPatient.upcoming_appointment.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            {drawerPatient.upcoming_appointment.service}
                            {drawerPatient.upcoming_appointment.doctor_name ? ` · ${drawerPatient.upcoming_appointment.doctor_name}` : ''}
                            {' · '}<span className="capitalize">{drawerPatient.upcoming_appointment.status}</span>
                        </p>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.complete_upcoming}
                                onChange={(e) => set('complete_upcoming', e.target.checked)}
                                className="w-3.5 h-3.5 rounded accent-amber-500"
                            />
                            <span className="text-xs font-medium text-amber-800">
                                Mark this appointment as completed (patient walked in)
                            </span>
                        </label>
                    </div>
                </div>
            )}

            {/* Follow-up Appointment (add mode only) */}
            {mode === 'add' && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        type="button"
                        onClick={() => set('followup_enabled', !form.followup_enabled)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
                    >
                        <span className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                            Schedule Follow-up Appointment
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            form.followup_enabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                        }`}>{form.followup_enabled ? 'On' : 'Off'}</span>
                    </button>
                    {form.followup_enabled && (
                        <div className="px-4 py-4 space-y-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput
                                    label="Follow-up Date"
                                    type="date"
                                    value={form.followup_date}
                                    onChange={(v) => set('followup_date', v)}
                                    required
                                />
                                <FormInput
                                    label="Time (optional)"
                                    type="time"
                                    value={form.followup_time}
                                    onChange={(v) => set('followup_time', v)}
                                    placeholder="09:00"
                                />
                            </div>
                            <FormInput
                                label="Service / Reason"
                                value={form.followup_service}
                                onChange={(v) => set('followup_service', v)}
                                placeholder="Follow-up Checkup"
                            />
                            <FormInput
                                label="Doctor"
                                value={form.followup_doctor}
                                onChange={(v) => set('followup_doctor', v)}
                                placeholder="Doctor's name"
                            />
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                                <textarea
                                    rows={2}
                                    value={form.followup_notes}
                                    onChange={(e) => set('followup_notes', e.target.value)}
                                    placeholder="Additional notes for the follow-up…"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition resize-none"
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                A confirmed appointment will be created and the current visit's appointment will be marked as completed.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
                >
                    {submitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Add Record'}
                </button>
            </div>
        </form>
    );
}

// ─── Main modal ──────────────────────────────────────────────────────────────

export default function CheckupRecordModal({ patientId }) {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';
    const canManageRecords = isAdmin || role === 'doctor';
    const { recordModalOpen, recordModalMode, selectedRecord, loadingRecord, drawerPatient } = useSelector((s) => s.patientRecords);

    if (!recordModalOpen) return null;

    const close = () => dispatch(closeRecordModal());
    const switchToEdit = () => dispatch(openRecordModal({ mode: 'edit', record: selectedRecord }));

    const titles = { view: 'Checkup Record', add: 'Add Checkup Record', edit: 'Edit Checkup Record' };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="font-semibold text-gray-800 text-lg">{titles[recordModalMode]}</h3>
                    <button
                        onClick={close}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-5 flex-1">
                    {loadingRecord ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : recordModalMode === 'view' && !selectedRecord ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                <ClipboardDocumentListIcon className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">No checkup records yet</p>
                            <p className="text-xs text-gray-400 mt-1">Records will appear here once added</p>
                        </div>
                    ) : recordModalMode === 'view' ? (
                        <ViewRecord
                            record={selectedRecord}
                            isAdmin={canManageRecords}
                            onEdit={switchToEdit}
                            patient={drawerPatient}
                        />
                    ) : (
                        <RecordForm
                            patientId={patientId}
                            mode={recordModalMode}
                            record={selectedRecord}
                            onCancel={close}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
