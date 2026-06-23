<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@cathouse.id',
                'role' => 'super_admin',
            ],
            [
                'name' => 'Admin CatHouse',
                'email' => 'admin@cathouse.id',
                'role' => 'admin',
            ],
            [
                'name' => 'Staff CatHouse',
                'email' => 'staff@cathouse.id',
                'role' => 'staff',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@cathouse.id',
                'role' => 'user',
            ],
            [
                'name' => 'Siti Rahmawati',
                'email' => 'siti@cathouse.id',
                'role' => 'user',
            ],
        ];

        foreach ($users as $data) {
            $user = User::create([
                'uuid' => (string) Str::uuid(),
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => '0812' . rand(10000000, 99999999),
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $user->assignRole($data['role']);
        }
    }
}
