<?php

namespace App\Http\Controllers\API\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Services\PaymentService;
use App\Traits\ApiResponse;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected PaymentService $paymentService
    ) {}

    public function index()
    {
        $payments = $this->paymentService->getAll(request()->all());

        return $this->paginated($payments);
    }

    public function show(int $id)
    {
        $payment = $this->paymentService->findById($id);

        return $this->success($payment);
    }

    public function store(StorePaymentRequest $request)
    {
        $payment = $this->paymentService->create($request->validated());

        return $this->success($payment, 'Payment created successfully', 201);
    }

    public function verify(int $id)
    {
        $payment = $this->paymentService->verify($id);

        return $this->success($payment, 'Payment verified successfully');
    }

    public function reject(int $id)
    {
        $payment = $this->paymentService->reject($id);

        return $this->success($payment, 'Payment rejected');
    }
}
