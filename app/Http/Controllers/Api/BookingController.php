<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Repositories\BookingRepository;
use App\Repositories\HotelRepository;
use App\Repositories\ConfigRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Jobs\SendEmailJob;

class BookingController extends Controller
{
    protected $hotelRepository;
    protected $bookingRepository;
    protected $configRepository;

    public function __construct(
        HotelRepository $hotelRepository,
        BookingRepository $bookingRepository,
        ConfigRepository $configRepository
    ) {
        $this->hotelRepository = $hotelRepository;
        $this->bookingRepository = $bookingRepository;
        $this->configRepository = $configRepository;
    }

    /**
     *
     *
    **/
    public function index(Request $request)
    {
        return BookingResource::collection($this->bookingRepository->getAll());
    }

    /**
     *
     *
     **/
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'hotel_id' => 'required',
                'name'     => 'required|max:255',
                'email'    => 'required_without:phone',
                'phone'    => 'required_without:email',
                'date_from' => 'required|date',
                'date_to'  => 'required|date|after_or_equal:date_from',
                'adult_amount'   => 'required|numeric|min:1',
                'children_amount' => 'required|numeric',
                'room_amount'    => 'required|numeric|min:1',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $hotel = $this->hotelRepository->find($request->hotel_id);
        if (empty($hotel)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
            ]);
        }
        $mailTo = $this->configRepository->getMailTo();
        $input = $request->all();
        $bookingCreated = $this->bookingRepository->create($input);
        $input['hotel_name'] = $hotel->name;
        $input['hotel_address'] = $hotel->address;
        $input['hotel_phone'] = $hotel->phone;
        $input['hotel_email'] = $hotel->email;
        dispatch(new SendEmailJob($mailTo, $input));
        if (empty($bookingCreated)) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_created_failure', ['attribute' => trans('message.booking')])
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => $bookingCreated,
            'message' => trans('message.txt_created_successfully', ['attribute' => trans('message.booking')])
        ]);
    }
}
