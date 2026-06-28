<?php

namespace App\Http\Requests\Cage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cageId = $this->route('id');

        return [
            'code' => 'sometimes|string|max:20|unique:cages,code,'.$cageId,
            'category' => 'sometimes|in:standard,premium,vip',
            'capacity' => 'sometimes|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:tersedia,terisi,perbaikan',
        ];
    }
}
