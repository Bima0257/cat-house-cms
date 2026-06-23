<?php

namespace App\Services;

use App\Models\Produk;
use App\Traits\ImageUpload;

class ProdukService
{
    use ImageUpload;

    public function getAll(array $filters = [])
    {
        return Produk::query()
            ->with('kategori')
            ->when(isset($filters['search']), fn ($q) => $q->where('nama', 'like', "%{$filters['search']}%"))
            ->when(isset($filters['is_active']), fn ($q) => $q->where('is_active', $filters['is_active']))
            ->when(isset($filters['kategori_produk_id']), fn ($q) => $q->where('kategori_produk_id', $filters['kategori_produk_id']))
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): Produk
    {
        return Produk::with('kategori')->findOrFail($id);
    }

    public function create(array $data): Produk
    {
        if (isset($data['gambar'])) {
            $data['gambar'] = $this->uploadImage($data['gambar'], 'produk');
        }

        return Produk::create($data);
    }

    public function update(int $id, array $data): Produk
    {
        $produk = $this->findById($id);

        if (isset($data['gambar'])) {
            $this->deleteImage($produk->gambar);
            $data['gambar'] = $this->uploadImage($data['gambar'], 'produk');
        }

        $produk->update($data);

        return $produk;
    }

    public function delete(int $id): void
    {
        $produk = $this->findById($id);
        $this->deleteImage($produk->gambar);
        $produk->delete();
    }

    public function toggleActive(int $id): Produk
    {
        $produk = $this->findById($id);
        $produk->update(['is_active' => !$produk->is_active]);

        return $produk;
    }
}
