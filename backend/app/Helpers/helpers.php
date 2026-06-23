<?php

use Carbon\Carbon;
use Illuminate\Support\Str;

if (! function_exists('format_rupiah')) {
    function format_rupiah(int|float $amount): string
    {
        return 'Rp '.number_format($amount, 0, ',', '.');
    }
}

if (! function_exists('format_date')) {
    function format_date(string $date, string $format = 'd M Y'): string
    {
        return Carbon::parse($date)->translatedFormat($format);
    }
}

if (! function_exists('generate_uuid')) {
    function generate_uuid(): string
    {
        return (string) Str::uuid();
    }
}
