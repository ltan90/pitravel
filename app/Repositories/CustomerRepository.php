<?php

namespace App\Repositories;

use App\Models\Customer;

class CustomerRepository extends EloquentRepository
{
    /**
     * Get Model
    */
    public function getModel()
    {
        return Customer::class;
    }

    public function findByFieldName(string $column, string $value)
    {
        return $this->_model->where($column, 'LIKE', '%' .$value. '%' )->first();
    }
}
