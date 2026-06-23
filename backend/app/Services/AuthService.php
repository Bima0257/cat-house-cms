<?php

namespace App\Services;

use App\Mail\VerifyEmailCode;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login($data)
    {
        $key = ($data['email'] ?? 'guest') . '|' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw new \Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException(
                null,
                'Terlalu banyak percobaan login. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.'
            );
        }

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            RateLimiter::hit($key, 120);
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah'],
            ]);
        }

        $roles = $user->getRoleNames();

        if ($roles->contains('user') && ! $user->email_verified_at) {
            $otp = rand(100000, 999999);
            $user->update([
                'verification_code' => $otp,
                'verification_expires_at' => now()->addMinutes(2),
            ]);

            Mail::to($user->email)->send(new VerifyEmailCode($otp));

            return [
                'needs_verification' => true,
                'email' => $user->email,
                'verification_expires_at' => $user->fresh()->verification_expires_at->toISOString(),
            ];
        }

        RateLimiter::clear($key);

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user->load('roles'),
            'roles' => $roles,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];
    }

    public function register(array $data)
    {
        $otp = rand(100000, 999999);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'verification_code' => $otp,
            'verification_expires_at' => now()->addMinutes(2),
        ]);

        $user->assignRole('user');

        Mail::to($user->email)->send(new VerifyEmailCode($otp));

        return [
            'user' => $user,
            'verification_expires_at' => $user->verification_expires_at->toISOString(),
        ];
    }

    public function logout()
    {
        $user = request()->user();
        if ($user) {
            $user->currentAccessToken()->delete();
        }
    }

    public function resendCode(string $email)
    {
        $user = User::where('email', $email)->first();

        if (! $user) {
            throw new \Exception('User tidak ditemukan');
        }

        if ($user->email_verified_at) {
            throw new \Exception('Email sudah terverifikasi');
        }

        $otp = rand(100000, 999999);

        $user->update([
            'verification_code' => $otp,
            'verification_expires_at' => now()->addMinutes(2),
        ]);

        Mail::to($user->email)->send(new VerifyEmailCode($otp));

        return [
            'verification_expires_at' => $user->fresh()->verification_expires_at->toIso8601String(),
        ];
    }

    public function verifyCode($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['User tidak ditemukan'],
            ]);
        }

        if ($user->email_verified_at) {
            throw ValidationException::withMessages([
                'email' => ['Email sudah diverifikasi'],
            ]);
        }

        if (! $user->verification_expires_at || Carbon::now()->gt($user->verification_expires_at)) {
            throw ValidationException::withMessages([
                'code' => ['Kode sudah kadaluarsa'],
            ]);
        }

        if ((string) $user->verification_code !== (string) $data['code']) {
            throw ValidationException::withMessages([
                'code' => ['Kode salah'],
            ]);
        }

        $user->update([
            'email_verified_at' => now(),
            'verification_code' => null,
            'verification_expires_at' => null,
        ]);

        return $user;
    }

    public function me()
    {
        $user = request()->user();

        return [
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];
    }
}
