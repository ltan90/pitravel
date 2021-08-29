<?php

namespace App\Http\Resources;

use App\Traits\DistanceTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    use DistanceTrait;
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'price_min' => $this->price_min,
            'location_name' => $this->location->name ?? '',
            'lat' => $this->lat,
            'lng' => $this->lng,
            'reviews' => $this->reviews,
            'description' => $this->description,
            'title' => $this->title,
            'content' => $this->content,
            'is_approved' => $this->is_approved,
            'files' => $this->files,
            'rooms' => RoomResource::collection($this->rooms),
            'services' => ServiceResource::collection($this->services),
            'distance' => $this->getDistance($this->lat, $this->lng, $this->location->lat, $this->location->lng, config('constants.DISTANCE_UNIT.KILOMETERS')),
            'creator_by' => $this->creatorUser->full_name ?? '',
        ];
    }
}
