<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('locations')->truncate();
        DB::table('locations')->insert([
            [
                'name' => 'An Giang',
                'lat'  => '10.38639',
                'lng' => '105.43518',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bà Rịa',
                'lat'  => '10.49629',
                'lng' => '107.16841',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bạc Liêu',
                'lat'  => '9.29414',
                'lng' => '105.72776',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bắc Kạn',
                'lat'  => '22.14701',
                'lng' => '105.83481',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bắc Giang',
                'lat'  => '21.27307',
                'lng' =>  '106.1946',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bắc Ninh',
                'lat'  => '21.18608',
                'lng' => '106.07631',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bến Tre',
                'lat'  => '10.24147',
                'lng' => '106.37585',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bình Dương',
                'lat'  => '10.9804',
                'lng' => '106.6519',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bình Định',
                'lat'  => '13.77648',
                'lng' => '109.22367',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bình Phước',
                'lat'  => '11.64711',
                'lng' => '106.60586',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Bình Thuận',
                'lat'  => '10.92889',
                'lng' => '108.10208',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Cà Mau',
                'lat'  => '9.17682',
                'lng' => '105.15242',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Cao Bằng',
                'lat'  => '22.66568',
                'lng' => '106.25786',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Cần Thơ',
                'lat'  => '10.03711',
                'lng' => '105.78825',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Đà Nẵng',
                'lat'  => '16.06778',
                'lng' => '108.22083',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Đắk Lắk',
                'lat'  => '12.66747',
                'lng' => '108.03775',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Đắk Nông',
                'lat'  => '12.00423',
                'lng' => '107.69074',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Điện Biên',
                'lat'  => '21.38602',
                'lng' => '103.02301',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Đồng Nai',
                'lat'  => '10.94469',
                'lng' => '106.82432',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Đồng Tháp',
                'lat'  => '10.29085',
                'lng' => '105.75635',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Gia Lai',
                'lat'  => '13.98333',
                'lng' => '108',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hà Giang',
                'lat'  => '22.82333',
                'lng' => '104.98357',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hà Nam',
                'lat'  => '20.54531',
                'lng' => '105.91221',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hà Nội',
                'lat'  => '21.0245',
                'lng' => '105.84117',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hà Tĩnh',
                'lat'  => '18.34282',
                'lng' => '105.90569',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hải Dương',
                'lat'  => '20.94099',
                'lng' => '106.33302',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hải Phòng',
                'lat'  => '20.86481',
                'lng' => '106.68345',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hòa Bình',
                'lat'  => '20.81717',
                'lng' => '105.33759',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hồ Chí Minh',
                'lat'  => '10.82302',
                'lng' => '106.62965',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hậu Giang',
                'lat'  => '9.78449',
                'lng' => '105.47012',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Hưng Yên',
                'lat'  => '20.64637',
                'lng' => '106.05112',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Khánh Hòa',
                'lat'  => '12.24507',
                'lng' => '109.19432',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Kiên Giang',
                'lat'  => '10.01245',
                'lng' => '105.08091',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Kon Tum',
                'lat'  => '14.35451',
                'lng' => '108.00759',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Lai Châu',
                'lat'  => '22.39644',
                'lng' => '103.45824',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Lào Cai',
                'lat'  => '22.48556',
                'lng' => '103.97066',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Lạng Sơn',
                'lat'  => '21.85264',
                'lng' => '106.76101',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Lâm Đồng',
                'lat'  => '11.54798',
                'lng' => '107.80772',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Long An',
                'lat'  => '10.60857',
                'lng' => '106.67135',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Nam Định',
                'lat'  => '20.43389',
                'lng' => '106.17729',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Nghệ An',
                'lat'  => '18.67337',
                'lng' => '105.69232',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Ninh Bình',
                'lat'  => '20.25809',
                'lng' => '105.97965',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Ninh Thuận',
                'lat'  => '11.56432',
                'lng' => '108.98858',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Phú Thọ',
                'lat'  => '21.32274',
                'lng' => '105.40198',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Phú Yên',
                'lat'  => '13.4556',
                'lng' => '109.22348',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Quảng Bình',
                'lat'  => '17.46885',
                'lng' => '106.62226',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Quảng Nam',
                'lat'  => '15.57364',
                'lng' => '108.47403',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Quảng Ngãi',
                'lat'  => '15.12047',
                'lng' => '108.79232',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Quảng Ninh',
                'lat'  => '20.95045',
                'lng' => '107.07336',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Quảng Trị',
                'lat'  => '16.81625',
                'lng' => '107.10031',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Sóc Trăng',
                'lat'  => '9.59995',
                'lng' => '105.97193',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Sơn La',
                'lat'  => '21.3256',
                'lng' => '103.91882',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Tây Ninh',
                'lat'  => '11.31004',
                'lng' => '106.09828',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Thái Bình',
                'lat'  => '20.45',
                'lng' => '106.34002',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Thái Nguyên',
                'lat'  => '21.59422',
                'lng' => '105.84817',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Thanh Hóa',
                'lat'  => '19.8',
                'lng' => '105.76667',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Thừa Thiên - Huế',
                'lat'  => '16.4619',
                'lng' => '107.59546',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Tiền Giang',
                'lat'  => '10.36004',
                'lng' => '106.35996',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Trà Vinh',
                'lat'  => '9.94719',
                'lng' => '106.34225',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Tuyên Quang',
                'lat'  => '21.82356',
                'lng' => '105.21424',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Vĩnh Phúc',
                'lat'  => '21.30891',
                'lng' => '105.60489',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Vĩnh Long',
                'lat'  => '10.25369',
                'lng' => '105.9722',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'Yên Bái',
                'lat'  => '21.72288',
                'lng' => '104.9113',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
