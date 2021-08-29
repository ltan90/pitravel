<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\File;
use Illuminate\Support\Arr;

class FileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = File::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'url'  => 'images/hotels/factories/image_' . random_int(1, 20) . '.jpg',
            'mime' => 'image/jpeg',
            'extension' => 'jpg',
            'fileable_id'     => random_int(1, 20),
            'fileable_type'   => Hotel::class,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
