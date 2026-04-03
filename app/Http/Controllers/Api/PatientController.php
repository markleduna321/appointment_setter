<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        $query = User::with('mobile')->where('role', 'patient')->orderBy('name');

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('email', 'like', $search);
            });
        }

        $patients = $query->get();

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
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'dob'   => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        $patient = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make(str()->random(16)),
            'role'     => 'patient',
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
        $patient = User::where('role', 'patient')->findOrFail($id);

        $data = $request->validate([
            'name'  => 'sometimes|required|string|max:255',
            'email' => "sometimes|required|email|unique:users,email,{$id}",
            'phone' => 'nullable|string|max:30',
            'dob'   => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        $patient->update(array_filter([
            'name'  => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
        ], fn($v) => $v !== null));

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
    public function destroy($id)
    {
        $patient = User::where('role', 'patient')->findOrFail($id);
        $patient->delete();

        return response()->json(['message' => 'Patient removed.']);
    }
}
