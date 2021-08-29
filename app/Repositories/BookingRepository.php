<?php
namespace App\Repositories;

use App\Models\Booking;
use App\Repositories\EloquentRepository;

class BookingRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Booking::class;
    }
}