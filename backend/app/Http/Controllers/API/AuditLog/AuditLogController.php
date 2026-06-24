<?php

namespace App\Http\Controllers\API\AuditLog;

use App\Http\Controllers\Controller;
use App\Services\AuditService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuditService $auditService
    ) {}

    public function index(Request $request)
    {
        $logs = $this->auditService->getAll($request->all());
        return $this->paginated($logs);
    }

    public function actions()
    {
        return $this->success($this->auditService->getActions());
    }
}
