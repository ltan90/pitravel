<?php

namespace App\Repositories;

use App\Models\Config;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\Auth;

class ConfigRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Config::class;
    }

    public function showConfig($params)
    {
        $configs = $this->_model;
        if ($params['entity']) {
            $configs = $configs->where('entity_id', $params['entity']);
        }
        $total = $configs->count();
        $configs = $configs->latest('updated_at')->orderBy('id', 'DESC')->limit($params['limit'])->offset($params['offset'])->get();
        return [
            'total' => $total,
            'configs' => $configs
        ];
    }

    public function getMailTo()
    {
        return $this->_model->select('value')->where('entity_type', 'mailto')->value('value');
    }
}