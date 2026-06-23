<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProdukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kategori_produk_id' => 'sometimes|exists:kategori_produks,id',
            'nama' => 'sometimes|string|max:100',
            'deskripsi' => 'nullable|string',
            'harga' => 'sometimes|numeric|min:0',
            'stok' => 'nullable|integer|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'boolean',
        ];
    }
}
