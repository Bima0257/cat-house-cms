<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cage extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'code', 'category', 'capacity', 'price', 'status',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'price' => 'decimal:2',
        'category' => 'string',
        'status' => 'string',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
