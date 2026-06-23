<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected UserService $userService
    ) {}

    public function index()
    {
        $users = $this->userService->getAll(request()->all());

        return $this->paginated($users);
    }

    public function show(int $id)
    {
        $user = $this->userService->findById($id);

        return $this->success($user);
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->userService->create($request->validated());

        return $this->success($user, 'User created successfully', 201);
    }

    public function update(int $id, UpdateUserRequest $request)
    {
        $user = $this->userService->update($id, $request->validated());

        return $this->success($user, 'User updated successfully');
    }

    public function destroy(int $id)
    {
        $this->userService->delete($id);

        return $this->success(null, 'User deleted successfully');
    }

    public function toggleActive(int $id)
    {
        $user = $this->userService->toggleActive($id);

        return $this->success($user, 'User status updated');
    }
}
