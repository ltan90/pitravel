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
            'hotel_name' => $this->hotel->name ?? '',
            'code' => $this->code,
            'full_name' => $this->customer->full_name ?? '',
            'email' => $this->customer->email ?? '',
            'phone' => $this->customer->phone ?? '',
            'arrival_date' => Carbon::parse($this->arrival_date)->format(config('settings.format.date')),
            'departure_date' => Carbon::parse($this->departure_date)->format(config('settings.format.date')),
            'adults' => $this->adults,
            'children' => $this->children,
            'rooms' => $this->rooms,
            'note' => $this->note,
            'is_business' => $this->is_business,
            'created_at' => Carbon::parse($this->created_at)->format(config('settings.format.datetime')),
            'updated_at' => Carbon::parse($this->updated_at)->format(config('settings.format.datetime')),
        ];
    }
}
