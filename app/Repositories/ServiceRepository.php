<?php
namespace App\Repositories;

use App\Models\Service;
use App\Repositories\EloquentRepository;

class ServiceRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Service::class;
    }

    /**
     * Get Services
     * @param array $params
     * @return mixed
     */
    public function getServices($params)
    {
//        $services = $this->_model->select('services.*', 'files.url as image_url')
//        ->leftJoin('files', function ($join) {
//            $join->on('files.fileable_id', '=', 'services.id')
//                ->where('files.fileable_type', Service::class);
//            })->toSql();
//        $services = $this->_model->leftJoin('files', function ($join) {
//            $join->on('files.fileable_id', '=', 'services.id')
//                ->where('files.fileable_type', Service::class);
//            })->toSql();
        $services = $this->_model->with('file');

        if ($params['search']) {
            $services = $services->where('name', 'LIKE', '%'.$params['search'].'%');
        }
        //$total = $services->count();
        $services = $services->latest('updated_at')->orderBy('id', 'DESC');

        $services = $params['limit'] && $params['offset'] ? $services->limit($params['limit'])->offset($params['offset'])->get() : $services->paginate(config('settings.per_pages.page_10'));

        return $services;
    }

    public function getService($serviceId)
    {
        $service = $this->_model->select('services.*', 'files.url as image_url')
        ->leftJoin('files', function ($join) {
            $join->on('files.obj_id', '=', 'services.id')
                ->where('files.obj_type', config('constants.IMAGE_TYPE.SERVICE'));
            })->where('services.id', $serviceId)->first();
            return $service;
    }
}
