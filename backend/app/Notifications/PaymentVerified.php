<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Notifications\Notification;

class PaymentVerified extends Notification
{
    public function __construct(
        protected Payment $payment
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Pembayaran Terverifikasi',
            'message' => 'Pembayaran sebesar '.format_rupiah($this->payment->amount).' telah diverifikasi.',
            'payment_id' => $this->payment->id,
        ];
    }
}
