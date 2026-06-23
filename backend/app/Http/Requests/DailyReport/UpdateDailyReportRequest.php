<?php

namespace App\Http\Requests\DailyReport;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDailyReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'food' => 'nullable|string|max:100',
            'drink' => 'nullable|string|max:100',
            'weight' => 'nullable|numeric|min:0|max:99.99',
            'activity' => 'nullable|string',
            'medicine' => 'nullable|string',
            'condition' => 'nullable|in:sehat,sakit,cedera',
            'note' => 'nullable|string',
            'report_date' => 'sometimes|date',
        ];
    }
}
