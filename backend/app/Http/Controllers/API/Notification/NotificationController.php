<?php

namespace App\Http\Controllers\API\Notification;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Traits\ApiResponse;

class NotificationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function index()
    {
        $notifications = $this->notificationService->getAll(auth()->id());

        return $this->paginated($notifications);
    }

    public function unread()
    {
        $notifications = $this->notificationService->getUnread(auth()->id());

        return $this->success($notifications);
    }

    public function markAsRead(int $id)
    {
        $notification = $this->notificationService->markAsRead($id);

        return $this->success($notification, 'Notification marked as read');
    }

    public function markAllAsRead()
    {
        $this->notificationService->markAllAsRead(auth()->id());

        return $this->success(null, 'All notifications marked as read');
    }

    public function destroy(int $id)
    {
        $this->notificationService->delete($id);

        return $this->success(null, 'Notification deleted');
    }
}
