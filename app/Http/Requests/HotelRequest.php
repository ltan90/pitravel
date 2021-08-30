<?php

namespace App\Http\Requests;

use App\Traits\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

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
}
