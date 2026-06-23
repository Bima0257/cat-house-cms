<?php

namespace App\Http\Requests\Cage;

use Illuminate\Foundation\Http\FormRequest;

class StoreCageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:20|unique:cages,code',
            'category' => 'required|in:standard,premium,vip',
            'capacity' => 'required|integer|min:1',
            'status' => 'nullable|in:tersedia,terisi,perbaikan',
        ];
    }
}
