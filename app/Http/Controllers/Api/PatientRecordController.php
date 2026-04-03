<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\PatientRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientRecordController extends Controller
{
    private function resolvePatient(int $patientId): User
    {
        $patient = User::where('role', 'patient')->find($patientId);
        if (! $patient) {
            abort(404, 'Patient not found.');
        }
        return $patient;
    }

    /**
     * For doctor-role requests, ensure they have a treatment relationship
     * with the patient (appointment or existing record) before granting access.
     * Admin and appointment_setter roles cannot view patient medical records.
     */
    private function authorizeAccess(int $patientId): void
    {
        $auth = request()->user();

        // Admin and appointment_setter cannot access medical records
        if (in_array($auth->role, ['admin', 'appointment_setter'])) {
            abort(403, 'You do not have permission to view patient records.');
        }

        // Doctors need a treatment relationship with the patient
        if ($auth->role === 'doctor') {
            $doctorProfile = Doctor::where('user_id', $auth->id)->first();
            if (! $doctorProfile) {
                abort(403, 'Doctor profile not found.');
            }

            $hasAppointment = Appointment::where('user_id', $patientId)
                ->where('doctor_name', $doctorProfile->name)
                ->exists();

            $hasRecord = PatientRecord::where('patient_id', $patientId)
                ->where('doctor_id', $doctorProfile->id)
                ->exists();

            if (! $hasAppointment && ! $hasRecord) {
                abort(403, 'You do not have a treatment relationship with this patient.');
            }
        }
        // super_admin passes through unrestricted
    }

    /**
     * GET /api/patients/{patientId}/records
     * List all checkup records for a patient (summary, no nested relations).
     */
    public function index(int $patientId)
    {
        $this->resolvePatient($patientId);
        $this->authorizeAccess($patientId);

        $records = PatientRecord::with(['doctor:id,name,specialty'])
            ->where('patient_id', $patientId)
            ->orderByDesc('visited_at')
            ->get();

        return response()->json(['data' => $records]);
    }

    /**
     * GET /api/patients/{patientId}/records/latest
     * Return the most recent record with all relations.
     */
    public function latest(int $patientId)
    {
        $this->resolvePatient($patientId);
        $this->authorizeAccess($patientId);

        $record = PatientRecord::with([
                'doctor:id,name,specialty',
                'medications',
                'labResults',
                'testResults',
            ])
            ->where('patient_id', $patientId)
            ->orderByDesc('visited_at')
            ->first();

        if (! $record) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => $record]);
    }

    /**
     * GET /api/patients/{patientId}/records/{id}
     * Full single record with all nested relations.
     */
    public function show(int $patientId, int $id)
    {
        $this->resolvePatient($patientId);
        $this->authorizeAccess($patientId);

        $record = PatientRecord::with([
                'doctor:id,name,specialty',
                'medications',
                'labResults',
                'testResults',
                'creator:id,name',
            ])
            ->where('patient_id', $patientId)
            ->findOrFail($id);

        return response()->json(['data' => $record]);
    }

    /**
     * POST /api/patients/{patientId}/records
     * Create a record with optional medications, lab_results, and test_results arrays.
     */
    public function store(Request $request, int $patientId)
    {
        $patient = $this->resolvePatient($patientId);

        $data = $request->validate([
            'visited_at'          => 'required|date',
            'appointment_id'      => 'nullable|integer|exists:appointments,id',
            'doctor_id'           => 'nullable|integer|exists:doctors,id',
            'chief_complaint'     => 'nullable|string|max:1000',
            'diagnosis'           => 'nullable|string|max:1000',
            'notes'               => 'nullable|string|max:2000',
            'blood_pressure'      => 'nullable|string|max:10',
            'heart_rate'          => 'nullable|integer|min:0|max:300',
            'temperature'         => 'nullable|numeric|min:30|max:45',
            'weight'              => 'nullable|numeric|min:0',
            'height'              => 'nullable|numeric|min:0',
            'oxygen_saturation'   => 'nullable|integer|min:0|max:100',

            'medications'              => 'nullable|array',
            'medications.*.name'       => 'required|string|max:255',
            'medications.*.dosage'     => 'nullable|string|max:100',
            'medications.*.frequency'  => 'nullable|string|max:100',
            'medications.*.duration'   => 'nullable|string|max:100',
            'medications.*.instructions' => 'nullable|string|max:500',

            'lab_results'                  => 'nullable|array',
            'lab_results.*.test_name'      => 'required|string|max:255',
            'lab_results.*.result'         => 'required|string|max:255',
            'lab_results.*.unit'           => 'nullable|string|max:50',
            'lab_results.*.reference_range'=> 'nullable|string|max:100',
            'lab_results.*.status'         => 'nullable|in:normal,abnormal,critical',
            'lab_results.*.remarks'        => 'nullable|string|max:500',
            'lab_results.*.tested_at'      => 'nullable|date',

            'test_results'                  => 'nullable|array',
            'test_results.*.type'           => 'required|string|max:100',
            'test_results.*.description'    => 'nullable|string|max:255',
            'test_results.*.findings'       => 'nullable|string|max:1000',
            'test_results.*.conducted_at'   => 'nullable|date',

            'followup'                => 'nullable|array',
            'followup.date'           => 'nullable|date',
            'followup.time'           => 'nullable|string|max:8',
            'followup.service'        => 'nullable|string|max:255',
            'followup.doctor_name'    => 'nullable|string|max:255',
            'followup.notes'          => 'nullable|string|max:500',

            // Optional: complete an upcoming appointment for this patient (walk-in scenario)
            'complete_appointment_id' => 'nullable|integer|exists:appointments,id',
        ]);

        $record = DB::transaction(function () use ($data, $patientId, $patient, $request) {
            // If the requester is a doctor, always use their own doctor profile
            $doctorId = $data['doctor_id'] ?? null;
            if ($request->user()->role === 'doctor') {
                $dp = Doctor::where('user_id', $request->user()->id)->first();
                $doctorId = $dp?->id;
            }

            $record = PatientRecord::create([
                'patient_id'        => $patientId,
                'appointment_id'    => $data['appointment_id'] ?? null,
                'doctor_id'         => $doctorId,
                'visited_at'        => $data['visited_at'],
                'chief_complaint'   => $data['chief_complaint'] ?? null,
                'diagnosis'         => $data['diagnosis'] ?? null,
                'notes'             => $data['notes'] ?? null,
                'blood_pressure'    => $data['blood_pressure'] ?? null,
                'heart_rate'        => $data['heart_rate'] ?? null,
                'temperature'       => $data['temperature'] ?? null,
                'weight'            => $data['weight'] ?? null,
                'height'            => $data['height'] ?? null,
                'oxygen_saturation' => $data['oxygen_saturation'] ?? null,
                'created_by'        => $request->user()->id,
            ]);

            if (! empty($data['medications'])) {
                $record->medications()->createMany($data['medications']);
            }
            if (! empty($data['lab_results'])) {
                $record->labResults()->createMany($data['lab_results']);
            }
            if (! empty($data['test_results'])) {
                $record->testResults()->createMany($data['test_results']);
            }

            // Mark the relevant same-day appointment as completed
            $visitDate = \Carbon\Carbon::parse($data['visited_at'])->toDateString();
            if (! empty($data['appointment_id'])) {
                // Explicit link — complete by ID regardless of user_id (handles manual/unlinked appointments)
                Appointment::whereKey($data['appointment_id'])
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->update(['status' => 'completed', 'updated_by' => $request->user()->id]);
            } else {
                // Fallback: match by patient user_id or patient_name
                $apptQuery = Appointment::whereDate('date', $visitDate)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->where(function ($q) use ($patientId, $patient) {
                        $q->where('user_id', $patientId)
                          ->orWhere('patient_name', $patient->name);
                    });
                if ($request->user()->role === 'doctor' && isset($dp)) {
                    $apptQuery->where('doctor_name', $dp->name);
                }
                $apptQuery->update(['status' => 'completed', 'updated_by' => $request->user()->id]);
            }

            // Create follow-up appointment if requested
            if (! empty($data['followup']['date'])) {
                $fu = $data['followup'];
                Appointment::create([
                    'user_id'      => $patientId,
                    'patient_name' => $patient->name,
                    'service'      => $fu['service'] ?? 'Follow-up Checkup',
                    'doctor_name' => $fu['doctor_name'] ?? '',
                    'date'        => $fu['date'],
                    'time'        => $fu['time'] ?? '09:00:00',
                    'notes'       => $fu['notes'] ?? null,
                    'status'      => 'confirmed',
                    'updated_by'  => $request->user()->id,
                ]);
            }

            // Complete an upcoming appointment if the patient walked in (no same-day appointment)
            if (! empty($data['complete_appointment_id'])) {
                Appointment::whereKey($data['complete_appointment_id'])
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->update(['status' => 'completed', 'updated_by' => $request->user()->id]);
            }

            return $record;
        });

        $record->load(['doctor:id,name,specialty', 'medications', 'labResults', 'testResults', 'creator:id,name']);

        return response()->json(['data' => $record], 201);
    }

    /**
     * PUT /api/patients/{patientId}/records/{id}
     * Replace all nested relations alongside core fields.
     */
    public function update(Request $request, int $patientId, int $id)
    {
        $patient = $this->resolvePatient($patientId);

        $record = PatientRecord::where('patient_id', $patientId)->findOrFail($id);

        $data = $request->validate([
            'visited_at'          => 'sometimes|required|date',
            'appointment_id'      => 'nullable|integer|exists:appointments,id',
            'doctor_id'           => 'nullable|integer|exists:doctors,id',
            'chief_complaint'     => 'nullable|string|max:1000',
            'diagnosis'           => 'nullable|string|max:1000',
            'notes'               => 'nullable|string|max:2000',
            'blood_pressure'      => 'nullable|string|max:10',
            'heart_rate'          => 'nullable|integer|min:0|max:300',
            'temperature'         => 'nullable|numeric|min:30|max:45',
            'weight'              => 'nullable|numeric|min:0',
            'height'              => 'nullable|numeric|min:0',
            'oxygen_saturation'   => 'nullable|integer|min:0|max:100',

            'medications'              => 'nullable|array',
            'medications.*.name'       => 'required|string|max:255',
            'medications.*.dosage'     => 'nullable|string|max:100',
            'medications.*.frequency'  => 'nullable|string|max:100',
            'medications.*.duration'   => 'nullable|string|max:100',
            'medications.*.instructions' => 'nullable|string|max:500',

            'lab_results'                  => 'nullable|array',
            'lab_results.*.test_name'      => 'required|string|max:255',
            'lab_results.*.result'         => 'required|string|max:255',
            'lab_results.*.unit'           => 'nullable|string|max:50',
            'lab_results.*.reference_range'=> 'nullable|string|max:100',
            'lab_results.*.status'         => 'nullable|in:normal,abnormal,critical',
            'lab_results.*.remarks'        => 'nullable|string|max:500',
            'lab_results.*.tested_at'      => 'nullable|date',

            'test_results'                  => 'nullable|array',
            'test_results.*.type'           => 'required|string|max:100',
            'test_results.*.description'    => 'nullable|string|max:255',
            'test_results.*.findings'       => 'nullable|string|max:1000',
            'test_results.*.conducted_at'   => 'nullable|date',
        ]);

        DB::transaction(function () use ($data, $record, $patientId, $patient, $request) {
            $record->update(array_filter([
                'visited_at'        => $data['visited_at'] ?? null,
                'appointment_id'    => array_key_exists('appointment_id', $data) ? $data['appointment_id'] : $record->appointment_id,
                'doctor_id'         => array_key_exists('doctor_id', $data) ? $data['doctor_id'] : $record->doctor_id,
                'chief_complaint'   => $data['chief_complaint'] ?? null,
                'diagnosis'         => $data['diagnosis'] ?? null,
                'notes'             => $data['notes'] ?? null,
                'blood_pressure'    => $data['blood_pressure'] ?? null,
                'heart_rate'        => $data['heart_rate'] ?? null,
                'temperature'       => $data['temperature'] ?? null,
                'weight'            => $data['weight'] ?? null,
                'height'            => $data['height'] ?? null,
                'oxygen_saturation' => $data['oxygen_saturation'] ?? null,
            ], fn($v) => $v !== null));

            if (array_key_exists('medications', $data)) {
                $record->medications()->delete();
                if (! empty($data['medications'])) {
                    $record->medications()->createMany($data['medications']);
                }
            }
            if (array_key_exists('lab_results', $data)) {
                $record->labResults()->delete();
                if (! empty($data['lab_results'])) {
                    $record->labResults()->createMany($data['lab_results']);
                }
            }
            if (array_key_exists('test_results', $data)) {
                $record->testResults()->delete();
                if (! empty($data['test_results'])) {
                    $record->testResults()->createMany($data['test_results']);
                }
            }

            // Mark the relevant same-day appointment as completed
            $visitDate = \Carbon\Carbon::parse($data['visited_at'] ?? $record->visited_at)->toDateString();
            $linkedApptId = array_key_exists('appointment_id', $data) ? $data['appointment_id'] : $record->appointment_id;
            if ($linkedApptId) {
                Appointment::whereKey($linkedApptId)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->update(['status' => 'completed', 'updated_by' => $request->user()->id]);
            } else {
                $apptQuery = Appointment::whereDate('date', $visitDate)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->where(function ($q) use ($patientId, $patient) {
                        $q->where('user_id', $patientId)
                          ->orWhere('patient_name', $patient->name);
                    });
                if ($request->user()->role === 'doctor') {
                    $dpU = Doctor::where('user_id', $request->user()->id)->first();
                    if ($dpU) {
                        $apptQuery->where('doctor_name', $dpU->name);
                    } else {
                        $apptQuery->whereRaw('0 = 1');
                    }
                }
                $apptQuery->update(['status' => 'completed', 'updated_by' => $request->user()->id]);
            }
        });

        $record->load(['doctor:id,name,specialty', 'medications', 'labResults', 'testResults', 'creator:id,name']);

        return response()->json(['data' => $record]);
    }

    /**
     * DELETE /api/patients/{patientId}/records/{id}
     */
    public function destroy(int $patientId, int $id)
    {
        $this->resolvePatient($patientId);

        $record = PatientRecord::where('patient_id', $patientId)->findOrFail($id);
        $record->delete();

        return response()->json(['message' => 'Record deleted.']);
    }
}
