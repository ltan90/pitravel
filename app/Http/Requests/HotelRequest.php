<?php

namespace App\Http\Requests;

use App\Traits\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class HotelRequest extends FormRequest
{
    use BaseRequest;
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $limitSize = config('constants.IMAGE_TYPE.LIMIT_SIZE');

        return [
            'location_id' => 'required|integer',
            'name'     => 'required|string',
            'email'    => 'required|email|regex:/\S+@\S+\.\S+/',
            'phone'    => 'required|min:10|max:15',
            'reviews' => 'integer',
            'galleries'    => 'array',
            'galleries.*'  => 'mimes:jpeg,jpg,png|max:' . $limitSize,
            'services' => 'array',
        ];
    }

    /**
     * Prepare parameters from Form Request
     * @return array
     */
    public function parameters()
    {
        return [
            'name' => $this->input('name'),
            'email' => $this->input('email'),
            'phone' => $this->input('phone'),
            'price_min' => $this->input('price_min'),
            'lat' => $this->input('lat'),
            'lng' => $this->input('lng'),
            'address' => $this->input('address'),
            'location_id' => $this->input('location_id'),
            'reviews' => $this->input('reviews'),
            'description' => $this->input('description'),
            'title' => $this->input('title'),
            'content' => $this->input('content'),
            'is_approved' => $this->input('is_approved'),
            'services' => $this->input('services'),
            'creator_id' => $this->input('creator_id')
        ];
    }
}
