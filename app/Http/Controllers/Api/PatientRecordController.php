<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
     * GET /api/patients/{patientId}/records
     * List all checkup records for a patient (summary, no nested relations).
     */
    public function index(int $patientId)
    {
        $this->resolvePatient($patientId);

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
        $this->resolvePatient($patientId);

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
        ]);

        $record = DB::transaction(function () use ($data, $patientId, $request) {
            $record = PatientRecord::create([
                'patient_id'        => $patientId,
                'appointment_id'    => $data['appointment_id'] ?? null,
                'doctor_id'         => $data['doctor_id'] ?? null,
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
        $this->resolvePatient($patientId);

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

        DB::transaction(function () use ($data, $record) {
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
