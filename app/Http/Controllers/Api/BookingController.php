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
     *
     *
    **/
    public function index()
    {
        return BookingResource::collection($this->bookingRepository->getAll());
    }

    /**
     *
     *
     **/
    public function store(BookingRequest $request)
    {
//        $validator = Validator::make(
//            $request->all(),
//            [
//                'hotel_id' => 'required',
//                'name'     => 'required|max:255',
//                'email'    => 'required_without:phone',
//                'phone'    => 'required_without:email',
//                'date_from' => 'required|date',
//                'date_to'  => 'required|date|after_or_equal:date_from',
//                'adult_amount'   => 'required|numeric|min:1',
//                'children_amount' => 'required|numeric',
//                'room_amount'    => 'required|numeric|min:1',
//            ]
//        );
//
//        if ($validator->fails()) {
//            return response()->json([
//                'message' => $validator->messages(),
//                'status'    => 400
//            ], 400);
//        }
        $hotel = $this->hotelRepository->findById($request->hotel_id);
        if (empty($hotel)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
            ]);
        }

        $data = $request->all();

        $customer = $this->customerRepository->findByFieldName('full_name', $data['customer']['full_name']);
        $customer = $customer ? $this->customerRepository->update($customer->id,$data['customer']) : $this->customerRepository->create($data['customer']);

        $booking = [];
        $booking['hotel_id'] = $data['hotel_id'];
        $booking['customer_id'] = $customer->id;
        $booking['code'] = $data['code'].$customer->id.$data['hotel_id'];
        $booking['arrival_date'] = $data['arrival_date'];
        $booking['departure_date'] = $data['departure_date'];
        $booking['adults'] = $data['adults'];
        $booking['children'] = $data['children'];
        $booking['rooms'] = $data['rooms'];
        $booking['note'] = $data['note'];
        $booking['is_business'] = $data['is_business'];

        $bookingCreated = $this->bookingRepository->create($booking);

        $dataEmail['hotel_name'] = $hotel->name;
        $dataEmail['hotel_address'] = $hotel->address;
        $dataEmail['hotel_phone'] = $hotel->phone;
        $dataEmail['hotel_email'] = $hotel->email;
        $mailTo = $this->configRepository->getMailTo();
        dispatch(new SendEmailJob($mailTo, $dataEmail));

        if (empty($bookingCreated)) return $this->getResponseValidate(false,trans('message.txt_created_failure', ['attribute' => trans('message.booking')]));

        return $this->getResponse(true, trans('message.txt_created_successfully', ['attribute' => trans('message.booking')]), new BookingResource($bookingCreated));
    }
}
