<?php

namespace App\Repositories;

use App\Models\File;
use App\Repositories\EloquentRepository;

class FileRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return File::class;
    }

    public function showFile(int $id, $type)
    {
        return $this->_model->where(['fileable_id' => $id, 'fileable_type' => $type])->first();
    }
}
