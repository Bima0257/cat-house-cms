<?php

namespace App\Http\Controllers\API\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function stats()
    {
        $stats = $this->dashboardService->getStats();

        return $this->success($stats);
    }

    public function recentReservations()
    {
        $reservations = $this->dashboardService->getRecentReservations();

        return $this->success($reservations);
    }

    public function revenueChart()
    {
        $data = $this->dashboardService->getRevenueChart();

        return $this->success($data);
    }
}
