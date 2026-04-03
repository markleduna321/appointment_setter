<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\NotificationService;
use App\Models\User;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /api/availability?doctor_name=X&date=Y
    // Returns the time slots already booked for a doctor on a given date.
    // Only non-cancelled appointments are considered.
    // -------------------------------------------------------------------------
    public function availability(Request $request)
    {
        $request->validate([
            'doctor_name' => 'required|string|max:255',
            'date'        => 'required|date_format:Y-m-d',
            'exclude_id'  => 'sometimes|integer',
        ]);

        $query = Appointment::where('doctor_name', $request->doctor_name)
            ->whereDate('date', $request->date)
            ->where('status', 'confirmed');

        // When editing an existing appointment, exclude it so its own slot
        // doesn't appear as blocked.
        if ($request->filled('exclude_id')) {
            $query->where('id', '!=', (int) $request->exclude_id);
        }

        $booked = $query->pluck('time')
            ->map(fn ($t) => substr($t, 0, 5)) // normalise HH:MM:SS → HH:MM
            ->values();

        return response()->json(['booked' => $booked]);
    }

    // -------------------------------------------------------------------------
    // GET /api/appointments
    // -------------------------------------------------------------------------
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        $query = Appointment::with('patient:id,name,email')
            ->orderBy('date')
            ->orderBy('time');

        // Patients only see their own appointments
        if ($role === 'patient') {
            $query->where('user_id', $user->id);
        }

        // Doctors only see appointments assigned to them by name
        if ($role === 'doctor') {
            $doctorProfile = \App\Models\Doctor::where('user_id', $user->id)->first();
            if ($doctorProfile) {
                $query->where('doctor_name', $doctorProfile->name);
            } else {
                $query->whereRaw('0 = 1');
            }
        }

        // Optional filters
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }
        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('service', 'like', $search)
                  ->orWhere('doctor_name', 'like', $search)
                  ->orWhereHas('patient', fn ($p) => $p->where('name', 'like', $search));
            });
        }

        // Filter by patient's user_id (used by the patient profile drawer)
        if ($request->filled('user_id') && in_array($role, ['admin', 'super_admin', 'appointment_setter'])) {
            $patientName = \App\Models\User::where('id', $request->user_id)->value('name');
            $query->where(function ($q) use ($request, $patientName) {
                $q->where('user_id', $request->user_id);
                if ($patientName) {
                    $q->orWhere('patient_name', $patientName);
                }
            });
        }

        $perPage     = (int) $request->get('per_page', 15);
        $appointments = $query->paginate($perPage);

        // Resolve patient_name: prefer the stored column (manual appointments),
        // fall back to the linked user account name.
        $appointments->getCollection()->transform(function ($appt) {
            if (empty($appt->patient_name)) {
                $appt->patient_name = $appt->patient->name ?? '';
            }
            return $appt;
        });

        return response()->json($appointments);
    }

    // -------------------------------------------------------------------------
    // POST /api/appointments   (patients book; staff can create on behalf)
    // -------------------------------------------------------------------------
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'patient_name' => 'sometimes|nullable|string|max:255',
            'service'      => 'required|string|max:255',
            'doctor_name'  => 'required|string|max:255',
            'date'         => 'required|date|after_or_equal:today',
            'time'         => 'required|date_format:H:i',
            'notes'        => 'nullable|string|max:1000',
            'visit_type'   => 'sometimes|in:onsite,video_call',
            // Staff can optionally link to an existing user account
            'user_id'      => 'sometimes|nullable|integer|exists:users,id',
        ]);

        // For patients: always book for themselves.
        // For staff: use provided user_id if given, otherwise null (manual / phone-in).
        $patientId = null;
        if ($user->role === 'patient') {
            $patientId = $user->id;
        } elseif (!empty($data['user_id'])) {
            $patientId = $data['user_id'];
        }

        // Resolve the display name
        $patientName = null;
        if (!empty($data['patient_name'])) {
            $patientName = $data['patient_name'];
        } elseif ($patientId) {
            $patientName = User::find($patientId)?->name;
        }

        $appointment = Appointment::create([
            'user_id'      => $patientId,
            'patient_name' => $patientName,
            'service'      => $data['service'],
            'doctor_name'  => $data['doctor_name'],
            'date'         => $data['date'],
            'time'         => $data['time'],
            'notes'        => $data['notes'] ?? null,
            'status'       => 'pending',
            'visit_type'   => $data['visit_type'] ?? 'onsite',
            'source'       => $user->role === 'patient' ? 'online' : 'walkin',
        ]);

        $appointment->load('patient:id,name,email');
        // Ensure patient_name is always populated
        if (empty($appointment->patient_name)) {
            $appointment->patient_name = $appointment->patient->name ?? '';
            $appointment->saveQuietly();
        }

        // Notify the linked patient account (if any)
        if ($appointment->user_id) {
            NotificationService::send(
                $appointment->user_id,
                'appointment_booked',
                'Appointment Booked',
                "Your appointment for {$appointment->service} with {$appointment->doctor_name} on " . $appointment->date->format('M d, Y') . ' has been received and is pending confirmation.',
                $appointment->id
            );
        }

        // Notify admins/staff when a patient self-books
        if ($user->role === 'patient') {
            $adminRoles = ['super_admin', 'admin', 'appointment_setter'];
            $admins = User::whereIn('role', $adminRoles)->get();
            foreach ($admins as $admin) {
                if ($admin->id === $appointment->user_id) continue;

                NotificationService::send(
                    $admin->id,
                    'appointment_new',
                    'New Appointment Requested',
                    "{$appointment->patient_name} requested {$appointment->service} with {$appointment->doctor_name} on " . $appointment->date->format('M d, Y') . '.',
                    $appointment->id
                );
            }
        }

        return response()->json(['data' => $appointment], 201);
    }

    // -------------------------------------------------------------------------
    // GET /api/appointments/{id}
    // -------------------------------------------------------------------------
    public function show(Request $request, $id)
    {
        $appt = Appointment::with('patient:id,name,email')->findOrFail($id);
        $this->authorizeAccess($request->user(), $appt);

        if (empty($appt->patient_name)) {
            $appt->patient_name = $appt->patient->name ?? '';
        }
        return response()->json(['data' => $appt]);
    }

    // -------------------------------------------------------------------------
    // PUT /api/appointments/{id}   (staff/admin only)
    // -------------------------------------------------------------------------
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role === 'patient') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $appt = Appointment::findOrFail($id);

        $data = $request->validate([
            'patient_name' => 'sometimes|nullable|string|max:255',
            'service'      => 'sometimes|required|string|max:255',
            'doctor_name'  => 'sometimes|required|string|max:255',
            'date'         => 'sometimes|required|date',
            'time'         => 'sometimes|required|date_format:H:i',
            'notes'        => 'nullable|string|max:1000',
            'status'       => 'sometimes|required|in:pending,confirmed,completed,cancelled',
        ]);

        $oldStatus = $appt->status;
        $appt->fill($data);
        $appt->updated_by = $user->id;
        $appt->save();

        // fire notification when status changes
        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            NotificationService::appointmentStatusChanged($appt, $oldStatus);
        }

        $appt->load('patient:id,name,email');
        if (empty($appt->patient_name)) {
            $appt->patient_name = $appt->patient->name ?? '';
        }

        return response()->json(['data' => $appt]);
    }

    // -------------------------------------------------------------------------
    // PATCH /api/appointments/{id}/cancel   (patient self-cancel with time gate)
    // -------------------------------------------------------------------------
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        $appt = Appointment::findOrFail($id);

        $this->authorizeAccess($user, $appt);

        if (in_array($appt->status, ['cancelled', 'completed'])) {
            return response()->json(['message' => 'Appointment cannot be cancelled.'], 422);
        }

        // Patients must cancel more than 3 hours before the appointment
        if ($user->role === 'patient' && ! $appt->isMoreThanHoursAway(3)) {
            return response()->json([
                'message' => 'Cancellation is only allowed more than 3 hours before the appointment.',
            ], 422);
        }

        $oldStatus        = $appt->status;
        $appt->status     = 'cancelled';
        $appt->updated_by = $user->id;
        $appt->save();

        NotificationService::appointmentStatusChanged($appt, $oldStatus);

        return response()->json(['data' => $appt]);
    }

    // -------------------------------------------------------------------------
    // DELETE /api/appointments/{id}   (admin/staff only — patients cannot delete)
    // -------------------------------------------------------------------------
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role === 'patient') {
            return response()->json(['message' => 'Patients cannot delete appointments.'], 403);
        }

        $appt = Appointment::findOrFail($id);
        $appt->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private function authorizeAccess($user, Appointment $appt): void
    {
        if ($user->role === 'patient' && $appt->user_id !== $user->id) {
            abort(403, 'Forbidden');
        }
    }
}
