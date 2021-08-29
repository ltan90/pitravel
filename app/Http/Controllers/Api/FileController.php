<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\HotelRepository;
use App\Repositories\FileRepository;
use App\Repositories\ServiceRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Facade\FlareClient\Http\Response;
use Illuminate\Support\Str;


class FileController extends Controller
{
    protected $hotelRepository;
    protected $fileRepository;
    protected $serviceRepository;

    public function __construct(
        HotelRepository $hotelRepository,
        FileRepository $fileRepository,
        ServiceRepository $serviceRepository
    ) {
        $this->hotelRepository = $hotelRepository;
        $this->fileRepository = $fileRepository;
        $this->serviceRepository = $serviceRepository;
    }
    public function store(Request $request)
    {
        $limitSize=config('constants.IMAGE_TYPE.LIMIT_SIZE');
        $validator = Validator::make(
            $request->all(),
            [
                'id' => 'required',
                'type'     => 'required',
                'image'    => 'required|array',
                'image.*'  => 'mimes:jpeg,jpg,png|max:'.$limitSize
            ]
        );
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $pathImage = 'images/';
        switch ($request->type) {
            case config('constants.IMAGE_TYPE.HOTEL'):
                if ($request->id) {
                    $hotel = $this->hotelRepository->findById($request->id);
                    if (empty($hotel)) {
                        return response([
                            'status' => 404,
                            'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
                        ]);
                    };
                    $locationId = $hotel->location_id;
                    $pathImage = $pathImage . 'hotels/' . $locationId . '/';
                }
                break;
            case config('constants.IMAGE_TYPE.SERVICE'):
                $service = $this->serviceRepository->findById($request->id);
                if (empty($service)) {
                    return response([
                        'status' => 404,
                        'message' => trans('message.txt_not_found', ['attribute' => trans('message.service')])
                    ]);
                };
                $pathImage = $pathImage . 'services/';
                break;
        }
        foreach ($request->file('image') as $file) {
            $fileExt = $file->getClientOriginalExtension();
            $fileMine = $file->getMimeType();
            $name = $request->id.'_'.Str::random(8).'.'.$fileExt;
            $file->move($pathImage, $name);
            $path = $pathImage.$name;
            $this->fileRepository->create(
                [
                    'name' => $name,
                    'url'  => $path,
                    'obj_id' => $request->id,
                    'obj_type' => $request->type,
                    'mime' => $fileMine,
                    'extension' => $fileExt
                ]
            );
        }

        return response([
            'status' => 200,
            'message' => trans('message.txt_created_successfully', ['attribute' => trans('message.image')])
        ]);
    }
}
