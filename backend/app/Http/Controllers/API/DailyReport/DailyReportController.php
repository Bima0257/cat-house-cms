<?php

namespace App\Http\Controllers\API\DailyReport;

use App\Http\Controllers\Controller;
use App\Http\Requests\DailyReport\StoreDailyReportRequest;
use App\Http\Requests\DailyReport\UpdateDailyReportRequest;
use App\Services\DailyReportService;
use App\Traits\ApiResponse;

class DailyReportController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DailyReportService $dailyReportService
    ) {}

    public function index()
    {
        $reports = $this->dailyReportService->getAll(request()->all());

        return $this->paginated($reports);
    }

    public function show(int $id)
    {
        $report = $this->dailyReportService->findByReservation($id);

        return $this->success($report);
    }

    public function store(StoreDailyReportRequest $request)
    {
        $report = $this->dailyReportService->create($request->validated());

        return $this->success($report, 'Daily report created successfully', 201);
    }

    public function update(int $id, UpdateDailyReportRequest $request)
    {
        $report = $this->dailyReportService->update($id, $request->validated());

        return $this->success($report, 'Daily report updated successfully');
    }

    public function getByReservation(int $id)
    {
        $reports = $this->dailyReportService->getByReservationForUser($id, auth()->id());

        return $this->success($reports);
    }
}
