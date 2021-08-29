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

    public function showFile($id, $objType)
    {
        return $this->_model->select('*')
            ->where('obj_id', $id)
            ->where('obj_type', $objType)
            ->latest('updated_at')->get();
    }
}