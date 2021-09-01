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
            'full_name' => 'required',
            'phone' => 'required|min:10|max:15',
            'email' => 'required|regex:/\S+@\S+\.\S+/',
            'arrival_date' => 'required|date',
            'departure_date'  => 'required|date|after_or_equal:arrival_date',
            'adults'   => 'required|numeric|min:1',
            'children' => 'required|numeric',
            'rooms'    => 'required|numeric|min:1',
        ];
    }
    /**
     * Prepare parameters from Form Request
     * @return array
     */
    public function parameters()
    {
        return [
            'booking' => [
                'hotel_id' => $this->input('hotel_id'),
                'code' => $this->input('code'),
                'arrival_date' => $this->input('arrival_date'),
                'departure_date' => $this->input('departure_date'),
                'adults' => $this->input('adults'),
                'children' => $this->input('children'),
                'rooms' => $this->input('rooms'),
                'note' => $this->input('note'),
                'is_business' => $this->input('is_business'),
            ],
            'customer' => [
                'full_name' => $this->input('full_name'),
                'phone' => $this->input('phone'),
                'email' => $this->input('email'),
            ],
        ];
    }
}
