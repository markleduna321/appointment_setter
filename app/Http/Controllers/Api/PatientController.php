<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * GET /api/patients — list patients (role = patient)
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'patient')->orderBy('name');

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
        $patient = User::where('role', 'patient')->find($id);
        if (! $patient) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['data' => $patient]);
    }
}
