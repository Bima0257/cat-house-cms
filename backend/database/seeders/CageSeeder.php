<?php

namespace Database\Seeders;

use App\Models\Cage;
use Illuminate\Database\Seeder;

class CageSeeder extends Seeder
{
    public function run(): void
    {
        $cages = [
            ['code' => 'STD-01', 'category' => 'standard', 'capacity' => 1, 'price' => 50000],
            ['code' => 'STD-02', 'category' => 'standard', 'capacity' => 1, 'price' => 50000],
            ['code' => 'STD-03', 'category' => 'standard', 'capacity' => 1, 'price' => 50000],
            ['code' => 'STD-04', 'category' => 'standard', 'capacity' => 1, 'price' => 50000],
            ['code' => 'STD-05', 'category' => 'standard', 'capacity' => 1, 'price' => 50000],
            ['code' => 'PRM-01', 'category' => 'premium', 'capacity' => 1, 'price' => 75000],
            ['code' => 'PRM-02', 'category' => 'premium', 'capacity' => 1, 'price' => 75000],
            ['code' => 'PRM-03', 'category' => 'premium', 'capacity' => 1, 'price' => 75000],
            ['code' => 'VIP-01', 'category' => 'vip', 'capacity' => 1, 'price' => 100000],
            ['code' => 'VIP-02', 'category' => 'vip', 'capacity' => 1, 'price' => 100000],
        ];

        foreach ($cages as $cage) {
            Cage::create($cage);
        }
    }
}
