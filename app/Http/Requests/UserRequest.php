<?php

namespace App\Http\Requests;

use App\Traits\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class UserRequest extends FormRequest
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
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ];
    }

    /**
     * Prepare parameters from Form Request
     * @return array
     */
    public function parameters()
    {
        return [
            'user' => [
                'username' => $this->input('username'),
                'email' => $this->input('email'),
                'password' => Hash::make($this->input('password')),
                'is_approved' => $this->input('is_approved')
            ],
            'role_id' => $this->input('role_id'),
            'profile' => [
                'firstname' => $this->input('firstname'),
                'lastname' => $this->input('lastname'),
                'phone' => $this->input('phone'),
                'address' => $this->input('address'),
            ],
        ];
    }
}
