<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public function getAll(int $userId)
    {
        return Notification::where('user_id', $userId)
            ->latest()
            ->paginate(20);
    }

    public function getUnread(int $userId)
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->latest()
            ->get();
    }

    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    public function markAsRead(int $id): Notification
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read_at' => now()]);

        return $notification;
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function delete(int $id): void
    {
        Notification::findOrFail($id)->delete();
    }
}
