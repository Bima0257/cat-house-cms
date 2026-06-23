<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $data = $this->authService->login($request->validated());

        if (isset($data['needs_verification'])) {
            return response()->json([
                'message' => 'Email belum diverifikasi. Kode verifikasi telah dikirim ke email Anda.',
                'data' => [
                    'email' => $data['email'],
                    'verification_expires_at' => $data['verification_expires_at'],
                ],
            ], 403);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'data' => $data,
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'Register berhasil, cek email untuk kode verifikasi 📩',
            'data' => [
                'email' => $result['user']->email,
                'verification_expires_at' => $result['verification_expires_at'],
            ],
        ]);
    }

    public function resendCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $result = $this->authService->resendCode($request->email);

        return response()->json([
            'message' => 'Kode baru telah dikirim 📩',
            'data' => [
                'verification_expires_at' => $result['verification_expires_at'],
            ],
        ]);
    }

    public function verifyCode(VerifyCodeRequest $request)
    {
        $this->authService->verifyCode($request->validated());

        return response()->json([
            'message' => 'Email berhasil diverifikasi ✅',
        ]);
    }

    public function logout()
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    public function me()
    {
        $data = $this->authService->me();

        return response()->json([
            'data' => $data,
        ]);
    }
}
