<?php

namespace App\Services;

use App\Services\AuditService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class BackupService
{
    public function download()
    {
        $filename = 'cat-house-backup-' . now()->format('Y-m-d-H-i-s') . '.sql';

        $db = config('database.connections.mysql');

        $envVars = [
            'MYSQL_PWD' => $db['password'],
        ];

        $command = [
            'mysqldump',
            '--host=' . $db['host'],
            '--port=' . $db['port'],
            '--user=' . $db['username'],
            '--single-transaction',
            '--routines',
            '--triggers',
            $db['database'],
        ];

        $process = new Process($command);
        $process->setTimeout(300);
        $process->setEnv($envVars);

        try {
            $process->mustRun();
            $output = $process->getOutput();
        } catch (ProcessFailedException) {
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

        $envVars = [
            'MYSQL_PWD' => $db['password'],
        ];

        $command = [
            'mysql',
            '--host=' . $db['host'],
            '--port=' . $db['port'],
            '--user=' . $db['username'],
            $db['database'],
        ];

        $sqlContent = Storage::get($path);

        $process = new Process($command);
        $process->setTimeout(0);
        $process->setEnv($envVars);
        $process->setInput($sqlContent);

        try {
            $process->mustRun();
        } catch (ProcessFailedException $e) {
            Storage::delete($path);
            return response()->json([
                'success' => false,
                'message' => 'Restore gagal: ' . substr($e->getProcess()->getErrorOutput(), 0, 500),
            ], 500);
        }

        Storage::delete($path);

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
