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
    public function getAll(array $filters = [])
    {
        return Reservation::query()
            ->when(isset($filters['user_id']), fn ($q) => $q->where('user_id', $filters['user_id']))
            ->when(isset($filters['status']), fn ($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['date_from']), fn ($q) => $q->whereDate('check_in', '>=', $filters['date_from']))
            ->when(isset($filters['date_to']), fn ($q) => $q->whereDate('check_out', '<=', $filters['date_to']))
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
        $reservation->update(['status' => $status]);

        if ($status === ReservationStatus::CheckOut->value) {
            Cage::where('id', $reservation->cage_id)->update(['status' => 'tersedia']);
        }

        return $reservation;
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
