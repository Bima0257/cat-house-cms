<?php

namespace App\Services;

use App\Mail\SendResetLink;
use App\Mail\VerifyEmailCode;
use App\Models\User;
use App\Services\AuditService;
use App\Traits\ImageUpload;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    use ImageUpload;
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
            $otp = random_int(100000, 999999);
            $user->update([
                'verification_code' => $otp,
                'verification_expires_at' => now()->addMinutes(2),
            ]);

            Mail::to($user->email)->send(new VerifyEmailCode($otp, $user->name));

            return [
                'needs_verification' => true,
                'email' => $user->email,
                'verification_expires_at' => $user->fresh()->verification_expires_at->toISOString(),
            ];
        }

        RateLimiter::clear($key);

        $token = $user->createToken('auth-token')->plainTextToken;

        app(AuditService::class)->log(
            action: 'auth.login',
            description: "User login: {$user->email}",
            userId: $user->id,
        );

        return [
            'token' => $token,
            'user' => $user->load('roles'),
            'roles' => $roles,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];
    }

    public function register(array $data)
    {
        $key = 'register:' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw new \Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException(
                null,
                'Terlalu banyak percobaan registrasi. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.'
            );
        }

        $otp = random_int(100000, 999999);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'verification_code' => $otp,
            'verification_expires_at' => now()->addMinutes(2),
        ]);

        $user->assignRole('user');

        RateLimiter::clear($key);

        Mail::to($user->email)->send(new VerifyEmailCode($otp, $user->name));

        return [
            'user' => $user,
            'verification_expires_at' => $user->verification_expires_at->toISOString(),
        ];
    }

    public function logout()
    {
        $user = request()->user();
        if ($user) {
            app(AuditService::class)->log(
                action: 'auth.logout',
                description: "User logout: {$user->email}",
            );
            $user->currentAccessToken()->delete();
        }
    }

    public function resendCode(string $email)
    {
        $key = 'resend-code:' . $email . '|' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw new \Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException(
                null,
                'Terlalu banyak permintaan kode. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.'
            );
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            throw new \Exception('Jika email terdaftar, kode verifikasi akan dikirim.');
        }

        if ($user->email_verified_at) {
            throw new \Exception('Email sudah terverifikasi');
        }

        $otp = random_int(100000, 999999);

        $user->update([
            'verification_code' => $otp,
            'verification_expires_at' => now()->addMinutes(2),
        ]);

        Mail::to($user->email)->send(new VerifyEmailCode($otp, $user->name));

        RateLimiter::clear($key);

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

    public function sendResetLink(string $email)
    {
        $key = 'forgot-password:' . $email . '|' . request()->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return ['message' => 'Terlalu banyak permintaan. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.'];
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return ['message' => 'Jika email terdaftar, tautan reset password akan dikirim.'];
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        $frontendUrl = Config::get('app.frontend_url');
        $resetLink = rtrim($frontendUrl, '/') . '/reset-password?token=' . $token . '&email=' . urlencode($email);

        Mail::to($email)->send(new SendResetLink($resetLink, $user->name));

        RateLimiter::clear($key);

        return ['message' => 'Tautan reset password telah dikirim ke email Anda.'];
    }

    public function resetPassword(array $data)
    {
        $record = DB::table('password_reset_tokens')
            ->where('email', $data['email'])
            ->first();

        if (! $record || ! Hash::check($data['token'], $record->token)) {
            throw ValidationException::withMessages([
                'token' => ['Tautan reset password tidak valid atau sudah digunakan.'],
            ]);
        }

        $expiresAt = Carbon::parse($record->created_at)->addMinutes(60);
        if (Carbon::now()->gt($expiresAt)) {
            DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
            throw ValidationException::withMessages([
                'email' => ['Tautan reset password sudah kadaluarsa. Silakan kirim ulang.'],
            ]);
        }

        $user = User::where('email', $data['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['User tidak ditemukan.'],
            ]);
        }

        $user->update([
            'password' => bcrypt($data['password']),
        ]);

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        app(AuditService::class)->log(
            action: 'auth.password-reset',
            description: "Password reset: {$user->email}",
            userId: $user->id,
        );

        return ['message' => 'Password berhasil direset. Silakan login dengan password baru Anda.'];
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

    public function updateProfile(array $data): User
    {
        $user = request()->user();

        unset($data['current_password'], $data['password_confirmation']);

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

        app(AuditService::class)->log(
            action: 'profile.update',
            description: "User mengupdate profil: {$user->email}",
        );

        return $user->fresh();
    }
}
