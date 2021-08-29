<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        if (App::environment('local')) {
            DB::table('users')->insert([
                [
                    'username' => 'root',
                    'email'    => 'root@gmail.com',
                    'email_verified_at' => now(),
                    'password' => bcrypt('password'), // password
                    'remember_token' => Str::random(10),
                    'is_approved' => 1,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ],
            ]);
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
