<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelCollection;
use App\Http\Resources\HotelResource;
use App\Repositories\HotelRepository;
use App\Repositories\LocationRepository;
use App\Repositories\FileRepository;
use App\Repositories\HotelServiceRepository;
use App\Repositories\RoomRepository;
use App\Repositories\PostRepository;
use App\Traits\DistanceTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Facade\FlareClient\Http\Response;
use Illuminate\Support\Str;

class HotelController extends Controller
{
    use DistanceTrait;
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

        if (empty($hotel)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
            ]);
        };

        //$objType = config('constants.IMAGE_TYPE.HOTEL');
//        $hotel['images'] = $this->fileRepository->showFile($id, $objType);
//        $hotel['services'] = $this->hotelServiceRepository->showHotelService($id);
//        $hotel['posts'] = $this->postRepository->getPostByHotelId($id);
//        $hotel['rooms'] = $this->roomRepository->getRoomByHotelId($id)->toArray();
//        $location = $this->locationRepository->findById($hotel->location_id);
//        if (empty($location)) {
//            return $hotel['distance'] = null;
//        }
//        $hotel['distance'] = $this->getDistance($hotel->lat, $hotel->long, $location->lat, $location->long, config('constants.DISTANCE_UNIT.KILOMETERS'));
        return response()->json([
            'data' => new HotelResource($hotel)
        ], 200);
    }

    public function store(Request $request)
    {
        $limitSize = config('constants.IMAGE_TYPE.LIMIT_SIZE');
        $validator = Validator::make(
            $request->all(),
            [
                'location_id' => 'required|integer',
                'name'     => 'required|string',
                'email'    => 'email',
                'phone'    => 'regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'evaluation' => 'integer',
                'image'    => 'array',
                'image.*'  => 'mimes:jpeg,jpg,png|max:' . $limitSize,
                'service_ids' => 'array',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->messages(), 400);
        }
        $location = $this->locationRepository->find($request->location_id);
        if (empty($location)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.location')])
            ]);
        }
        $input = $request->all();
        $hotelCreated = $this->hotelRepository->create($input);
        if (empty($hotelCreated)) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_created_failure', ['attribute' => trans('message.hotel')])
            ]);
        }

        if ($request->post_name && $request->post_content) {
            $postInput['name'] = $request->input('post_name');
            $postInput['content'] = $request->input('post_content');
            $postInput['hotel_id'] = $hotelCreated->id;
            $postInput['type'] = config('constants.POST_TYPE.HOTEL');
            $postCreated = $this->postRepository->create($postInput);
            if (empty($postCreated)) {
                return response()->json([
                    'status'  => 400,
                    'message' => trans('message.txt_created_failure', ['attribute' => trans('message.post')])
                ]);
            }
        }

        $locationId = $request->location_id;
        $pathStr = 'images/hotels/' . $locationId . '/';

        if (is_array($request->file('image'))) {
            foreach ($request->file('image') as $file) {
                $fileExt = $file->getClientOriginalExtension();
                $fileMine = $file->getMimeType();
                $name = $hotelCreated->id . '_' . Str::random(8) . '.' . $fileExt;
                $file->move($pathStr, $name);
                $path = $pathStr . $name;
                $this->fileRepository->create(
                    [
                        'name'   => $name,
                        'url'    => $path,
                        'obj_id' => $hotelCreated->id,
                        'obj_type'  => config('constants.IMAGE_TYPE.HOTEL'),
                        'mime'      => $fileMine,
                        'extension' => $fileExt
                    ]
                );
            }
        }

        if (is_array($request->service_ids)) {
            foreach ($request->service_ids as $id) {
                $input = [
                    'hotel_id' => $hotelCreated->id,
                    'service_id' => $id
                ];
                $hotelServicesCreated = $this->hotelServiceRepository->create($input);
                if (empty($hotelServicesCreated)) {
                    return $this->responseError(trans('message.txt_created_failure', ['attribute' => trans('message.hotel_service')]));
                }
            }
        }
        return response()->json([
            'status' => 200,
            'data'    => $hotelCreated,
            'message' => trans('message.txt_created_successfully', ['attribute' => trans('message.hotel')])
        ]);
    }

    public function update(Request $request, $id)
    {
        $limitSize = config('constants.IMAGE_TYPE.LIMIT_SIZE');
        $validator = Validator::make(
            $request->all(),
            [
                'location_id' => 'required|integer',
                'name'     => 'required',
                'email'    => 'email',
                'phone'    => 'regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'evaluation' => 'integer',
                'remove_ids' => 'array',
                'remove_ids.*' => 'integer',
                'image'     => 'array',
                'image.*'   => 'mimes:jpeg,jpg,png|max:' . $limitSize,
                'service_ids' => 'array',
            ]
        );
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $location = $this->locationRepository->find($request->location_id);
        if (empty($location)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.location')])
            ]);
        }
        $hotel = $this->hotelRepository->find($id);
        if (empty($hotel)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
            ]);
        }
        $input = $request->all();
        $hotelUpdated = $this->hotelRepository->update($id, $input);
        if (!$hotelUpdated) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_updated_failure', ['attribute' => trans('message.hotel')])
            ]);
        }

        $post = $this->postRepository->getPostByHotelId($id);
        $postName = $request->input('post_name') ?? '';
        $postContent = $request->input('post_content') ?? '';
        if ($post == null) {
            $postInput['name'] = $postName;
            $postInput['content'] = $postContent;
            $postInput['hotel_id'] = $hotelUpdated->id;
            $postInput['type'] = config('constants.POST_TYPE.HOTEL');
            $postCreated = $this->postRepository->create($postInput);
            if (empty($postCreated)) {
                return response()->json([
                    'status'  => 400,
                    'message' => trans('message.txt_created_failure', ['attribute' => trans('message.post')])
                ]);
            }
        } else {
            $post = $this->postRepository->getPostByHotelId($id);
            if (empty($post)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.post')])
                ]);
            }
            $postInput['name'] = $postName;
            $postInput['content'] = $postContent;
            $postUpdated = $this->postRepository->update($post->id, $postInput);
            if (!$postUpdated) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_updated_failure', ['attribute' => trans('message.post')])
                ]);
            }
        }

        if (is_array($request->remove_ids)) {
            foreach ($request->remove_ids as $fileId) {
                $file = $this->fileRepository->find($fileId);
                if (empty($file)) {
                    return response()->json([
                        'status' => 404,
                        'message' => trans('message.txt_not_found', ['attribute' => trans('message.image')])
                    ]);
                }
                $path = $file->url;
                if (file_exists($path)) {
                    @unlink($path);
                }
                $fileDeleted = $this->fileRepository->delete($fileId);
                if (!$fileDeleted) {
                    return response()->json([
                        'status' => 400,
                        'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.image')])
                    ]);
                }
            }
        }

        if (is_array($request->file('image'))) {
            $locationId = $request->location_id;
            $pathStr = 'images/hotels/' . $locationId . '/';
            foreach ($request->file('image') as $file) {
                $fileExt = $file->getClientOriginalExtension();
                $fileMine = $file->getMimeType();
                $name = $hotel->id . '_' . Str::random(8) . '.' . $fileExt;
                $file->move($pathStr, $name);
                $path = $pathStr . $name;
                $this->fileRepository->create(
                    [
                        'name'   => $name,
                        'url'    => $path,
                        'obj_id' => $hotel->id,
                        'obj_type'  => config('constants.IMAGE_TYPE.HOTEL'),
                        'mime'      => $fileMine,
                        'extension' => $fileExt
                    ]
                );
            }
        }

        $hotelServices = $this->hotelServiceRepository->getServiceIdByHotelId($id)->toArray();
        $oldHotelIds = array_column($hotelServices, 'service_id');
        $newHotelIds = $request->service_ids ?? [];
        $additionalIds = array_diff($newHotelIds, $oldHotelIds);
        foreach ($additionalIds as $key => $value) {
            $input = [
                'hotel_id' => $id,
                'service_id' => $value
            ];
            $hotelServicesCreated = $this->hotelServiceRepository->create($input);
            if (empty($hotelServicesCreated)) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_created_failure', ['attribute' => trans('message.hotel_service')])
                ]);
            }
        }

        $deleteIds = array_diff($oldHotelIds, $newHotelIds);
        foreach ($deleteIds as $key => $value) {
            $input = [
                'hotel_id' => $id,
                'service_id' => $value
            ];
            $hotelService = $this->hotelServiceRepository->findByHotelAndService($id, $value);
            if (empty($hotelService)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel_service')])
                ]);
            }
            $hotelServicesDeleted = $this->hotelServiceRepository->delete($hotelService->id);
            if (!$hotelServicesDeleted) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.hotel_service')])
                ]);
            }
        }
        // $hotelServices = $this->hotelServiceRepository->getServiceIdByHotelId($id)->toArray();
        // $hotelIds = array_column($hotelServices, 'service_id');

        return response()->json([
            'status' => 200,
            'data' => $hotelUpdated,
            'message' => trans('message.txt_updated_successfully', ['attribute' => trans('message.hotel')])
        ]);
    }

    public function delete(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'ids' => 'required|array',
                'ids.*' => 'required|integer'
            ]
        );
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 'error'
            ], 400);
        }
        foreach ($request->ids as $id) {
            $hotel = $this->hotelRepository->findById($id);
            if (empty($hotel)) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
                ], 404);
            }
            $hotelDeleted = $this->hotelRepository->delete($id);
            if (!$hotelDeleted) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.hotel')])
                ], 400);
            }
        }

        return response()->json([
            'status' => 'ok',
            'message' => trans('message.txt_deleted_successfully', ['attribute' => trans('message.hotel')])
        ], 200);
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
