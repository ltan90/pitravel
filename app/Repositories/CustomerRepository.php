<?php

namespace App\Repositories;

use App\Models\Customer;

class CustomerRepository extends EloquentRepository
{
    public function getModel()
    {
        return Customer::class;
    }
}
