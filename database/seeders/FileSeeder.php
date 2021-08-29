<?php

namespace Database\Seeders;

use App\Models\File;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (App::environment('local')) {
            File::factory(20)->create();
        }      
    }
}
