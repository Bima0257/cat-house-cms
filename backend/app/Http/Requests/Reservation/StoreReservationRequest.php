<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cat_id' => 'required|exists:cats,id',
            'service_id' => 'required|exists:services,id',
            'cage_id' => 'required|exists:cages,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'note' => 'nullable|string',
        ];
    }
}
