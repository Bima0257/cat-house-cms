<?php

namespace App\Http\Controllers\API\Service;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Services\ServiceService;
use App\Traits\ApiResponse;

class ServiceController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ServiceService $serviceService
    ) {}

    public function index()
    {
        $services = $this->serviceService->getAll(request()->all());

        return $this->paginated($services);
    }

    public function show(int $id)
    {
        $service = $this->serviceService->findById($id);

        return $this->success($service);
    }

    public function store(StoreServiceRequest $request)
    {
        $service = $this->serviceService->create($request->validated());

        return $this->success($service, 'Service created successfully', 201);
    }

    public function update(int $id, UpdateServiceRequest $request)
    {
        $service = $this->serviceService->update($id, $request->validated());

        return $this->success($service, 'Service updated successfully');
    }

    public function destroy(int $id)
    {
        $this->serviceService->delete($id);

        return $this->success(null, 'Service deleted successfully');
    }

    public function toggleActive(int $id)
    {
        $service = $this->serviceService->toggleActive($id);

        return $this->success($service, 'Service status updated');
    }
}
