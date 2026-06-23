<?php

namespace App\Http\Controllers\API\KategoriProduk;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategoriProduk\StoreKategoriProdukRequest;
use App\Http\Requests\KategoriProduk\UpdateKategoriProdukRequest;
use App\Services\KategoriProdukService;
use App\Traits\ApiResponse;

class KategoriProdukController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected KategoriProdukService $kategoriProdukService
    ) {}

    public function index()
    {
        $data = $this->kategoriProdukService->getAll(request()->all());

        return $this->paginated($data);
    }

    public function show(int $id)
    {
        $data = $this->kategoriProdukService->findById($id);

        return $this->success($data);
    }

    public function store(StoreKategoriProdukRequest $request)
    {
        $data = $this->kategoriProdukService->create($request->validated());

        return $this->success($data, 'Kategori produk berhasil ditambahkan', 201);
    }

    public function update(int $id, UpdateKategoriProdukRequest $request)
    {
        $data = $this->kategoriProdukService->update($id, $request->validated());

        return $this->success($data, 'Kategori produk berhasil diupdate');
    }

    public function destroy(int $id)
    {
        $this->kategoriProdukService->delete($id);

        return $this->success(null, 'Kategori produk berhasil dihapus');
    }

    public function toggleActive(int $id)
    {
        $data = $this->kategoriProdukService->toggleActive($id);

        return $this->success($data, 'Status kategori produk berhasil diubah');
    }

    public function reorder()
    {
        request()->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:kategori_produks,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        $this->kategoriProdukService->reorder(request('items'));

        return $this->success(null, 'Urutan berhasil disimpan');
    }
}
