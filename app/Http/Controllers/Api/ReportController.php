<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
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
