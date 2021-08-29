<?php
namespace App\Repositories;

use App\Models\User;
use App\Repositories\EloquentRepository;

class UserRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return User::class;
    }
    public function getUsers($params)
    {
        $user = $this->_model;
        if ($params['search']) {
            $user = $user->where('firstname', 'LIKE', '%'.$params['search'].'%')
                        ->orWhere('lastname', 'LIKE', '%'.$params['search'].'%')
                        ->orWhere('username', 'LIKE', '%'.$params['search'].'%');
        }
        $users = $user->latest('updated_at')->paginate(config('setting.per_pages.page_10'));

        return $users;
    }
}
