<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\HotelServiceRepository;
use App\Repositories\HotelRepository;
use App\Repositories\ServiceRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Facade\FlareClient\Http\Response;

class HotelServiceController extends Controller
{
    protected $hotelRepository;
    protected $serviceRepository;
    protected $hotelServiceRepository;

    public function __construct(

        HotelRepository $hotelRepository,
        ServiceRepository $serviceRepository,
        HotelServiceRepository $hotelServiceRepository
    )
    {
        $this->hotelRepository = $hotelRepository;
        $this->serviceRepository = $serviceRepository;
        $this->hotelServiceRepository = $hotelServiceRepository;
    }

    public function index($id)
    {
        $hotelServices = $this->hotelServiceRepository->getServiceIdByHotelId($id)->toArray();
    $hotelIds = array_column($hotelServices, 'service_id');
        return response()->json([
            'status' => 200,
            'data' => $hotelIds,
        ]);
    }
}
