<?php

namespace App\Http\Controllers\API\Permission;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    use ApiResponse;

    private function getManageableRoles(): array
    {
        return match (auth()->user()->roles->first()?->name) {
            'super_admin' => ['admin', 'staff', 'user'],
            'admin' => ['staff', 'user'],
            'staff' => ['user'],
            default => [],
        };
    }

    public function index()
    {
        $allowedRoles = $this->getManageableRoles();

        $roles = Role::whereIn('name', $allowedRoles)
            ->get()
            ->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'users_count' => $role->users()->count(),
            ]);

        return $this->success($roles);
    }

    public function show(Role $role)
    {
        $allowedRoles = $this->getManageableRoles();

        if (! in_array($role->name, $allowedRoles)) {
            return $this->error('Anda tidak memiliki akses ke role ini.', 403);
        }

        $allPermissions = Permission::all()->map(fn ($perm) => [
            'id' => $perm->id,
            'name' => $perm->name,
            'assigned' => $role->hasPermissionTo($perm->name),
        ]);

        return $this->success([
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
            ],
            'permissions' => $allPermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $allowedRoles = $this->getManageableRoles();

        if (! in_array($role->name, $allowedRoles)) {
            return $this->error('Anda tidak memiliki akses ke role ini.', 403);
        }

        $request->validate([
            'permission_ids' => 'present|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role->syncPermissions($request->permission_ids);

        return $this->success(null, 'Permission berhasil diperbarui');
    }
}
