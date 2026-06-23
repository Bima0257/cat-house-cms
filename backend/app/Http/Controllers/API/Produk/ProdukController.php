<?php

namespace App\Http\Controllers\API\Produk;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produk\StoreProdukRequest;
use App\Http\Requests\Produk\UpdateProdukRequest;
use App\Services\ProdukService;
use App\Traits\ApiResponse;

class ProdukController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ProdukService $produkService
    ) {}

    public function index()
    {
        $data = $this->produkService->getAll(request()->all());

        return $this->paginated($data);
    }

    public function show(int $id)
    {
        $data = $this->produkService->findById($id);

        return $this->success($data);
    }

    public function store(StoreProdukRequest $request)
    {
        $data = $this->produkService->create($request->validated());

        return $this->success($data, 'Produk berhasil ditambahkan', 201);
    }

    public function update(int $id, UpdateProdukRequest $request)
    {
        $data = $this->produkService->update($id, $request->validated());

        return $this->success($data, 'Produk berhasil diupdate');
    }

    public function destroy(int $id)
    {
        $this->produkService->delete($id);

        return $this->success(null, 'Produk berhasil dihapus');
    }

    public function toggleActive(int $id)
    {
        $data = $this->produkService->toggleActive($id);

        return $this->success($data, 'Status produk berhasil diubah');
    }
}
