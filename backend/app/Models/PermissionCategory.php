<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PermissionCategory extends Model
{
    use Auditable;

    protected $fillable = [
        'name',
        'icon_key',
    ];

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class, 'category_id');
    }
}
