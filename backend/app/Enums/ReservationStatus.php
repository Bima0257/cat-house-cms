<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'pending';
    case Konfirmasi = 'konfirmasi';
    case CheckIn = 'checkin';
    case CheckOut = 'checkout';
    case Batal = 'batal';
}
