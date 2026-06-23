<?php

use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Cage\CageController;
use App\Http\Controllers\API\Cat\CatController;
use App\Http\Controllers\API\Permission\PermissionCategoryController;
use App\Http\Controllers\API\Permission\PermissionController;
use App\Http\Controllers\API\Permission\RolePermissionController;
use App\Http\Controllers\API\DailyReport\DailyReportController;
use App\Http\Controllers\API\Dashboard\DashboardController;
use App\Http\Controllers\API\Notification\NotificationController;
use App\Http\Controllers\API\Payment\PaymentController;
use App\Http\Controllers\API\Reservation\ReservationController;
use App\Http\Controllers\API\KategoriProduk\KategoriProdukController;
use App\Http\Controllers\API\Produk\ProdukController;
use App\Http\Controllers\API\Service\ServiceController;
use App\Http\Controllers\API\User\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/resend-code', [AuthController::class, 'resendCode']);

Route::get('/services/public', [ServiceController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-reservations', [DashboardController::class, 'recentReservations']);
    Route::get('/dashboard/revenue-chart', [DashboardController::class, 'revenueChart']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Cats (user & staff/admin)
    Route::apiResource('cats', CatController::class)->except(['edit', 'create']);

    // Reservations (user & staff/admin)
    Route::apiResource('reservations', ReservationController::class)->except(['edit', 'create']);
    Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus'])
        ->middleware('permission:reservations.update-status');

    // Payments
    Route::apiResource('payments', PaymentController::class)->except(['edit', 'create', 'update', 'destroy']);
    Route::post('/payments/{id}/verify', [PaymentController::class, 'verify'])
        ->middleware('permission:payments.verify');
    Route::post('/payments/{id}/reject', [PaymentController::class, 'reject'])
        ->middleware('permission:payments.reject');

    // Daily Reports (staff)
    Route::middleware('permission:daily-reports.index|daily-reports.view|daily-reports.create|daily-reports.update')->group(function () {
        Route::get('/daily-reports', [DailyReportController::class, 'index']);
        Route::post('/daily-reports', [DailyReportController::class, 'store']);
        Route::get('/daily-reports/{id}', [DailyReportController::class, 'show']);
        Route::put('/daily-reports/{id}', [DailyReportController::class, 'update']);
    });

    // Admin only routes
    Route::middleware('role:admin|super_admin')->group(function () {
        Route::apiResource('users', UserController::class)->except(['edit', 'create']);
        Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive'])
            ->middleware('permission:users.toggle-active');

        Route::apiResource('services', ServiceController::class)->except(['edit', 'create']);
        Route::patch('/services/{id}/toggle-active', [ServiceController::class, 'toggleActive'])
            ->middleware('permission:services.toggle-active');

        Route::apiResource('cages', CageController::class)->except(['edit', 'create']);

        Route::apiResource('kategori-produk', KategoriProdukController::class)->except(['edit', 'create']);
        Route::patch('/kategori-produk/{id}/toggle-active', [KategoriProdukController::class, 'toggleActive']);
        Route::post('/kategori-produk/reorder', [KategoriProdukController::class, 'reorder']);

        Route::apiResource('produk', ProdukController::class)->except(['edit', 'create']);
        Route::patch('/produk/{id}/toggle-active', [ProdukController::class, 'toggleActive']);

        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::post('/permissions', [PermissionController::class, 'store']);
        Route::put('/permissions/{id}', [PermissionController::class, 'update']);
        Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']);

        Route::get('/permission-categories', [PermissionCategoryController::class, 'index']);
        Route::post('/permission-categories', [PermissionCategoryController::class, 'store']);
        Route::get('/permission-categories/{id}', [PermissionCategoryController::class, 'show']);
        Route::put('/permission-categories/{id}', [PermissionCategoryController::class, 'update']);
        Route::delete('/permission-categories/{id}', [PermissionCategoryController::class, 'destroy']);
        Route::post('/permission-categories/{id}/assign', [PermissionCategoryController::class, 'assignPermission']);
        Route::delete('/permission-categories/{id}/permissions/{permissionId}', [PermissionCategoryController::class, 'removePermission']);
    });

    // Roles management (accessible by staff too for user role)
    Route::middleware('permission:roles.index|roles.view|roles.update')->group(function () {
        Route::get('/roles', [RolePermissionController::class, 'index']);
        Route::get('/roles/{role}/permissions', [RolePermissionController::class, 'show']);
        Route::put('/roles/{role}/permissions', [RolePermissionController::class, 'update']);
    });
});
