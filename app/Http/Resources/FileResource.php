<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'url' => asset(Storage::url($this->url)),
            'mime' => $this->mime,
            'extension' => $this->extension,
            'fileable_id' => $this->fileable_id,
            'fileable_type' => $this->fileable_type
        ];
    }
}
