<?php

namespace App\Http\Controllers\API\Cage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cage\StoreCageRequest;
use App\Http\Requests\Cage\UpdateCageRequest;
use App\Services\CageService;
use App\Traits\ApiResponse;

class CageController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected CageService $cageService
    ) {}

    public function index()
    {
        $cages = $this->cageService->getAll(request()->all());

        return $this->paginated($cages);
    }

    public function show(int $id)
    {
        $cage = $this->cageService->findById($id);

        return $this->success($cage);
    }

    public function store(StoreCageRequest $request)
    {
        $cage = $this->cageService->create($request->validated());

        return $this->success($cage, 'Cage created successfully', 201);
    }

    public function update(int $id, UpdateCageRequest $request)
    {
        $cage = $this->cageService->update($id, $request->validated());

        return $this->success($cage, 'Cage updated successfully');
    }

    public function destroy(int $id)
    {
        $this->cageService->delete($id);

        return $this->success(null, 'Cage deleted successfully');
    }
}
