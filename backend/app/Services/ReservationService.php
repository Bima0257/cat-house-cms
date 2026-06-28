<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Cage;
use App\Models\Reservation;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ReservationService
{
    private const ALLOWED_TRANSITIONS = [
        'pending' => ['konfirmasi', 'batal'],
        'konfirmasi' => ['checkin', 'batal'],
        'checkin' => ['checkout', 'batal'],
    ];

    public function getAll(array $filters = [])
    {
        return Reservation::query()
            ->when(isset($filters['user_id']), fn ($q) => $q->where('user_id', $filters['user_id']))
            ->when(isset($filters['status']), fn ($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['date_from']), fn ($q) => $q->whereDate('check_in', '>=', $filters['date_from']))
            ->when(isset($filters['date_to']), fn ($q) => $q->whereDate('check_out', '<=', $filters['date_to']))
            ->when(isset($filters['search']), function ($q) use ($filters) {
                $s = $filters['search'];
                $q->where(function ($q) use ($s) {
                    $q->where('note', 'like', "%{$s}%")
                      ->orWhereHas('cat', fn ($q) => $q->where('name', 'like', "%{$s}%"))
                      ->orWhereHas('service', fn ($q) => $q->where('name', 'like', "%{$s}%"))
                      ->orWhereHas('cage', fn ($q) => $q->where('code', 'like', "%{$s}%"));
                });
            })
            ->with(['user', 'cat', 'service', 'cage', 'payment'])
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): Reservation
    {
        return Reservation::with(['user', 'cat', 'service', 'cage', 'payment', 'dailyReports'])->findOrFail($id);
    }

    public function create(array $data): Reservation
    {
        $data['uuid'] = (string) Str::uuid();
        $checkIn = Carbon::parse($data['check_in']);
        $checkOut = Carbon::parse($data['check_out']);
        $data['total_days'] = $checkIn->diffInDays($checkOut);

        $service = Service::findOrFail($data['service_id']);
        $data['subtotal'] = $service->price_per_day * $data['total_days'];
        $data['status'] = ReservationStatus::Pending->value;

        $reservation = Reservation::create($data);

        Cage::where('id', $data['cage_id'])->update(['status' => 'terisi']);

        return $reservation->load(['user', 'cat', 'service', 'cage']);
    }

    public function updateStatus(int $id, string $status): Reservation
    {
        $reservation = $this->findById($id);

        $allowed = self::ALLOWED_TRANSITIONS[$reservation->status] ?? [];
        if (!in_array($status, $allowed)) {
            abort(422, "Tidak dapat mengubah status dari '{$reservation->status}' ke '{$status}'");
        }

        $reservation->update(['status' => $status]);

        if ($status === ReservationStatus::CheckOut->value || $status === ReservationStatus::Batal->value) {
            Cage::where('id', $reservation->cage_id)->update(['status' => 'tersedia']);
        }

        return $reservation;
    }

    public function cancel(int $id): Reservation
    {
        $reservation = $this->findById($id);

        if ($reservation->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk membatalkan reservasi ini');
        }

        if ($reservation->status !== ReservationStatus::Pending->value) {
            abort(422, 'Hanya reservasi dengan status pending yang dapat dibatalkan');
        }

        $reservation->update(['status' => ReservationStatus::Batal->value]);
        Cage::where('id', $reservation->cage_id)->update(['status' => 'tersedia']);

        app(AuditService::class)->log(
            action: 'reservations.cancel',
            description: "User membatalkan reservasi {$reservation->uuid}",
        );

        return $reservation->load(['user', 'cat', 'service', 'cage']);
    }

    public function delete(int $id): void
    {
        $reservation = $this->findById($id);
        Cage::where('id', $reservation->cage_id)->update(['status' => 'tersedia']);
        $reservation->delete();
    }

    public function getUpcomingCheckIns()
    {
        return Reservation::with(['user', 'cat'])
            ->where('status', ReservationStatus::Konfirmasi->value)
            ->whereDate('check_in', '>=', today())
            ->orderBy('check_in')
            ->take(5)
            ->get();
    }
}
