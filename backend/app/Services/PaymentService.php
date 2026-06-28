<?php

namespace App\Services;

use App\Models\Payment;
use App\Traits\ImageUpload;

class PaymentService
{
    use ImageUpload;

    public function getAll(array $filters = [])
    {
        return Payment::query()
            ->when(isset($filters['status']), fn ($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['payment_method']), fn ($q) => $q->where('payment_method', $filters['payment_method']))
            ->when(isset($filters['user_id']), fn ($q) => $q->whereHas('reservation',
                fn ($q) => $q->where('user_id', $filters['user_id'])
            ))
            ->with('reservation.user')
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): Payment
    {
        return Payment::with('reservation.user', 'reservation.cat')->findOrFail($id);
    }

    public function create(array $data): Payment
    {
        if (isset($data['proof'])) {
            $data['proof'] = $this->uploadImage($data['proof'], 'payments');
        }

        return Payment::create($data);
    }

    public function verify(int $id): Payment
    {
        $payment = $this->findById($id);
        $payment->update([
            'status' => 'terverifikasi',
            'paid_at' => now(),
        ]);

        $payment->reservation->update(['status' => 'konfirmasi']);

        return $payment;
    }

    public function reject(int $id): Payment
    {
        $payment = $this->findById($id);
        $payment->update(['status' => 'gagal']);

        return $payment;
    }
}
