<?php

namespace App\Http\Controllers\API\Backup;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
use App\Traits\ApiResponse;

class BackupController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected BackupService $backupService
    ) {}

    public function download()
    {
        return $this->backupService->download();
    }
}
