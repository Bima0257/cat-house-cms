<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\Auditable;
use App\Traits\ImageUpload;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens;

    use HasFactory, HasRoles, Notifiable;
    use ImageUpload, Auditable;

    protected $guard_name = 'web';

    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'password',
        'avatar',
        'is_active',
        'email_verified_at',
        'verification_code',
        'verification_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_code',
        'verification_expires_at',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'verification_expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function cats(): HasMany
    {
        return $this->hasMany(Cat::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
