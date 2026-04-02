<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Return a summary of the authenticated user's dashboard.
     */
    public function summary(Request $request): JsonResponse
    {
        $user  = $request->user();
        $role  = $user->role;
        $today = now()->toDateString();
        $isPatient = $role === 'patient';

        // Base query scoped to the patient's own appointments when role = patient
        $base = Appointment::when($isPatient, fn ($q) => $q->where('user_id', $user->id));

        // --- Stats ---
        $todaysTotal = (clone $base)->whereDate('date', $today)->count();
        $pending     = (clone $base)->where('status', 'pending')->count();
        $confirmed   = (clone $base)->where('status', 'confirmed')->count();
        $completed   = (clone $base)->where('status', 'completed')->count();
        $cancelled   = (clone $base)->where('status', 'cancelled')->count();

        // --- Upcoming (next 5) ---
        $upcomingRaw = (clone $base)
            ->with('patient:id,name')
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('date', '>=', $today)
            ->orderBy('date')
            ->orderBy('time')
            ->limit(5)
            ->get();

        $upcoming = $upcomingRaw->map(fn ($a) => [
            'id'          => $a->id,
            'doctor_name' => $a->doctor_name,
            'service'     => $a->service,
            'date'        => $a->date->toDateString(),
            'time'        => $a->time,
            'status'      => $a->status,
            'patient_name'=> $a->patient->name ?? '',
        ]);

        // --- Chart: appointments booked each day of current week ---
        $startOfWeek = now()->startOfWeek(); // Monday
        $weekCounts  = [];
        $days        = [];
        for ($i = 0; $i < 7; $i++) {
            $day = $startOfWeek->copy()->addDays($i);
            $days[] = $day->format('D');
            $weekCounts[] = (clone $base)->whereDate('date', $day->toDateString())->count();
        }
        
            // --- Specialty distribution ---
            $specialtyCounts = DB::table('appointments')
                ->leftJoin('doctors', 'appointments.doctor_name', '=', 'doctors.name')
                ->select(DB::raw("COALESCE(doctors.specialty, 'Other') as specialty"), DB::raw('count(appointments.id) as count'))
                ->groupBy('specialty')
                ->orderByDesc('count')
                ->get()
                ->map(fn ($r) => ['label' => $r->specialty, 'count' => (int) $r->count]);

        // Unified stats structure (frontend expects these keys).
        $stats = [
            'todays_appointments' => $todaysTotal,
            'pending_bookings'    => $pending,
            'available_doctors'   => 0, // extend when doctors table exists
            'new_notifications'   => 0,
            'confirmed'           => $confirmed,
            'completed'           => $completed,
            'cancelled'           => $cancelled,
            // Additional aggregates for consumers that need them
            'upcoming'            => $pending + $confirmed,
            'all_time'            => (clone $base)->count(),
        ];

        return response()->json([
            'stats'                 => $stats,
            'upcoming_appointments' => $upcoming,
            'announcements' => [
                [
                    'id'       => 1,
                    'title'    => 'Welcome!',
                    'message'  => 'Your account is active. ' . ($isPatient ? 'Book your first appointment today.' : 'Manage appointments from the dashboard.'),
                    'priority' => 'info',
                    'time'     => 'System',
                ],
            ],
            'quick_stats' => [
                'appointments_this_week' => $weekCounts,
                'days'                   => $days,
                    'specialties'            => $specialtyCounts,
            ],
            'user' => [
                'name'     => $user->name,
                'email'    => $user->email,
                'initials' => strtoupper(substr($user->name, 0, 1)),
            ],
        ]);
    }
}
