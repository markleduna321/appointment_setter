<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    // -----------------------------------------------------------------------
    // GET /api/doctors  — public-facing list (all roles)
    // -----------------------------------------------------------------------
    public function index(Request $request)
    {
        $query = Doctor::orderBy('name');

        if ($request->filled('specialty')) {
            $query->where('specialty', $request->specialty);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('specialty', 'like', $search);
            });
        }

        $doctors = $query->get();

        return response()->json(['data' => $doctors]);
    }

    // -----------------------------------------------------------------------
    // POST /api/doctors  — admin/super_admin only
    // -----------------------------------------------------------------------
    public function store(Request $request)
    {
        $this->requireAdmin($request);

        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'specialty'      => 'required|string|max:255',
            'email'          => 'nullable|email|unique:doctors,email',
            'phone'          => 'nullable|string|max:50',
            'bio'            => 'nullable|string|max:2000',
            'photo'          => 'nullable|string|max:500',
            'status'         => 'sometimes|in:available,unavailable,on_leave',
            'schedule_start' => 'nullable|date_format:H:i',
            'schedule_end'   => 'nullable|date_format:H:i',
            'schedule_days'  => 'nullable|array',
            'schedule_days.*'=> 'in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
        ]);

        $doctor = Doctor::create($data);

        return response()->json(['data' => $doctor], 201);
    }

    // -----------------------------------------------------------------------
    // GET /api/doctors/{id}
    // -----------------------------------------------------------------------
    public function show($id)
    {
        $doctor = Doctor::findOrFail($id);
        return response()->json(['data' => $doctor]);
    }

    // -----------------------------------------------------------------------
    // PUT /api/doctors/{id}  — admin/super_admin only
    // -----------------------------------------------------------------------
    public function update(Request $request, $id)
    {
        $this->requireAdmin($request);

        $doctor = Doctor::findOrFail($id);

        $data = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'specialty'      => 'sometimes|required|string|max:255',
            'email'          => 'nullable|email|unique:doctors,email,' . $id,
            'phone'          => 'nullable|string|max:50',
            'bio'            => 'nullable|string|max:2000',
            'photo'          => 'nullable|string|max:500',
            'status'         => 'sometimes|in:available,unavailable,on_leave',
            'schedule_start' => 'nullable|date_format:H:i',
            'schedule_end'   => 'nullable|date_format:H:i',
            'schedule_days'  => 'nullable|array',
            'schedule_days.*'=> 'in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
        ]);

        $doctor->update($data);

        return response()->json(['data' => $doctor]);
    }

    // -----------------------------------------------------------------------
    // DELETE /api/doctors/{id}  — super_admin only
    // -----------------------------------------------------------------------
    public function destroy(Request $request, $id)
    {
        $this->requireSuperAdmin($request);

        $doctor = Doctor::findOrFail($id);
        $doctor->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private function requireAdmin(Request $request): void
    {
        $role = $request->user()->role;
        if (! in_array($role, ['admin', 'super_admin'])) {
            abort(403, 'Forbidden');
        }
    }

    private function requireSuperAdmin(Request $request): void
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403, 'Forbidden');
        }
    }
}
