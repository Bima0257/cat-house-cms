<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cage extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'category', 'capacity', 'status',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'category' => 'string',
        'status' => 'string',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
