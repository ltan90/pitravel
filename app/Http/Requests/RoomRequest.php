<?php

namespace App\Http\Requests;

use App\Traits\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
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
        return [
            'name' => 'required',
            'bed_type' => 'required|string',
            'personal' => 'integer|min:1'
        ];
    }

    /**
     * Prepare parameters from Form Request
     * @return array
     */
    public function parameters()
    {
        return [
            'hotel_id' => $this->input('hotel_id'),
            'name' => $this->input('name'),
            'bed_type' => $this->input('bed_type'),
            'personal' => $this->input('personal')
        ];
    }
}
