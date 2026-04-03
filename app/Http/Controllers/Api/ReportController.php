<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Advanced report with KPIs, trends, doctor performance, service and status breakdown.
     * GET /api/reports/advanced?date_from=&date_to=&doctor=
     */
    public function advanced(Request $request)
    {
        $dateFrom = $request->input('date_from', Carbon::today()->subDays(29)->toDateString());
        $dateTo   = $request->input('date_to',   Carbon::today()->toDateString());
        $doctor   = $request->input('doctor');

        // ── base filter closure ───────────────────────────────────────────────
        $base = fn () => Appointment::whereBetween('date', [$dateFrom, $dateTo])
            ->when($doctor, fn ($q) => $q->where('doctor_name', $doctor));

        // ── KPIs ──────────────────────────────────────────────────────────────
        $total     = $base()->count();
        $completed = $base()->where('status', 'completed')->count();
        $cancelled = $base()->where('status', 'cancelled')->count();
        $pending   = $base()->where('status', 'pending')->count();
        $confirmed = $base()->where('status', 'confirmed')->count();

        $days          = max(1, Carbon::parse($dateFrom)->diffInDays(Carbon::parse($dateTo)) + 1);
        $avgPerDay     = round($total / $days, 1);
        $completionRate = $total > 0 ? round($completed / $total * 100, 1) : 0;
        $uniquePatients = $base()->distinct('user_id')->count('user_id');

        // ── Daily trend ───────────────────────────────────────────────────────
        $raw = $base()
            ->selectRaw('date, status, COUNT(*) as cnt')
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

        $byDateMap = [];
        foreach ($raw as $row) {
            $d = $row->date instanceof Carbon ? $row->date->toDateString() : (string) $row->date;
            $byDateMap[$d][$row->status] = intval($row->cnt);
        }

        $start  = Carbon::parse($dateFrom);
        $end    = Carbon::parse($dateTo);
        $labels = [];
        $cur    = $start->copy();
        while ($cur->lte($end)) {
            $labels[] = $cur->toDateString();
            $cur->addDay();
        }

        $byDate = array_map(function ($date) use ($byDateMap) {
            $e = $byDateMap[$date] ?? [];
            return [
                'date'      => $date,
                'total'     => array_sum($e),
                'completed' => $e['completed'] ?? 0,
                'confirmed' => $e['confirmed'] ?? 0,
                'pending'   => $e['pending']   ?? 0,
                'cancelled' => $e['cancelled'] ?? 0,
            ];
        }, $labels);

        // ── Doctor performance ────────────────────────────────────────────────
        $byDoctor = $base()
            ->selectRaw('doctor_name,
                COUNT(*) as total,
                SUM(status = "completed") as completed,
                SUM(status = "cancelled") as cancelled,
                SUM(status = "pending")   as pending,
                SUM(status = "confirmed") as confirmed')
            ->groupBy('doctor_name')
            ->orderByDesc('total')
            ->get()
            ->map(function ($r) {
                $t = intval($r->total);
                $c = intval($r->completed);
                return [
                    'doctor_name'     => $r->doctor_name,
                    'total'           => $t,
                    'completed'       => $c,
                    'cancelled'       => intval($r->cancelled),
                    'pending'         => intval($r->pending),
                    'confirmed'       => intval($r->confirmed),
                    'completion_rate' => $t > 0 ? round($c / $t * 100, 1) : 0,
                ];
            });

        // ── Service breakdown ─────────────────────────────────────────────────
        $byService = $base()
            ->selectRaw('service, COUNT(*) as total, SUM(status = "completed") as completed')
            ->groupBy('service')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'service'   => $r->service ?? 'Unknown',
                'total'     => intval($r->total),
                'completed' => intval($r->completed),
            ]);

        // ── Status distribution ───────────────────────────────────────────────
        $byStatus = $base()
            ->selectRaw('status, COUNT(*) as cnt')
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => ['status' => $r->status, 'count' => intval($r->cnt)]);

        // ── Source breakdown ──────────────────────────────────────────────────
        $bySource = $base()
            ->selectRaw('COALESCE(NULLIF(source,""), "online") as source, COUNT(*) as cnt')
            ->groupBy('source')
            ->get()
            ->map(fn ($r) => ['source' => $r->source, 'count' => intval($r->cnt)]);

        // ── Distinct doctors (for filter dropdown) ────────────────────────────
        $doctors = Appointment::distinct()
            ->orderBy('doctor_name')
            ->pluck('doctor_name')
            ->filter()
            ->values();

        return response()->json(['data' => [
            'kpi' => [
                'total'           => $total,
                'completed'       => $completed,
                'cancelled'       => $cancelled,
                'pending'         => $pending,
                'confirmed'       => $confirmed,
                'avg_per_day'     => $avgPerDay,
                'completion_rate' => $completionRate,
                'unique_patients' => $uniquePatients,
            ],
            'by_date'    => $byDate,
            'by_doctor'  => $byDoctor,
            'by_service' => $byService,
            'by_status'  => $byStatus,
            'by_source'  => $bySource,
            'doctors'    => $doctors,
            'date_from'  => $dateFrom,
            'date_to'    => $dateTo,
        ]]);
    }


    /**
     * Return appointment summary data for charts and tables.
     * GET /api/reports/appointments-summary?days=7
     */
    public function appointmentsSummary(Request $request)
    {
        $days = max(1, intval($request->input('days', 7)));
        $end = Carbon::today();
        $start = $end->copy()->subDays($days - 1);

        // Prepare labels for the requested range
        $labels = [];
        for ($d = 0; $d < $days; $d++) {
            $labels[] = $start->copy()->addDays($d)->toDateString();
        }

        // Counts grouped by date
        $counts = Appointment::selectRaw('date, COUNT(*) as cnt')
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('cnt', 'date')
            ->toArray();

        $by_date = array_map(function ($date) use ($counts) {
            return ['date' => $date, 'count' => intval($counts[$date] ?? 0)];
        }, $labels);

        // Top doctors by appointments (all time, limited)
        $by_doctor = Appointment::selectRaw('doctor_name, COUNT(*) as cnt')
            ->groupBy('doctor_name')
            ->orderByDesc('cnt')
            ->limit(10)
            ->get()
            ->map(function ($r) {
                return ['doctor_name' => $r->doctor_name, 'count' => intval($r->cnt)];
            })
            ->toArray();

        return response()->json(['data' => [
            'labels' => $labels,
            'by_date' => $by_date,
            'by_doctor' => $by_doctor,
        ]]);
    }
}
