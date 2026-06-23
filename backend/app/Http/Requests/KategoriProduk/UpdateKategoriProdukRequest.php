<?php

namespace App\Http\Requests\KategoriProduk;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKategoriProdukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'sometimes|string|max:100',
            'deskripsi' => 'nullable|string',
            'sort_order' => 'sometimes|integer|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'boolean',
        ];
    }
}
