<?php

namespace App\Console\Commands;

use App\Models\PermissionCategory;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class SyncPermissions extends Command
{
    protected $signature = 'permissions:sync';
    protected $description = 'Sync permissions & categories from config/permissions-list.php';

    public function handle(): int
    {
        $modules = config('permissions-list');
        $created = ['categories' => 0, 'permissions' => 0];

        foreach ($modules as $moduleKey => $module) {
            $category = PermissionCategory::firstOrCreate(
                ['name' => $module['name']],
                ['icon_key' => $module['icon_key'] ?? null]
            );

            if ($category->wasRecentlyCreated) {
                $created['categories']++;
                $this->info("  Category created: {$module['name']}");
            }

            foreach ($module['permissions'] as $action) {
                $permName = "{$moduleKey}.{$action}";
                $perm = Permission::firstOrCreate(
                    ['name' => $permName, 'guard_name' => 'web'],
                    ['category_id' => $category->id]
                );

                if ($perm->wasRecentlyCreated) {
                    $created['permissions']++;
                    $this->info("  Permission created: {$permName}");
                } else {
                    $perm->update(['category_id' => $category->id]);
                }
            }
        }

        $this->newLine();
        $this->info("Done! Created {$created['categories']} categories and {$created['permissions']} permissions.");

        return Command::SUCCESS;
    }
}
