<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Notifications\Notification;

class BookingConfirmation extends Notification
{
    public function __construct(
        protected Reservation $reservation
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Reservasi Dibuat',
            'message' => "Reservasi untuk {$this->reservation->cat->name} telah dibuat. Silakan lakukan pembayaran.",
            'reservation_id' => $this->reservation->id,
        ];
    }
}
