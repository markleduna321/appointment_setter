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
        ]);

        $booked = Appointment::where('doctor_name', $request->doctor_name)
            ->whereDate('date', $request->date)
            ->where('status', 'confirmed')
            ->pluck('time')
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

        $perPage     = (int) $request->get('per_page', 15);
        $appointments = $query->paginate($perPage);

        // Append patient_name to each item so the frontend can use it directly
        $appointments->getCollection()->transform(function ($appt) {
            $appt->patient_name = $appt->patient->name ?? '';
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
            'service'     => 'required|string|max:255',
            'doctor_name' => 'required|string|max:255',
            'date'        => 'required|date|after_or_equal:today',
            'time'        => 'required|date_format:H:i',
            'notes'       => 'nullable|string|max:1000',
            // Staff can specify a patient; patients always book for themselves
            'user_id'     => 'sometimes|integer|exists:users,id',
        ]);

        // Resolve who the appointment belongs to
        $patientId = ($user->role !== 'patient' && isset($data['user_id']))
            ? $data['user_id']
            : $user->id;

        $appointment = Appointment::create([
            'user_id'     => $patientId,
            'service'     => $data['service'],
            'doctor_name' => $data['doctor_name'],
            'date'        => $data['date'],
            'time'        => $data['time'],
            'notes'       => $data['notes'] ?? null,
            'status'      => 'pending',
        ]);

        $appointment->load('patient:id,name,email');
        $appointment->patient_name = $appointment->patient->name ?? '';

        // Notify the patient a new appointment has been received
        NotificationService::send(
            $appointment->user_id,
            'appointment_booked',
            'Appointment Booked',
            "Your appointment for {$appointment->service} with {$appointment->doctor_name} on " . $appointment->date->format('M d, Y') . ' has been received and is pending confirmation.',
            $appointment->id
        );

        // Notify admins/staff when a patient creates an appointment
        if ($user->role === 'patient') {
            $adminRoles = ['super_admin', 'admin', 'appointment_setter'];
            $admins = User::whereIn('role', $adminRoles)->get();
            foreach ($admins as $admin) {
                // skip notifying the patient themselves if roles overlap
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

        $appt->patient_name = $appt->patient->name ?? '';
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
            'service'     => 'sometimes|required|string|max:255',
            'doctor_name' => 'sometimes|required|string|max:255',
            'date'        => 'sometimes|required|date',
            'time'        => 'sometimes|required|date_format:H:i',
            'notes'       => 'nullable|string|max:1000',
            'status'      => 'sometimes|required|in:pending,confirmed,completed,cancelled',
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
        $appt->patient_name = $appt->patient->name ?? '';

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
