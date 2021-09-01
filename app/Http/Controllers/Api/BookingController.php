<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingRequest;
use App\Http\Resources\BookingResource;
use App\Repositories\BookingRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\HotelRepository;
use App\Repositories\ConfigRepository;
use App\Traits\BaseResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Jobs\SendEmailJob;

class BookingController extends Controller
{
    use BaseResponse;
    protected $hotelRepository;
    protected $customerRepository;
    protected $bookingRepository;
    protected $configRepository;

    public function __construct(
        HotelRepository $hotelRepository,
        CustomerRepository $customerRepository,
        BookingRepository $bookingRepository,
        ConfigRepository $configRepository
    ) {
        $this->hotelRepository = $hotelRepository;
        $this->customerRepository = $customerRepository;
        $this->bookingRepository = $bookingRepository;
        $this->configRepository = $configRepository;
    }

    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Response
    **/
    public function index()
    {
        return BookingResource::collection($this->bookingRepository->getAll());
    }

    /**
     * Store a newly created resource in storage.
     * @param \App\Http\Requests\BookingRequest $request
     * @return \App\Traits\BaseResponse
     **/
    public function store(BookingRequest $request)
    {
        $data = $request->parameters();

        $hotel = $this->hotelRepository->findById($data['booking']['hotel_id']);
        if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

        $customer = $this->customerRepository->findByFieldName('full_name', $data['customer']['full_name']);
        $customer = $customer ? $this->customerRepository->update($customer->id,$data['customer']) : $this->customerRepository->create($data['customer']);

        $data['booking']['code'] = $data['booking']['code'].$data['booking']['hotel_id'].$customer->id;
        $data['booking']['customer_id'] = $customer->id;

        $bookingCreated = $this->bookingRepository->create($data['booking']);

        $dataEmail['hotel_name'] = $hotel->name;
        $dataEmail['hotel_address'] = $hotel->address;
        $dataEmail['hotel_phone'] = $hotel->phone;
        $dataEmail['hotel_email'] = $hotel->email;
        $mailTo = $this->configRepository->getMailTo();
        dispatch(new SendEmailJob($mailTo, $dataEmail));

        if (empty($bookingCreated)) return $this->getResponse(false, trans('message.txt_created_failure', ['attribute' => trans('message.booking')]), null, 404);

        return $this->getResponse(true, trans('message.txt_created_successfully', ['attribute' => trans('message.booking')]), new BookingResource($bookingCreated));
    }
}
