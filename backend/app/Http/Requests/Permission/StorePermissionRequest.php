<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;

class StorePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|regex:/^[a-z]+\.[a-z]+$/|unique:permissions,name',
            'category_id' => 'nullable|integer|exists:permission_categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'Format permission harus module.action (contoh: users.view)',
            'name.unique' => 'Permission sudah ada',
        ];
    }
}
