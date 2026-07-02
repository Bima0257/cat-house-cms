<?php

namespace App\Services;

use App\Models\Cat;
use App\Traits\ImageUpload;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class CatService
{
    use ImageUpload;

    public function getAll(array $filters = [])
    {
        return Cat::query()
            ->when(isset($filters['user_id']), fn ($q) => $q->where('user_id', $filters['user_id']))
            ->when(isset($filters['search']), fn ($q) => $q->where('name', 'like', "%{$filters['search']}%"))
            ->with('owner')
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): Cat
    {
        return Cat::with('owner')->findOrFail($id);
    }

    public function create(array $data): Cat
    {
        $data['uuid'] = (string) Str::uuid();

        if (isset($data['photo'])) {
            $data['photo'] = $this->uploadImage($data['photo'], 'cats');
        }

        return Cat::create($data);
    }

    public function update(int $id, array $data): Cat
    {
        $cat = $this->findById($id);

        if (!auth()->user()->can('cats.index') && $cat->user_id !== auth()->id()) {
            throw new AccessDeniedHttpException('Anda tidak memiliki akses untuk mengubah kucing ini');
        }

        if (isset($data['photo'])) {
            $this->deleteImage($cat->photo);
            $data['photo'] = $this->uploadImage($data['photo'], 'cats');
        }

        $cat->update($data);

        return $cat;
    }

    public function delete(int $id): void
    {
        $cat = $this->findById($id);

        if (!auth()->user()->can('cats.index') && $cat->user_id !== auth()->id()) {
            throw new AccessDeniedHttpException('Anda tidak memiliki akses untuk menghapus kucing ini');
        }

        $this->deleteImage($cat->photo);
        $cat->delete();
    }
}
