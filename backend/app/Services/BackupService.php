<?php

namespace App\Services;

use App\Services\AuditService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BackupService
{
    public function download()
    {
        $filename = 'cat-house-backup-' . now()->format('Y-m-d-H-i-s') . '.sql';

        $db = config('database.connections.mysql');

        $command = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password=%s --single-transaction --routines --triggers %s 2>&1',
            escapeshellarg($db['host']),
            escapeshellarg($db['port']),
            escapeshellarg($db['username']),
            escapeshellarg($db['password']),
            escapeshellarg($db['database'])
        );

        $output = shell_exec($command);

        if ($output === null) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan backup database. Pastikan mysqldump terinstall di server.',
            ], 500);
        }

        app(AuditService::class)->log(
            action: 'backup.download',
            description: "Mengunduh backup database ({$filename})",
        );

        return response($output, 200, [
            'Content-Type' => 'application/sql',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Content-Length' => strlen($output),
        ]);
    }

    public function restore(UploadedFile $file)
    {
        $path = $file->storeAs('temp-backups', 'restore-' . now()->timestamp . '.sql');
        $fullPath = storage_path('app/' . $path);

        $db = config('database.connections.mysql');

        $command = sprintf(
            'mysql --host=%s --port=%s --user=%s --password=%s %s < %s 2>&1',
            escapeshellarg($db['host']),
            escapeshellarg($db['port']),
            escapeshellarg($db['username']),
            escapeshellarg($db['password']),
            escapeshellarg($db['database']),
            escapeshellarg($fullPath)
        );

        set_time_limit(0);
        $output = shell_exec($command);
        Storage::delete($path);

        if ($output !== null && $output !== '') {
            return response()->json([
                'success' => false,
                'message' => 'Restore gagal: ' . substr($output, 0, 500),
            ], 500);
        }

        app(AuditService::class)->log(
            action: 'backup.restore',
            description: "Merestore database dari file: {$file->getClientOriginalName()}",
        );

        return response()->json([
            'success' => true,
            'message' => 'Database berhasil direstore',
        ]);
    }
}
