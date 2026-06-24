<?php

namespace App\Services;

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

        return response($output, 200, [
            'Content-Type' => 'application/sql',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Content-Length' => strlen($output),
        ]);
    }
}
