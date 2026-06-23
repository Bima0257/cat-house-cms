<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\PermissionCategory;
use Illuminate\Database\Seeder;

class PermissionCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'users' => ['name' => 'Users', 'icon_key' => 'IconUsers'],
            'services' => ['name' => 'Services', 'icon_key' => 'IconToolsKitchen2'],
            'cages' => ['name' => 'Cages', 'icon_key' => 'IconHome'],
            'permissions' => ['name' => 'Permissions', 'icon_key' => 'IconShield'],
            'roles' => ['name' => 'Roles', 'icon_key' => 'IconLock'],
            'reservations' => ['name' => 'Reservations', 'icon_key' => 'IconCalendarClock'],
            'payments' => ['name' => 'Payments', 'icon_key' => 'IconCreditCard'],
            'daily-reports' => ['name' => 'Daily Reports', 'icon_key' => 'IconFileDescription'],
            'kategori-produk' => ['name' => 'Kategori Produk', 'icon_key' => 'IconCategory'],
            'produk' => ['name' => 'Produk', 'icon_key' => 'IconPackage'],
        ];

        foreach ($categories as $key => $data) {
            PermissionCategory::firstOrCreate(
                ['name' => $data['name']],
                ['icon_key' => $data['icon_key']]
            );
        }

        $allCategories = PermissionCategory::pluck('id', 'name');
        $nameToKey = array_flip(array_column($categories, 'name'));

        Permission::all()->each(function (Permission $permission) use ($allCategories, $nameToKey) {
            $module = explode('.', $permission->name)[0];
            $categoryName = $categories[$module]['name'] ?? null;

            if ($categoryName && isset($allCategories[$categoryName])) {
                $permission->update(['category_id' => $allCategories[$categoryName]]);
            }
        });
    }
}
