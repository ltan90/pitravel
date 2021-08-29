<?php

namespace App\Repositories;

use App\Models\HotelService;
use App\Repositories\EloquentRepository;

class HotelServiceRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return HotelService::class;
    }

    public function showHotelService($hotelId)
    {
        $hotelService = $this->_model->select('hotel_services.id', 'hotel_services.service_id', 'services.name', 'files.url')
            ->join('hotels', 'hotel_services.hotel_id', '=', 'hotels.id')
            ->join('services', 'hotel_services.service_id', '=', 'services.id')
            ->leftJoin('files', function ($join) {
                $join->on('files.obj_id', '=', 'services.id')
                    ->where('files.obj_type', config('constants.IMAGE_TYPE.SERVICE'));
            })
            ->where('hotel_services.hotel_id', $hotelId)
            ->latest('hotel_services.updated_at')->get();
        return $hotelService;
    }

    public function getServiceIdByHotelId($hotelId)
    {
        $hotelService = $this->_model->select('hotel_services.service_id')
            ->join('hotels', 'hotel_services.hotel_id', '=', 'hotels.id')
            ->where('hotel_services.hotel_id', $hotelId)
            ->get();
        return $hotelService;
    }

    public function findByHotelAndService($hotelId, $serviceId)
    {
        $hotelService = $this->_model->select('*')
            ->where('hotel_id', $hotelId)
            ->where('service_id', $serviceId)
            ->first();
        return $hotelService;
    }
}