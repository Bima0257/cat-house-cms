<?php

namespace App\Services;

use App\Models\ActivityLog;

class AuditService
{
    public function log(string $action, string $description, ?array $metadata = null, ?int $userId = null): void
    {
        ActivityLog::create([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => $metadata,
        ]);
    }

    public function getAll(array $filters)
    {
        return ActivityLog::with('user')
            ->when($filters['action'] ?? null, fn($q, $v) => $q->where('action', $v))
            ->when($filters['user_id'] ?? null, fn($q, $v) => $q->where('user_id', $v))
            ->when($filters['date_from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($filters['search'] ?? null, fn($q, $v) => $q->where('description', 'like', "%{$v}%"))
            ->latest()
            ->paginate($filters['per_page'] ?? 50);
    }

    public function getActions(): array
    {
        return ActivityLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action')
            ->toArray();
    }
}
