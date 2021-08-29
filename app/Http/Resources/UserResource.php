<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {

        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'is_approved' => $this->is_approved,
            'full_name' => $this->full_name,
            'address' => $this->profile->address ?? '',
            'phone' => $this->profile->phone ?? ''
        ];
    }
}
