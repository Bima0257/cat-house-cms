<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reservation_id' => 'required|exists:reservations,id',
            'payment_method' => 'required|in:transfer,tunai',
            'amount' => 'required|numeric|min:0',
            'proof' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
