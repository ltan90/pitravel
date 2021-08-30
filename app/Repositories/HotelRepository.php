<?php

namespace App\Repositories;

use App\Models\Hotel;
use App\Models\Image;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\Auth;

class HotelRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Hotel::class;
    }
    /**
     * get model
     * @param array $params
     * @return array
     */
    public function showHotel($params)
    {
        $hotels = $this->_model->with(['files', 'services', 'rooms', 'location']);
        if ($params['check_activated']) {
            $hotels = $hotels->where('is_approved', 1);
        }
        if ($params['search']) {
            $hotels = $hotels->where('hotels.name', 'LIKE', '%' . $params['search'] . '%');
        }
        if ($params['location']) {
            $hotels = $hotels->where('location_id', $params['location']);
        }

        $avgPriceHotels = $hotels->avg('price_min');

        $hotels = $hotels->latest('hotels.updated_at')->orderByDesc('hotels.id');

        $hotels = $params['limit'] ? $hotels->limit($params['limit'])->get() : $hotels->paginate(config('settings.per_pages.page_10'));

        return [
            'avgPriceHotels' => $avgPriceHotels,
            'hotels' => $hotels
        ];
    }

    public function findActivateHotel($id)
    {
        $hotels = $this->_model->select('hotels.*', 'files.url')
            ->where('hotels.id', $id)
            ->leftJoin('files', function ($join) {
                $join->on('files.obj_id', '=', 'hotels.id');
            }) ->where('is_approved', 1)->first();
        return $hotels;
    }
}
