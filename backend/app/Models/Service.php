<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'name', 'description', 'price_per_day', 'is_active',
    ];

    protected $casts = [
        'price_per_day' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
