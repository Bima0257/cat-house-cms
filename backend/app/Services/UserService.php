<?php

namespace App\Services;

use App\Models\User;
use App\Traits\ImageUpload;
use Illuminate\Support\Str;

class UserService
{
    use ImageUpload;

    public function getAll(array $filters = [])
    {
        return User::query()
            ->when(isset($filters['search']), fn ($q) => $q->where('name', 'like', "%{$filters['search']}%")
                ->orWhere('email', 'like', "%{$filters['search']}%"))
            ->when(isset($filters['role']), fn ($q) => $q->role($filters['role']))
            ->when(isset($filters['is_active']), fn ($q) => $q->where('is_active', $filters['is_active']))
            ->with('roles')
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findById(int $id): User
    {
        return User::with('roles')->findOrFail($id);
    }

    public function create(array $data): User
    {
        $data['uuid'] = (string) Str::uuid();
        $data['password'] = bcrypt($data['password']);

        if (isset($data['avatar'])) {
            $data['avatar'] = $this->uploadImage($data['avatar'], 'avatars');
        }

        $user = User::create($data);

        if (isset($data['role'])) {
            $user->assignRole($data['role']);
        }

        return $user->load('roles');
    }

    public function update(int $id, array $data): User
    {
        $user = $this->findById($id);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['avatar'])) {
            $this->deleteImage($user->avatar);
            $data['avatar'] = $this->uploadImage($data['avatar'], 'avatars');
        }

        $user->update($data);

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user->load('roles');
    }

    public function delete(int $id): void
    {
        $user = $this->findById($id);
        $this->deleteImage($user->avatar);
        $user->delete();
    }

    public function toggleActive(int $id): User
    {
        $user = $this->findById($id);
        $user->update(['is_active' => ! $user->is_active]);

        return $user;
    }
}
