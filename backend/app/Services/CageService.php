<?php

namespace App\Services;

use App\Models\Cage;

class CageService
{
    public function getAll(array $filters = [])
    {
        return Cage::query()
            ->when(isset($filters['status']), fn ($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['category']), fn ($q) => $q->where('category', $filters['category']))
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): Cage
    {
        return Cage::findOrFail($id);
    }

    public function create(array $data): Cage
    {
        return Cage::create($data);
    }

    public function update(int $id, array $data): Cage
    {
        $cage = $this->findById($id);
        $cage->update($data);

        return $cage;
    }

    public function delete(int $id): void
    {
        $this->findById($id)->delete();
    }
}
