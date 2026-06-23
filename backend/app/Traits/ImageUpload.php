<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait ImageUpload
{
    public function uploadImage(UploadedFile $file, string $path = 'images', string $disk = 'public'): string
    {
        return $file->store($path, $disk);
    }

    public function deleteImage(?string $path, string $disk = 'public'): void
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }
    }
}
