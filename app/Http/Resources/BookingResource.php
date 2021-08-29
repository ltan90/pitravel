<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            'hotel_name' => $this->hotel->name,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date_from' => Carbon::parse($this->date_from)->format(config('settings.format.date')),
            'date_to' => Carbon::parse($this->date_to)->format(config('settings.format.date')),
            'adult_amount' => $this->adult_amount,
            'children_amount' => $this->children_amount,
            'room_amount' => $this->room_amount,
            'note' => $this->note,
            'is_business' => $this->is_business,
            'created_at' => Carbon::parse($this->created_at)->format(config('settings.format.datetime')),
            'updated_at' => Carbon::parse($this->updated_at)->format(config('settings.format.datetime')),
        ];
    }
}
