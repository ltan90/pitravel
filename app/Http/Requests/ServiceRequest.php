<?php

namespace App\Http\Requests;

use App\Traits\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
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
            'name' => 'required|max:255',
            'icon'  => 'required|mimes:jpeg,jpg,png|max:' . $limitSize,
        ];
    }
}
