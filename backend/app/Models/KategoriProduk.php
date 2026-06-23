<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriProduk extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama', 'deskripsi', 'sort_order', 'gambar', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class, 'kategori_produk_id');
    }
}
