<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            LocationSeeder::class,
            HotelSeeder::class,
            RoomSeeder::class,
            ServiceSeeder::class,
            FileSeeder::class,
            CustomerSeeder::class,
            HotelServiceSeeder::class,
            ConfigSeeder::class,
        ]);
    }
}
