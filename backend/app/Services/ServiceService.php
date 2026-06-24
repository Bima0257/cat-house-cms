<?php

namespace App\Services;

use App\Models\Service;

class ServiceService
{
    public function getAll(array $filters = [])
    {
        return Service::query()
            ->when(isset($filters['is_active']), fn ($q) => $q->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)))
            ->when(isset($filters['search']), fn ($q) => $q->where('name', 'like', "%{$filters['search']}%"))
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): Service
    {
        return Service::findOrFail($id);
    }

    public function create(array $data): Service
    {
        return Service::create($data);
    }

    public function update(int $id, array $data): Service
    {
        $service = $this->findById($id);
        $service->update($data);

        return $service;
    }

    public function delete(int $id): void
    {
        $this->findById($id)->delete();
    }

    public function toggleActive(int $id): Service
    {
        $service = $this->findById($id);
        $service->update(['is_active' => ! $service->is_active]);

        return $service;
    }
}
