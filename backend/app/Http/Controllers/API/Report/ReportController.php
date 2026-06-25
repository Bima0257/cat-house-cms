<?php

namespace App\Http\Controllers\API\Report;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ReportService $reportService
    ) {}

    public function reservations(Request $request)
    {
        $result = $this->reportService->reservations($request->all());
        return $this->paginated($result['data'], 'Success', $result['summary']);
    }

    public function exportReservationsPdf(Request $request)
    {
        $result = $this->reportService->getAllReservations($request->all());
        $summary = $this->reportService->reservations($request->all())['summary'];

        $pdf = Pdf::loadView('reports.reservations-pdf', [
            'reservations' => $result,
            'summary' => $summary,
            'filters' => $request->only(['from', 'to', 'status']),
        ]);

        return $pdf->download('laporan-reservasi-' . now()->format('Y-m-d') . '.pdf');
    }

    public function financial(Request $request)
    {
        $result = $this->reportService->financial($request->all());
        return $this->paginated($result['data'], 'Success', $result['summary']);
    }

    public function exportFinancialPdf(Request $request)
    {
        $result = $this->reportService->getAllPayments($request->all());
        $summary = $this->reportService->financial($request->all())['summary'];

        $pdf = Pdf::loadView('reports.financial-pdf', [
            'payments' => $result,
            'summary' => $summary,
            'filters' => $request->only(['from', 'to']),
        ]);

        return $pdf->download('laporan-keuangan-' . now()->format('Y-m-d') . '.pdf');
    }

    public function cats(Request $request)
    {
        $result = $this->reportService->cats($request->all());
        return $this->paginated($result['data'], 'Success', $result['summary']);
    }

    public function exportCatsPdf(Request $request)
    {
        $result = $this->reportService->getAllCats($request->all());
        $summary = $this->reportService->cats($request->all())['summary'];

        $pdf = Pdf::loadView('reports.cats-pdf', [
            'cats' => $result,
            'summary' => $summary,
            'filters' => $request->only(['from', 'to']),
        ]);

        return $pdf->download('laporan-kucing-' . now()->format('Y-m-d') . '.pdf');
    }
}
