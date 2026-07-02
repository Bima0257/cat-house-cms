<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

trait ImageUpload
{
    public function uploadImage(UploadedFile $file, string $path = 'images', string $disk = 'public'): string
    {
        $this->validateImageContent($file);

        return $file->store($path, $disk);
    }

    public function deleteImage(?string $path, string $disk = 'public'): void
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }
    }

    private function validateImageContent(UploadedFile $file): void
    {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];

        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw ValidationException::withMessages([
                'file' => ['File yang diupload harus berupa gambar (JPEG, PNG, GIF, WebP).'],
            ]);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detectedMime = finfo_file($finfo, $file->getPathname());
        finfo_close($finfo);

        if (!in_array($detectedMime, $allowedMimes)) {
            throw ValidationException::withMessages([
                'file' => ['File yang diupload tidak valid.'],
            ]);
        }
    }
}
