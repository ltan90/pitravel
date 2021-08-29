<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

class ConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('configs')->truncate();
        DB::table('configs')->insert([
            [
                'entity_id' => 'pagination',
                'entity_type' => 'limit',
                'value' => '10',
                'created_by' => '1',
                'updated_by' => '1',
                'deleted_by' => '1',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'entity_id' => 'mail',
                'entity_type' => 'username',
                'value' => 'pitravel99@gmail.com',
                'created_by' => '1',
                'updated_by' => '1',
                'deleted_by' => '1',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'entity_id' => 'mail',
                'entity_type' => 'password',
                'value' => 'quy123456',
                'created_by' => '1',
                'updated_by' => '1',
                'deleted_by' => '1',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'entity_id' => 'mail',
                'entity_type' => 'mailto',
                'value' => 'pitravel99@yopmail.com',
                'created_by' => '1',
                'updated_by' => '1',
                'deleted_by' => '1',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}