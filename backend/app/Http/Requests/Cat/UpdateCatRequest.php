<?php

namespace App\Http\Requests\Cat;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:100',
            'breed' => 'nullable|string|max:100',
            'gender' => 'nullable|in:jantan,betina',
            'age' => 'nullable|integer|min:0|max:240',
            'weight' => 'nullable|numeric|min:0|max:99.99',
            'color' => 'nullable|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'vaccination_status' => 'nullable|in:lengkap,sebagian,belum',
            'medical_note' => 'nullable|string',
        ];
    }
}
