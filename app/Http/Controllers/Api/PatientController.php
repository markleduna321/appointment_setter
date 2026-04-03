<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PatientController extends Controller
{
    /**
     * GET /api/patients — list patients (role = patient)
     */
    public function index(Request $request)
    {
        $today    = now()->toDateString();
        $authUser = $request->user();

        // Pre-fetch doctor profile so we can scope the today_appointment eager-load too
        $doctorProfile = null;
        if ($authUser->role === 'doctor') {
            $doctorProfile = Doctor::where('user_id', $authUser->id)->first();
        }

        $query = User::with(['mobile'])->where('role', 'patient')->orderBy('name');

        // Doctors only see their own patients
        if ($authUser->role === 'doctor') {
            if ($doctorProfile) {
                $query->where(function ($q) use ($doctorProfile) {
                    $q->whereHas('appointments', fn ($a) => $a->where('doctor_name', $doctorProfile->name))
                      ->orWhereHas('patientRecords', fn ($r) => $r->where('doctor_id', $doctorProfile->id));
                });
            } else {
                $query->whereRaw('0 = 1'); // no doctor profile, return nothing
            }
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('email', 'like', $search);
            });
        }

        $patients = $query->get();

        // Batch-load today's appointments matching by user_id OR patient_name (handles manually-booked)
        $patientIds   = $patients->pluck('id');
        $patientNames = $patients->pluck('name');

        $apptQuery = Appointment::whereDate('date', $today)
            ->whereNotIn('status', ['cancelled'])
            ->where(function ($q) use ($patientIds, $patientNames) {
                $q->whereIn('user_id', $patientIds)
                  ->orWhereIn('patient_name', $patientNames);
            })
            ->orderBy('time')
            ->select('id', 'user_id', 'patient_name', 'date', 'time', 'service', 'doctor_name', 'status');

        if ($doctorProfile) {
            $apptQuery->where('doctor_name', $doctorProfile->name);
        }

        $todayAppointments = $apptQuery->get();
        $byUserId     = $todayAppointments->whereNotNull('user_id')->groupBy('user_id');
        $byPatientName = $todayAppointments->whereNull('user_id')->groupBy('patient_name');

        // Batch-load next upcoming (future) appointment per patient
        $upcomingQuery = Appointment::whereDate('date', '>', $today)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($patientIds, $patientNames) {
                $q->whereIn('user_id', $patientIds)
                  ->orWhereIn('patient_name', $patientNames);
            })
            ->orderBy('date')
            ->orderBy('time')
            ->select('id', 'user_id', 'patient_name', 'date', 'time', 'service', 'doctor_name', 'status');

        if ($doctorProfile) {
            $upcomingQuery->where('doctor_name', $doctorProfile->name);
        }

        $upcomingAppointments = $upcomingQuery->get();
        $upcomingByUserId      = $upcomingAppointments->whereNotNull('user_id')->groupBy('user_id');
        $upcomingByPatientName = $upcomingAppointments->whereNull('user_id')->groupBy('patient_name');

        $patients = $patients->map(function ($p) use ($byUserId, $byPatientName, $upcomingByUserId, $upcomingByPatientName) {
            $linked   = $byUserId->get($p->id, collect());
            $unlinked = $byPatientName->get($p->name, collect());
            $p->today_appointment = collect($linked)->merge($unlinked)->sortBy('time')->first();

            $upLinked   = $upcomingByUserId->get($p->id, collect());
            $upUnlinked = $upcomingByPatientName->get($p->name, collect());
            $p->upcoming_appointment = collect($upLinked)->merge($upUnlinked)->sortBy(fn ($a) => $a->date . $a->time)->first();

            return $p;
        });

        return response()->json(['data' => $patients]);
    }

    /**
     * GET /api/patients/{id} — show patient record
     */
    public function show($id)
    {
        $patient = User::with('mobile')->where('role', 'patient')->find($id);
        if (! $patient) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['data' => $patient]);
    }

    /**
     * POST /api/patients — create a patient account
     */
    public function store(Request $request)
    {
        if (! in_array($request->user()->role, ['admin', 'super_admin', 'appointment_setter'])) {
            abort(403, 'Forbidden');
        }
        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'source' => 'nullable|in:online,walkin',
            'email'  => 'nullable|email|unique:users,email',
            'phone'  => 'nullable|string|max:30',
            'dob'    => 'nullable|date',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $source = $data['source'] ?? 'walkin';

        $patient = User::create([
            'name'     => $data['name'],
            'email'    => !empty($data['email']) ? $data['email'] : null,
            'password' => !empty($data['email']) ? Hash::make(str()->random(16)) : null,
            'role'     => 'patient',
            'source'   => $source,
        ]);

        if (! empty($data['phone'])) {
            $patient->mobile()->create(['mobile' => $data['phone']]);
        }

        return response()->json(['data' => $patient->load('mobile')], 201);
    }

    /**
     * PUT /api/patients/{id} — update patient info
     */
    public function update(Request $request, $id)
    {
        if (! in_array($request->user()->role, ['admin', 'super_admin', 'appointment_setter'])) {
            abort(403, 'Forbidden');
        }
        $patient = User::where('role', 'patient')->findOrFail($id);

        $data = $request->validate([
            'name'   => 'sometimes|required|string|max:255',
            'source' => 'nullable|in:online,walkin',
            'email'  => "nullable|email|unique:users,email,{$id}",
            'phone'  => 'nullable|string|max:30',
            'dob'    => 'nullable|date',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $updateData = array_filter([
            'name'   => $data['name'] ?? null,
            'email'  => array_key_exists('email', $data) ? ($data['email'] ?: null) : null,
            'source' => $data['source'] ?? null,
        ], fn($v) => $v !== null);

        if ($updateData) {
            $patient->update($updateData);
        }

        if (array_key_exists('phone', $data)) {
            if ($data['phone']) {
                $patient->mobile()->updateOrCreate([], ['mobile' => $data['phone']]);
            } else {
                $patient->mobile()->delete();
            }
        }

        return response()->json(['data' => $patient->load('mobile')]);
    }

    /**
     * DELETE /api/patients/{id}
     */
    public function destroy(Request $request, $id)
    {
        if (! in_array($request->user()->role, ['admin', 'super_admin'])) {
            abort(403, 'Forbidden');
        }
        $patient = User::where('role', 'patient')->findOrFail($id);
        $patient->delete();

        return response()->json(['message' => 'Patient removed.']);
    }
}
