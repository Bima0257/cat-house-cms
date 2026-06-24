<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyReport extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'reservation_id', 'photo', 'food', 'drink', 'weight',
        'activity', 'medicine', 'condition', 'note', 'report_date',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'report_date' => 'date',
        'condition' => 'string',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
