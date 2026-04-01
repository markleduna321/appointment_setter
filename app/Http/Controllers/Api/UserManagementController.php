<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $admins = User::whereIn('role', ['admin', 'super_admin', 'appointment_setter'])->orderBy('created_at', 'desc')->get();

        return response()->json(['response' => $admins]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|required|in:admin,super_admin,appointment_setter',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $request->input('role', 'admin'),
        ]);

        return response()->json(['response' => $user], 201);
    }

    public function show($id)
    {
        if (auth()->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['response' => $user]);
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|required|in:admin,super_admin,appointment_setter,patient',
        ]);

        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['email'])) $user->email = $data['email'];
        if (! empty($data['password'])) $user->password = Hash::make($data['password']);
        if (isset($data['role'])) $user->role = $data['role'];

        $user->save();

        return response()->json(['response' => $user]);
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot delete super admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
