<?php

namespace App\Services;

use App\Models\Cat;
use App\Models\Payment;
use App\Models\Reservation;

class ReportService
{
    public function reservations(array $filters)
    {
        $query = Reservation::with(['user', 'cat', 'service', 'cage', 'payment'])
            ->when($filters['from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v));

        $data = $query->latest()->paginate($filters['per_page'] ?? 50);

        $summary = [
            'total' => Reservation::count(),
            'pending' => Reservation::where('status', 'pending')->count(),
            'konfirmasi' => Reservation::where('status', 'konfirmasi')->count(),
            'checkin' => Reservation::where('status', 'checkin')->count(),
            'checkout' => Reservation::where('status', 'checkout')->count(),
            'batal' => Reservation::where('status', 'batal')->count(),
        ];

        return ['summary' => $summary, 'data' => $data];
    }

    public function financial(array $filters)
    {
        $query = Payment::with(['reservation.user', 'reservation.cat', 'reservation.service'])
            ->when($filters['from'] ?? null, fn($q, $v) => $q->whereDate('paid_at', '>=', $v))
            ->when($filters['to'] ?? null, fn($q, $v) => $q->whereDate('paid_at', '<=', $v));

        $data = $query->latest()->paginate($filters['per_page'] ?? 50);

        $summary = [
            'total_pendapatan' => Payment::where('status', 'terverifikasi')->sum('amount'),
            'terverifikasi' => Payment::where('status', 'terverifikasi')->count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'gagal' => Payment::where('status', 'gagal')->count(),
            'pendapatan_bulan_ini' => Payment::where('status', 'terverifikasi')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('amount'),
        ];

        return ['summary' => $summary, 'data' => $data];
    }

    public function cats(array $filters)
    {
        $query = Cat::with(['owner', 'reservations.service'])
            ->withCount('reservations')
            ->when($filters['from'] ?? null, fn($q, $v) => $q->whereHas('reservations', fn($q) => $q->whereDate('check_in', '>=', $v)))
            ->when($filters['to'] ?? null, fn($q, $v) => $q->whereHas('reservations', fn($q) => $q->whereDate('check_in', '<=', $v)));

        $data = $query->latest()->paginate($filters['per_page'] ?? 50);

        $topBreeds = Cat::select('breed')
            ->selectRaw('COUNT(*) as total')
            ->whereNotNull('breed')
            ->groupBy('breed')
            ->orderByDesc('total')
            ->limit(5)
            ->pluck('total', 'breed');

        $summary = [
            'total_kucing' => Cat::count(),
            'sedang_dititipkan' => Cat::whereHas('reservations', fn($q) => $q->where('status', 'checkin'))->count(),
            'pernah_dititipkan' => Cat::whereHas('reservations')->count(),
            'ras_terbanyak' => $topBreeds,
        ];

        return ['summary' => $summary, 'data' => $data];
    }

    public function getAllReservations(array $filters)
    {
        return Reservation::with(['user', 'cat', 'service', 'cage', 'payment'])
            ->when($filters['from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v))
            ->latest()
            ->get();
    }

    public function getAllPayments(array $filters)
    {
        return Payment::with(['reservation.user', 'reservation.cat', 'reservation.service'])
            ->when($filters['from'] ?? null, fn($q, $v) => $q->whereDate('paid_at', '>=', $v))
            ->when($filters['to'] ?? null, fn($q, $v) => $q->whereDate('paid_at', '<=', $v))
            ->latest()
            ->get();
    }

    public function getAllCats(array $filters)
    {
        return Cat::with(['owner', 'reservations.service'])
            ->withCount('reservations')
            ->when($filters['from'] ?? null, fn($q, $v) => $q->whereHas('reservations', fn($q) => $q->whereDate('check_in', '>=', $v)))
            ->when($filters['to'] ?? null, fn($q, $v) => $q->whereHas('reservations', fn($q) => $q->whereDate('check_in', '<=', $v)))
            ->latest()
            ->get();
    }
}
