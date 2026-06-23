<?php

namespace App\Services;

use App\Models\Cat;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    public function getStats(): array
    {
        $today = Carbon::today();

        $totalCats = Cat::count();
        $todayReservations = Reservation::whereDate('created_at', $today)->count();
        $activeReservations = Reservation::whereIn('status', ['pending', 'konfirmasi', 'checkin'])->count();
        $pendingPayments = Payment::where('status', 'pending')->count();
        $totalRevenue = Payment::where('status', 'terverifikasi')->sum('amount');
        $totalUsers = User::count();

        return [
            'total_cats' => $totalCats,
            'today_reservations' => $todayReservations,
            'active_reservations' => $activeReservations,
            'pending_payments' => $pendingPayments,
            'total_revenue' => $totalRevenue,
            'total_users' => $totalUsers,
        ];
    }

    public function getRecentReservations()
    {
        return Reservation::with(['user', 'cat', 'service'])
            ->latest()
            ->take(10)
            ->get();
    }

    public function getRevenueChart(int $months = 6)
    {
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $revenue = Payment::where('status', 'terverifikasi')
                ->whereYear('paid_at', $date->year)
                ->whereMonth('paid_at', $date->month)
                ->sum('amount');

            $data[] = [
                'month' => $date->translatedFormat('M Y'),
                'revenue' => $revenue,
            ];
        }

        return $data;
    }
}
