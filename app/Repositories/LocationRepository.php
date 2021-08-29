<?php

namespace App\Repositories;

use App\Models\Hotel;
use App\Models\Location;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\Auth;

class LocationRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Location::class;
    }

    /**
     * get location has hotel
     * @return mixed
     */
    public function getLocationHasHotel()
    {
//        $locations = $this->_model->select('locations.id', 'locations.name', 'locations.lat',  'locations.lng' )
//        ->join('hotels', function ($join) {
//            $join->on('locations.id', '=', 'hotels.location_id')
//            ->where('hotels.is_approved', 0);
//        })->groupBy('locations.id') ->orderBy('locations.name', 'ASC')->get();

        $locations = $this->_model->whereHas('hotel', function ($query) {
            $query->where('is_approved', 1);
        })->orderBy('name', 'ASC')->get();

        return $locations;
    }

    /**
     * get locations By Order
     * @return mixed
     */
    public function getLocationsByOrder() {
        return $this->_model->orderBy('name', 'ASC')->get();
    }
}
