<?php

namespace App\Http\Controllers\API\Permission;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\PermissionCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PermissionCategoryController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $categories = PermissionCategory::withCount('permissions')
            ->when(request('search'), fn ($q) => $q->where('name', 'like', '%' . request('search') . '%'))
            ->latest()
            ->get();

        return $this->success($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permission_categories,name',
            'icon_key' => 'nullable|string|max:100',
        ]);

        $category = PermissionCategory::create($validated);

        return $this->success($category, 'Category created successfully', 201);
    }

    public function show(int $id)
    {
        $category = PermissionCategory::with('permissions')->findOrFail($id);

        $unassigned = Permission::whereNull('category_id')->get();

        return $this->success([
            'category' => $category,
            'unassigned_permissions' => $unassigned,
        ]);
    }

    public function update(int $id, Request $request)
    {
        $category = PermissionCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permission_categories,name,' . $id,
            'icon_key' => 'nullable|string|max:100',
        ]);

        $category->update($validated);

        return $this->success($category, 'Category updated successfully');
    }

    public function destroy(int $id)
    {
        $category = PermissionCategory::withCount('permissions')->findOrFail($id);

        if ($category->permissions_count > 0) {
            return $this->error('Cannot delete category with existing permissions', 422);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }

    public function assignPermission(int $id, Request $request)
    {
        $request->validate([
            'permission_id' => 'required|integer|exists:permissions,id',
        ]);

        $permission = Permission::findOrFail($request->permission_id);
        $permission->update(['category_id' => $id]);

        return $this->success($permission, 'Permission assigned to category');
    }

    public function removePermission(int $id, int $permissionId)
    {
        $permission = Permission::where('category_id', $id)->findOrFail($permissionId);
        $permission->update(['category_id' => null]);

        return $this->success($permission, 'Permission removed from category');
    }
}
