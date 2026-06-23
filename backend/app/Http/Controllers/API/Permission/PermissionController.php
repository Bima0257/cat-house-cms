<?php

namespace App\Http\Controllers\API\Permission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use App\Models\Permission;
use App\Models\PermissionCategory;
use App\Traits\ApiResponse;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $permissions = Permission::with('category')
            ->when(request('search'), fn ($q) => $q->where('name', 'like', '%' . request('search') . '%'))
            ->latest()
            ->paginate(request('per_page', 100));

        return $this->paginated($permissions);
    }

    public function store(StorePermissionRequest $request)
    {
        $permission = Permission::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return $this->success($permission, 'Permission created successfully', 201);
    }

    public function update(int $id, UpdatePermissionRequest $request)
    {
        $permission = Permission::findOrFail($id);
        $permission->update([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return $this->success($permission, 'Permission updated successfully');
    }

    public function destroy(int $id)
    {
        $permission = Permission::findOrFail($id);

        $permission->roles()->detach();

        Permission::withoutEvents(function () use ($permission) {
            $permission->delete();
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $this->success(null, 'Permission deleted successfully');
    }
}
