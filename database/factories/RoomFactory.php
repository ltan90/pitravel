<?php

namespace Database\Factories;

use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class RoomFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $roomArr = [
            'Family Deluxe',
            'Superior',
            'Deluxe Double City View',
            'Deluxe Twin City View',
            'Deluxe Triple Balcony'
        ];
        $bed_type = [
            '1 giường đôi',
            '1 giường đơn',
            '1 giường đôi, 1 giường đơn',
            '2 giường đôi',
            '2 giường đơn'
        ];
        return [
            'hotel_id' => rand(1,20),
            'name' => Arr::random($roomArr),
            'bed_type' => Arr::random($bed_type),
            'personal' => rand(1,4),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ];
    }
}
