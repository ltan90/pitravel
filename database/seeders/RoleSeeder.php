<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('roles')->truncate();
        DB::table('roles')->insert([
            [
                'id' => 1,
                'label' => 'Root công ty',
                'name' => config('constants.ROLE_NAME.ROOT'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'id' => 2,
                'label' => 'Admin công ty',
                'name' => config('constants.ROLE_NAME.ADMIN'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'id' => 3,
                'label' => 'Member công ty',
                'name' => config('constants.ROLE_NAME.USER'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);
        $roleRoot = User::findOrFail(1);
        $roleRoot->roles()->sync([1]);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
