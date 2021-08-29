<?php

namespace App\Repositories;

use App\Models\Post;
use App\Repositories\EloquentRepository;

class PostRepository extends EloquentRepository
{

    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return Post::class;
    }
    /**
     * get post by hotel
     * @return selection
     */
    public function getPostNotHotel($params)
    {
        // where('type',not home);
        return $this->_model->select('*')
            ->where('type', '!=', config('constants.POST_TYPE.HOTEL'))->orderBy('posts.id', 'DESC')->limit($params['limit'])->offset($params['offset'])->get();
    }
    /**
     * get post by hotel
     * @param integer $hotelId
     * @return selection
     */
    public function getPostByHotelId($id)
    {
        return $this->_model->select('*')
            ->where('type', config('constants.POST_TYPE.HOTEL'))
            ->where('hotel_id', $id)
            ->latest('updated_at')->first();
    }
    /**
     * get post by hotel
     * @param string $type
     * @return selection
     */
    public function getPostByType($type)
    {
        return $this->_model->select('*')
            ->where('type', $type)
            ->latest('updated_at')->first();
    }
}
