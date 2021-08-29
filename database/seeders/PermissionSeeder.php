<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roleRoot = User::findOrFail(1);
        $roleRoot->roles()->sync([1]);
    }
}
