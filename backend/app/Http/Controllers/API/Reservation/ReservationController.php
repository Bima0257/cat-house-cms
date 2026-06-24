<?php

namespace App\Http\Controllers\API\Reservation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Services\AuditService;
use App\Services\ReservationService;
use App\Traits\ApiResponse;

class ReservationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ReservationService $reservationService
    ) {}

    public function index()
    {
        $filters = request()->all();

        if (!auth()->user()->can('reservations.index')) {
            $filters['user_id'] = auth()->id();
        }

        $reservations = $this->reservationService->getAll($filters);

        return $this->paginated($reservations);
    }

    public function show(int $id)
    {
        $reservation = $this->reservationService->findById($id);

        return $this->success($reservation);
    }

    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $reservation = $this->reservationService->create($data);

        return $this->success($reservation, 'Reservation created successfully', 201);
    }

    public function updateStatus(int $id)
    {
        $status = request()->input('status');
        $reservation = $this->reservationService->updateStatus($id, $status);

        app(AuditService::class)->log(
            action: 'reservations.update-status',
            description: "Mengubah status reservasi {$reservation->uuid} menjadi {$status}",
        );

        return $this->success($reservation, 'Reservation status updated');
    }

    public function destroy(int $id)
    {
        $this->reservationService->delete($id);

        return $this->success(null, 'Reservation deleted successfully');
    }
}
