<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Repositories\LocationRepository;

class LocationController extends Controller
{
    protected $locationRepository;

    public function __construct(LocationRepository $locationRepository)
    {
        $this->locationRepository = $locationRepository;
    }
    public function index()
    {
        return LocationResource::collection($this->locationRepository->getLocationsByOrder());
    }

    public function showLocationHasHotel()
    {
        return LocationResource::collection($this->locationRepository->getLocationHasHotel());
    }
}
