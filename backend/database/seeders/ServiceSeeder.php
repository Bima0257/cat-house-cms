<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Basic Care', 'description' => 'Penitipan standar dengan makanan dan minuman reguler', 'price_per_day' => 50000],
            ['name' => 'Premium Care', 'description' => 'Penitipan dengan makanan premium dan suplemen', 'price_per_day' => 85000],
            ['name' => 'VIP Care', 'description' => 'Penitipan eksklusif dengan kandang VIP, makanan premium, dan perawatan khusus', 'price_per_day' => 150000],
            ['name' => 'Grooming', 'description' => 'Perawatan bulu dan kuku', 'price_per_day' => 75000],
            ['name' => 'Health Check', 'description' => 'Pemeriksaan kesehatan harian oleh dokter hewan', 'price_per_day' => 100000],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
