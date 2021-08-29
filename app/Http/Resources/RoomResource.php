<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
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
            'hotel_name' => $this->hotel->name,
            'name' => $this->name,
            'bed_type' => $this->bed_type,
            'personal' => $this->personal
        ];
    }
}
