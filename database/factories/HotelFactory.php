<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Hotel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'price_min' => rand(100000, 10000000),
            'location_id' => random_int(1, 63),
            'lat' => rand(9, 25),
            'lng' => rand(105, 110),
            'address' => $this->faker->address(),
            'reviews' => random_int(1, 5),
            'description' => $this->faker->text(),
            'is_approved' => true,
            'creator_id' => config('constants.ROLE.ROOT'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
