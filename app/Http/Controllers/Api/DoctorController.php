<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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
    // POST /api/doctors  — super_admin only
    // -----------------------------------------------------------------------
    public function store(Request $request)
    {
        $this->requireSuperAdmin($request);

        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'specialty'      => 'required|string|max:255',
            'email'          => 'required|email|unique:doctors,email|unique:users,email',
            'password'       => 'required|string|min:8',
            'phone'          => 'nullable|string|max:50',
            'bio'            => 'nullable|string|max:2000',
            'photo'          => 'nullable|file|image|max:10240',
            'status'         => 'sometimes|in:available,unavailable,on_leave',
            'schedule_start' => 'nullable|date_format:H:i',
            'schedule_end'   => 'nullable|date_format:H:i',
            'schedule_days'  => 'nullable|array',
            'schedule_days.*'=> 'in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('doctors', 'public');
            $data['photo'] = Storage::url($path);
        }

        $doctor = DB::transaction(function () use ($data) {
            // Create the user account for this doctor
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => 'doctor',
            ]);

            return Doctor::create(array_merge(
                collect($data)->except('password')->toArray(),
                ['user_id' => $user->id]
            ));
        });

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
    // PUT /api/doctors/{id}  — super_admin only
    // -----------------------------------------------------------------------
    public function update(Request $request, $id)
    {
        $this->requireSuperAdmin($request);

        $doctor = Doctor::findOrFail($id);

        $data = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'specialty'      => 'sometimes|required|string|max:255',
            'email'          => 'nullable|email|unique:doctors,email,' . $id . '|unique:users,email,' . ($doctor->user_id ?? 'NULL') . ',id',
            'password'       => 'nullable|string|min:8',
            'phone'          => 'nullable|string|max:50',
            'bio'            => 'nullable|string|max:2000',
            'photo'          => 'nullable|file|image|max:10240',
            'status'         => 'sometimes|in:available,unavailable,on_leave',
            'schedule_start' => 'nullable|date_format:H:i',
            'schedule_end'   => 'nullable|date_format:H:i',
            'schedule_days'  => 'nullable|array',
            'schedule_days.*'=> 'in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if stored locally
            if ($doctor->photo && str_starts_with($doctor->photo, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $doctor->photo));
            }
            $path = $request->file('photo')->store('doctors', 'public');
            $data['photo'] = Storage::url($path);
        }

        DB::transaction(function () use ($data, $doctor) {
            $doctor->update(collect($data)->except('password')->toArray());

            // Sync the linked user account if it exists
            if ($doctor->user) {
                $userUpdate = [];
                if (isset($data['name']))     $userUpdate['name']     = $data['name'];
                if (!empty($data['email']))   $userUpdate['email']    = $data['email'];
                if (!empty($data['password'])) $userUpdate['password'] = Hash::make($data['password']);
                if ($userUpdate) $doctor->user->update($userUpdate);
            }
        });

        return response()->json(['data' => $doctor->fresh()]);
    }

    // -----------------------------------------------------------------------
    // DELETE /api/doctors/{id}  — super_admin only
    // -----------------------------------------------------------------------
    public function destroy(Request $request, $id)
    {
        $this->requireSuperAdmin($request);

        $doctor = Doctor::findOrFail($id);

        DB::transaction(function () use ($doctor) {
            // Remove the linked user account (cascades session etc. via nullOnDelete on doctors.user_id)
            if ($doctor->user) {
                $doctor->user->delete();
            }
            $doctor->delete();
        });

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
