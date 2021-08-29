<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'hotel_id' => random_int(1,20),
            'customer_id' => random_int(1,10),
            'code' => '000'. rand(0,1000),
            'arrival_date' => '',
            'departure_date' => '',
            'adults' => rand(1,4),
            'children' => rand(0,2),
            'rooms' => rand(1,4),
            'is_business' => rand(0,1)
        ];
    }
}
