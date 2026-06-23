<?php

namespace App\Enums;

enum VaccinationStatus: string
{
    case Lengkap = 'lengkap';
    case Sebagian = 'sebagian';
    case Belum = 'belum';
}
