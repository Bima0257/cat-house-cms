<?php

namespace App\Http\Controllers\API\Backup;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

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

    public function restore(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:sql,txt|max:512000',
        ]);

        return $this->backupService->restore($request->file('file'));
    }
}
