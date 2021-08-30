<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Repositories\ServiceRepository;
use App\Repositories\FileRepository;
use App\Traits\BaseResponse;
use App\Traits\ImageSizeTrait;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use BaseResponse, ImageSizeTrait;
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

    public function show(int $id)
    {
        $service = $this->serviceRepository->findById($id);

        if (empty($service)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.service')]), null, 404);

        return $this->getResponse(true, null, new ServiceResource($service));
    }

    public function store(ServiceRequest $request)
    {
        $data = $request->all();

        $service = $this->serviceRepository->create($data);
        if (empty($service)) return $this->getResponse(
            false, trans('message.txt_created_failure', ['attribute' => trans('message.service')]), null, 400
        );

        if ($request->hasFile('icon')) {
            $files = $this->saveImageSize($request->icon, config('settings.public.services'), $service->id);

            $this->fileRepository->create(
                [
                    'name'   => $service->name,
                    'url'    => $files['url'],
                    'fileable_id' => $service->id,
                    'fileable_type'  => Service::class,
                    'mime'      => $files['mime'],
                    'extension' => $files['extension']
                ]
            );
        }

        return $this->getResponse(
            true, trans('message.txt_created_successfully', ['attribute' => trans('message.service')]), new ServiceResource($service)
        );
    }

    public function update(ServiceRequest $request, int $id)
    {
        $service = $this->serviceRepository->findById($id);
        if (empty($service)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.service')]), null, 404);

        $data = $request->all();
        $service = $this->serviceRepository->update($id, $data);
        if (!$service) return $this->getResponseValidate(false, trans('message.txt_updated_failure', ['attribute' => trans('message.service')]));

        if ($request->hasFile('icon')) {

            $files = $this->saveImageSize($request->icon, config('settings.public.services'), $service->id);

            $this->fileRepository->updateOrCreate($service->id,
                [
                    'name'   => $service->name,
                    'url'    => $files['url'],
                    'fileable_id' => $service->id,
                    'fileable_type'  => Service::class,
                    'mime'      => $files['mime'],
                    'extension' => $files['extension']
                ]
            );
        }

        return $this->getResponse(true, trans('message.txt_updated_successfully', ['attribute' => trans('message.service')]), new ServiceResource($service));
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
            $service = $this->serviceRepository->findById($id);
            if (empty($service)) return $this->getResponse(
                false, trans('message.txt_not_found', ['attribute' => trans('message.service')]), null, 404
            );
            $service->file->delete($id);

            $this->serviceRepository->delete($id);
        }
        return $this->getResponse(true, trans('message.txt_deleted_successfully', ['attribute' => trans('message.service')]), null);

    }
}
