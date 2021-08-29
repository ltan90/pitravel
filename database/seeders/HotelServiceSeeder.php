<?php

namespace Database\Seeders;

use App\Models\HotelService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class HotelServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (App::environment('local')) {
            HotelService::factory(5)->create();
        }  
    }
}
