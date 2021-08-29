<?php
namespace App\Repositories;

use App\Models\Role;
use App\Repositories\EloquentRepository;

class RoleRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Role::class;
    }

    public function showRole()
    {
        return $this->_model->where('name', '!=', config('constants.ROLE_NAME.ROOT'))->get();
    }
}