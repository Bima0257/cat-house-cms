<?php

namespace App\Services;

use App\Models\DailyReport;
use App\Traits\ImageUpload;

class DailyReportService
{
    use ImageUpload;

    public function getAll(array $filters = [])
    {
        return DailyReport::query()
            ->when(isset($filters['reservation_id']), fn ($q) => $q->where('reservation_id', $filters['reservation_id']))
            ->when(isset($filters['report_date']), fn ($q) => $q->whereDate('report_date', $filters['report_date']))
            ->with('reservation.user', 'reservation.cat')
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findByReservation(int $reservationId)
    {
        return DailyReport::with('reservation')
            ->where('reservation_id', $reservationId)
            ->orderBy('report_date')
            ->get();
    }

    public function create(array $data): DailyReport
    {
        if (isset($data['photo'])) {
            $data['photo'] = $this->uploadImage($data['photo'], 'daily-reports');
        }

        return DailyReport::create($data);
    }

    public function update(int $id, array $data): DailyReport
    {
        $report = DailyReport::findOrFail($id);

        if (isset($data['photo'])) {
            $this->deleteImage($report->photo);
            $data['photo'] = $this->uploadImage($data['photo'], 'daily-reports');
        }

        $report->update($data);

        return $report;
    }
}
