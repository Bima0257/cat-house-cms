<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Users
            'users.index', 'users.view', 'users.create', 'users.update', 'users.delete',
            'users.toggle-active',

            // Services
            'services.index', 'services.view', 'services.create', 'services.update', 'services.delete',
            'services.toggle-active',

            // Cages
            'cages.index', 'cages.view', 'cages.create', 'cages.update', 'cages.delete',

            // Permissions
            'permissions.index', 'permissions.create', 'permissions.update', 'permissions.delete',

            // Roles
            'roles.index', 'roles.view', 'roles.update',

            // Reservations
            'reservations.index', 'reservations.view', 'reservations.update-status', 'reservations.delete',

            // Payments
            'payments.verify', 'payments.reject',

            // Daily Reports
            'daily-reports.index', 'daily-reports.view', 'daily-reports.create', 'daily-reports.update',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $superAdmin = Role::where('name', 'super_admin')->first();
        $admin = Role::where('name', 'admin')->first();
        $staff = Role::where('name', 'staff')->first();

        if ($superAdmin) {
            $superAdmin->syncPermissions($permissions);
        }

        if ($admin) {
            $admin->syncPermissions([
                'users.index', 'users.view', 'users.create', 'users.update', 'users.delete',
                'users.toggle-active',
                'services.index', 'services.view', 'services.create', 'services.update', 'services.delete',
                'services.toggle-active',
                'cages.index', 'cages.view', 'cages.create', 'cages.update', 'cages.delete',
                'permissions.index', 'permissions.create', 'permissions.update', 'permissions.delete',
                'roles.index', 'roles.view', 'roles.update',
                'reservations.index', 'reservations.view', 'reservations.update-status', 'reservations.delete',
                'payments.verify', 'payments.reject',
                'daily-reports.index', 'daily-reports.view', 'daily-reports.create', 'daily-reports.update',
            ]);
        }

        if ($staff) {
            $staff->syncPermissions([
                'reservations.index', 'reservations.view', 'reservations.update-status', 'reservations.delete',
                'payments.verify', 'payments.reject',
                'daily-reports.index', 'daily-reports.view', 'daily-reports.create', 'daily-reports.update',
                'roles.index', 'roles.view',
            ]);
        }
    }
}
