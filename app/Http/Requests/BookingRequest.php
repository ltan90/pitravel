<?php

namespace App\Http\Requests;

use App\Traits\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
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
            'customer.full_name' => 'required',
            'customer.phone' => 'required|min:10|max:15',
            'customer.email' => 'required|regex:/\S+@\S+\.\S+/',
            'arrival_date' => 'required|date',
            'departure_date'  => 'required|date|after_or_equal:arrival_date',
            'adults'   => 'required|numeric|min:1',
            'children' => 'required|numeric',
            'rooms'    => 'required|numeric|min:1',
        ];
    }
}
