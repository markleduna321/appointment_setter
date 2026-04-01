<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    private function requireAdmin(Request $request): void
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            abort(403, 'Unauthorized.');
        }
    }

    private function requireSuperAdmin(Request $request): void
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403, 'Unauthorized.');
        }
    }

    public function index(Request $request)
    {
        $query = Service::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $this->requireAdmin($request);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|string|max:100',
            'duration'    => 'required|integer|min:1|max:480',
            'price'       => 'required|numeric|min:0',
            'status'      => 'in:active,inactive',
        ]);

        $service = Service::create($data);

        return response()->json($service, 201);
    }

    public function show(int $id)
    {
        return response()->json(Service::findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $this->requireAdmin($request);

        $service = Service::findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'sometimes|required|string|max:100',
            'duration'    => 'sometimes|required|integer|min:1|max:480',
            'price'       => 'sometimes|required|numeric|min:0',
            'status'      => 'in:active,inactive',
        ]);

        $service->update($data);

        return response()->json($service);
    }

    public function destroy(Request $request, int $id)
    {
        $this->requireSuperAdmin($request);

        Service::findOrFail($id)->delete();

        return response()->json(['message' => 'Service deleted.']);
    }
}
