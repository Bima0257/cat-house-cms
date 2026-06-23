<?php

namespace App\Enums;

enum CatCondition: string
{
    case Sehat = 'sehat';
    case Sakit = 'sakit';
    case Cedera = 'cedera';
}
