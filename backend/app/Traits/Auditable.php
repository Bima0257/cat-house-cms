<?php

namespace App\Traits;

use App\Services\AuditService;

trait Auditable
{
    protected static function bootAuditable(): void
    {
        static::created(function ($model) {
            if (!auth()->check()) return;
            $name = method_exists($model, 'auditableName') ? $model->auditableName() : "#{$model->id}";
            $table = $model->getTable();
            app(AuditService::class)->log(
                action: "{$table}.create",
                description: "Membuat {$table}: {$name}",
                metadata: ['model_id' => $model->id],
            );
        });

        static::updated(function ($model) {
            if (!auth()->check()) return;
            $name = method_exists($model, 'auditableName') ? $model->auditableName() : "#{$model->id}";
            $table = $model->getTable();
            $changes = $model->getChanges();
            unset($changes['updated_at']);
            if (empty($changes)) return;
            app(AuditService::class)->log(
                action: "{$table}.update",
                description: "Mengubah {$table}: {$name}",
                metadata: ['model_id' => $model->id, 'changes' => $changes],
            );
        });

        static::deleted(function ($model) {
            if (!auth()->check()) return;
            $name = method_exists($model, 'auditableName') ? $model->auditableName() : "#{$model->id}";
            $table = $model->getTable();
            app(AuditService::class)->log(
                action: "{$table}.delete",
                description: "Menghapus {$table}: {$name}",
                metadata: ['model_id' => $model->id],
            );
        });
    }
}
