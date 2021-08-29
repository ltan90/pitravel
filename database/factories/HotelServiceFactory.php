<?php

namespace Database\Factories;

use App\Models\HotelService;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = HotelService::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'hotel_id' => random_int(1,20),
            'service_id' => random_int(1,8)
        ];
    }
}
