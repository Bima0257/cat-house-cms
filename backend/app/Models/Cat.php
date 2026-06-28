<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cat extends Model
{
    use HasFactory, HasUuids, Auditable;

    public function auditableName(): string
    {
        return $this->name;
    }

    protected $fillable = [
        'uuid', 'user_id', 'name', 'breed', 'gender', 'age',
        'weight', 'color', 'photo', 'vaccination_status', 'medical_note',
    ];

    protected $casts = [
        'age' => 'integer',
        'weight' => 'decimal:2',
        'vaccination_status' => 'string',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
