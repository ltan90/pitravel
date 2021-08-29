<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Repositories\ServiceRepository;
use App\Repositories\FileRepository;
use Illuminate\Support\Facades\Validator;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function __construct(
        ServiceRepository $serviceRepository,
        FileRepository $fileRepository
    ) {
        $this->serviceRepository = $serviceRepository;
        $this->fileRepository = $fileRepository;
    }

    public function index(Request $request)
    {
        $params = [
            'search' => $request->search ?? '',
            'limit' => $request->limit ?? 10,
            'offset' => $request->offset ?? 0
        ];

        return ServiceResource::collection($this->serviceRepository->getServices($params));
    }

    public function show($id)
    {
        $service = $this->serviceRepository->getService($id);
        if (empty($service)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.service')])
            ]);
        };
        $objType = config('constants.IMAGE_TYPE.SERVICE');
        $service['images'] = $this->fileRepository->showFile($id, $objType);
        return response()->json($service);
    }

    public function store(Request $request)
    {
        $limitSize = config('constants.IMAGE_TYPE.LIMIT_SIZE');
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:255',
                'image'  => 'mimes:jpeg,jpg,png|max:' . $limitSize,
            ]
        );
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $input = $request->all();
        $serviceCreated = $this->serviceRepository->create($input);
        if (empty($serviceCreated)) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_created_failure', ['attribute' => trans('message.service')])
            ]);
        }
        $pathStr = 'images/services/';
        $file = $request->image;
        $fileExt = $file->getClientOriginalExtension();
        $fileMine = $file->getMimeType();
        $name = $serviceCreated->id . '_' . Str::random(8) . '.' . $fileExt;
        $file->move($pathStr, $name);
        $path = $pathStr . $name;
        $this->fileRepository->create(
            [
                'name'   => $name,
                'url'    => $path,
                'obj_id' => $serviceCreated->id,
                'obj_type'  => config('constants.IMAGE_TYPE.SERVICE'),
                'mime'      => $fileMine,
                'extension' => $fileExt
            ]
        );

        return response()->json([
            'status' => 200,
            'data' => $serviceCreated,
            'message' => trans('message.txt_created_successfully', ['attribute' => trans('message.service')])
        ]);
    }

    public function update(Request $request, $id)
    {
        $limitSize = config('constants.IMAGE_TYPE.LIMIT_SIZE');
        $validator = Validator::make(
            $request->all(),
            [
                'name'  => 'required|max:255',
                'remove_id' => 'integer',
                'image'   => 'mimes:jpeg,jpg,png|max:' . $limitSize,
            ]
        );
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $service = $this->serviceRepository->find($id);
        if (empty($service)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.service')])
            ]);
        }
        $input = $request->all();
        $serviceUpdated = $this->serviceRepository->update($id, $input);
        if (!$serviceUpdated) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_updated_failure', ['attribute' => trans('message.service')])
            ]);
        }
        if ($request->remove_id) {
            $file = $this->fileRepository->find($request->remove_id);
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
            $fileDeleted = $this->fileRepository->delete($request->remove_id);
            if (!$fileDeleted) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.image')])
                ]);
            }
        }

        if ($request->hasFile('image')) {
            $serviceFiles = $this->fileRepository->showFile($id, config('constants.IMAGE_TYPE.SERVICE'));
            if (count($serviceFiles)) {
                foreach ($serviceFiles as $key => $file) {
                    $path = $file->url;
                    if (file_exists($path)) {
                        @unlink($path);
                    }
                    $fileDeleted = $this->fileRepository->delete($file->id);
                    if (!$fileDeleted) {
                        return response()->json([
                            'status' => 400,
                            'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.image')])
                        ]);
                    }
                }
            }
            $pathStr = 'images/services/';
            $file = $request->image;
            $fileExt = $file->getClientOriginalExtension();
            $fileMine = $file->getMimeType();
            $name = $service->id . '_' . Str::random(8) . '.' . $fileExt;
            $file->move($pathStr, $name);
            $path = $pathStr . $name;
            $this->fileRepository->create(
                [
                    'name'   => $name,
                    'url'    => $path,
                    'obj_id' => $service->id,
                    'obj_type'  => config('constants.IMAGE_TYPE.SERVICE'),
                    'mime'      => $fileMine,
                    'extension' => $fileExt
                ]
            );
        }


        return response()->json([
            'status' => 200,
            'data' => $serviceUpdated,
            'message' => trans('message.txt_updated_successfully', ['attribute' => trans('message.service')])
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
                'status'    => 400
            ], 400);
        }
        foreach ($request->ids as $id) {
            $service = $this->serviceRepository->find($id);
            if (empty($service)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.service')])
                ]);
            }
            $serviceDeleted = $this->serviceRepository->delete($id);
            if (!$serviceDeleted) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.service')])
                ]);
            }
        }
        return response()->json([
            'status' => 200,
            'message' => trans('message.txt_deleted_successfully', ['attribute' => trans('message.service')])
        ]);
    }
}
