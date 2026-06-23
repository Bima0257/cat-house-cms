<?php

namespace App\Http\Controllers\API\Cat;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cat\StoreCatRequest;
use App\Http\Requests\Cat\UpdateCatRequest;
use App\Services\CatService;
use App\Traits\ApiResponse;

class CatController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected CatService $catService
    ) {}

    public function index()
    {
        $filters = request()->all();

        if (!auth()->user()->can('cats.index')) {
            $filters['user_id'] = auth()->id();
        }

        $cats = $this->catService->getAll($filters);

        return $this->paginated($cats);
    }

    public function show(int $id)
    {
        $cat = $this->catService->findById($id);

        return $this->success($cat);
    }

    public function store(StoreCatRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $cat = $this->catService->create($data);

        return $this->success($cat, 'Cat created successfully', 201);
    }

    public function update(int $id, UpdateCatRequest $request)
    {
        $cat = $this->catService->update($id, $request->validated());

        return $this->success($cat, 'Cat updated successfully');
    }

    public function destroy(int $id)
    {
        $this->catService->delete($id);

        return $this->success(null, 'Cat deleted successfully');
    }
}
