<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait BaseRequest
{
    /**
     * Failed Validation
     * @param \Illuminate\Contracts\Validation\Validator $validator
     * @return Illuminate\Http\Exceptions\HttpResponseException
     */
    public function failedValidation(Validator $validator)
    {
        $response = [
            'status'  => 'error',
            'errors' => $validator->errors()
        ];

        throw new HttpResponseException(response()->json($response, 200));
    }
}
