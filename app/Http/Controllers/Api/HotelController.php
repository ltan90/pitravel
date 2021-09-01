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
use Illuminate\Database\Eloquent\Model;
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
        $data = $request->parameters();

        $hotelCreated = $this->hotelRepository->create($data);
        if (empty($hotelCreated)) return $this->getResponse(false, trans('message.txt_created_failure', ['attribute' => trans('message.hotel')]), null, 404);

        if (is_array($request->file('galleries'))) {
            $this->createOrUpdateGalleries($request->file('galleries'), $hotelCreated);
        }

        if (is_array($data['services'])) {
            $hotelCreated->services()->attach($data['services']);
        }

        return $this->getResponse(true, trans('message.txt_created_successfully', ['attribute' => trans('message.hotel')]), new HotelResource($hotelCreated));
    }

    public function update(HotelRequest $request, $id)
    {
        $hotel = $this->hotelRepository->findById($id);
        if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

        $data = $request->parameters();
        $hotelUpdated = $this->hotelRepository->update($id, $data);
        if (!$hotelUpdated) return $this->getResponse(false, trans('message.txt_updated_failure', ['attribute' => trans('message.hotel')]), null, 404);

        if (is_array($request->file('galleries'))) {
            foreach ($hotel->files as $file) {
                $this->deleteFile($file->url);
                $this->fileRepository->delete($file->id);
            }
            $this->createOrUpdateGalleries($request->file('galleries'), $hotelUpdated, false);
        }
        if (is_array($data['services'])){
            $hotelUpdated->services()->detach();
            foreach ($data['services'] as $service) {
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

            foreach ($hotel->files as $file) {
                $this->deleteFile($file->url);
                $this->fileRepository->delete($file->id);
            }

            $this->hotelRepository->delete($id);
        }

        return $this->getResponse(true, trans('message.txt_deleted_successfully', ['attribute' => trans('message.hotel')]));
    }

    /**
     * Create Or Update Galleries
     * @param array $galleries
     * @param object $hotel
     * @param bool $type
     * @return void
     */
    public function createOrUpdateGalleries(array $galleries, object $hotel, bool $type = true)
    {
        foreach ($galleries as $file) {
            if (!empty($file)) {
                $files = $this->saveImageSize($file, config('settings.public.hotels'), $hotel->id);

                $data = [
                    'name'   => $hotel->name,
                    'url'    => $files['url'],
                    'mime'      => $files['mime'],
                    'extension' => $files['extension'],
                    'fileable_id' => $hotel->id,
                    'fileable_type'  => Hotel::class,
                ];

                if ($type) {
                    $this->fileRepository->create($data);
                } else {
                    $this->fileRepository->updateOrCreate( ['fileable_id' => $hotel->id], $data );
                }
            }
        }
    }
}
