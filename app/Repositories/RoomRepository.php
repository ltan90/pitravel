<?php

namespace App\Repositories;

use App\Models\Room;
use App\Repositories\EloquentRepository;

class RoomRepository extends EloquentRepository
{
    /**
     * Get Model
     * @return string
     */
    public function getModel()
    {
        return Room::class;
    }

    /**
     * Get Rooms By Hotel Id
     * @param int $hotelId
     * @return mixed
     */
    public function getRoomsByHotelId(int $hotelId)
    {
        return $this->_model->whereHas('hotel', function ($query) use ($hotelId) {
            $query->whereHotelId($hotelId);
        })->latest()->paginate(10);
    }

    /**
     * Get Room By Hotel Id
     * @param int $hotelId
     * @param int $roomId
     * @return mixed
     */
    public function findRoomIdByHotelId(int $hotelId, int $roomId)
    {
        return $this->_model->whereHas('hotel', function ($query) use ($hotelId) {
            $query->whereHotelId($hotelId);
        })->find($roomId);
    }
}
