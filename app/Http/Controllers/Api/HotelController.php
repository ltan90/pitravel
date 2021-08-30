<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HotelRequest;
use App\Http\Resources\HotelCollection;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use App\Repositories\HotelRepository;
use App\Repositories\LocationRepository;
use App\Repositories\FileRepository;
use App\Repositories\HotelServiceRepository;
use App\Repositories\RoomRepository;
use App\Repositories\PostRepository;
use App\Traits\BaseResponse;
use App\Traits\DistanceTrait;
use App\Traits\ImageSizeTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Facade\FlareClient\Http\Response;
use Illuminate\Support\Str;

class HotelController extends Controller
{
    use DistanceTrait, BaseResponse, ImageSizeTrait;
    protected $hotelRepository;
    protected $FileRepository;
    protected $hotelServiceRepository;
    protected $roomRepository;
    protected $postRepository;
    protected $locationRepository;

    public function __construct(
        HotelRepository $hotelRepository,
        LocationRepository $locationRepository,
        FileRepository $fileRepository,
        HotelServiceRepository $hotelServiceRepository,
        RoomRepository $roomRepository,
        PostRepository $postRepository
    ) {
        $this->hotelRepository = $hotelRepository;
        $this->locationRepository = $locationRepository;
        $this->fileRepository = $fileRepository;
        $this->hotelServiceRepository = $hotelServiceRepository;
        $this->roomRepository = $roomRepository;
        $this->postRepository = $postRepository;
    }

    public function index(Request $request)
    {
        $params = [
            'search' => $request->search ?? '',
            'check_activated' =>$request->check_activated ?? 0,
            'limit'  => $request->limit ?? '',
            'location' => $request->location_id ?? 0
        ];

        $data = $this->hotelRepository->showHotel($params);

        return (new HotelCollection($data['hotels']))->additional([
            'avgPriceHotels' => $data['avgPriceHotels']
        ]);
    }

    public function show(Request $request, $id)
    {
        $hotel = $request->check_activated ? $this->hotelRepository->findActivateHotel($id) : $this->hotelRepository->findById($id);

        if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

        return response()->json([
            'data' => new HotelResource($hotel)
        ], 200);
    }

    public function store(HotelRequest $request)
    {
        $data = $request->all();

        $hotelCreated = $this->hotelRepository->create($data);
        if (empty($hotelCreated)) return $this->getResponseValidate(false, trans('message.txt_created_failure', ['attribute' => trans('message.hotel')]));

        if (is_array($request->file('galleries'))) {
            foreach ($request->file('galleries') as $file) {
                $files = $this->saveImageSize($file, config('settings.public.hotels'), $hotelCreated->id);
                $this->fileRepository->create(
                    [
                        'name'   => $hotelCreated->name,
                        'url'    => $files['url'],
                        'mime'      => $files['mime'],
                        'extension' => $files['extension'],
                        'fileable_id' => $hotelCreated->id,
                        'fileable_type'  => Hotel::class,
                    ]
                );
            }
        }

        if (is_array($request->services)) {
            $hotelCreated->services()->attach($request->services);
        }
        return $this->getResponse(true, trans('message.txt_created_successfully', ['attribute' => trans('message.hotel')]), new HotelResource($hotelCreated));
    }

    public function update(HotelRequest $request, $id)
    {
        $hotel = $this->hotelRepository->findById($id);
        if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

        $data = $request->all();
        $hotelUpdated = $this->hotelRepository->update($id, $data);
        if (!$hotelUpdated) return $this->getResponseValidate(false, trans('message.txt_updated_failure', ['attribute' => trans('message.hotel')]));

        if (is_array($request->file('galleries'))) {
            foreach ($hotel->files as $file) {
                $this->deleteFile($file->url);
                $this->fileRepository->delete($file->id);
            }

            foreach ($request->file('galleries') as $file) {
                if (!empty($file)) {
                    $files = $this->saveImageSize($file, config('settings.public.hotels'), $hotelUpdated->id);

                    $this->fileRepository->create(
                        [
                            'name'   => $hotelUpdated->name,
                            'url'    => $files['url'],
                            'mime'      => $files['mime'],
                            'extension' => $files['extension'],
                            'fileable_id' => $hotelUpdated->id,
                            'fileable_type'  => Hotel::class,
                        ]
                    );
                }
            }
        }
        if (is_array($request->services)){
            $hotelUpdated->services()->detach();
            foreach ($request->services as $service) {
                if (!empty($service)) $hotelUpdated->services()->attach($service);
            }
        }

        return $this->getResponse(true, trans('message.txt_updated_successfully', ['attribute' => trans('message.hotel')]), new HotelResource($hotelUpdated));
    }

    public function delete(Request $request)
    {
        $rules = [
            'ids' => 'required|array',
            'ids.*' => 'required|integer'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) return $this->getResponseValidate(false, $validator->messages());

        foreach ($request->ids as $id) {
            $hotel = $this->hotelRepository->findById($id);
            if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

            $this->hotelRepository->delete($id);
        }

        return $this->getResponse(true, trans('message.txt_deleted_successfully', ['attribute' => trans('message.hotel')]));
    }
    public function changeStatus(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'is_activated' => 'required|boolean',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 'error'
            ], 400);
        }
        $hotel = $this->hotelRepository->find($id);
        if (empty($hotel)) {
            return response()->json([
                'status' => 'error',
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
            ], 404);
        }
        $input = $request->all();
        $statusUpdated = $this->hotelRepository->update($id, $input);
        if (!$statusUpdated) {
            return response()->json([
                'status' => 'error',
                'message' => trans('message.txt_updated_status_failure', ['attribute' => trans('message.hotel')])
            ], 400);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $statusUpdated,
            'message' => trans('message.txt_updated_status_successfully', ['attribute' => trans('message.hotel')])
        ], 200);
    }
}
