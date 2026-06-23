<?php

namespace App\Services;

use App\Models\KategoriProduk;
use App\Traits\ImageUpload;

class KategoriProdukService
{
    use ImageUpload;

    public function getAll(array $filters = [])
    {
        return KategoriProduk::query()
            ->when(isset($filters['search']), fn ($q) => $q->where('nama', 'like', "%{$filters['search']}%"))
            ->when(isset($filters['is_active']), fn ($q) => $q->where('is_active', $filters['is_active']))
            ->orderBy('sort_order')
            ->latest('sort_order')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): KategoriProduk
    {
        return KategoriProduk::findOrFail($id);
    }

    public function create(array $data): KategoriProduk
    {
        $data['sort_order'] = (KategoriProduk::max('sort_order') ?? 0) + 1;

        if (isset($data['gambar'])) {
            $data['gambar'] = $this->uploadImage($data['gambar'], 'kategori-produk');
        }

        return KategoriProduk::create($data);
    }

    public function update(int $id, array $data): KategoriProduk
    {
        $kategori = $this->findById($id);

        if (isset($data['gambar'])) {
            $this->deleteImage($kategori->gambar);
            $data['gambar'] = $this->uploadImage($data['gambar'], 'kategori-produk');
        }

        $kategori->update($data);

        return $kategori;
    }

    public function delete(int $id): void
    {
        $kategori = $this->findById($id);
        $this->deleteImage($kategori->gambar);
        $kategori->delete();
    }

    public function toggleActive(int $id): KategoriProduk
    {
        $kategori = $this->findById($id);
        $kategori->update(['is_active' => !$kategori->is_active]);

        return $kategori;
    }

    public function reorder(array $items): void
    {
        foreach ($items as $item) {
            KategoriProduk::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
    }
}
