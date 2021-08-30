<?php

namespace App\Traits;

use Illuminate\Http\Resources\Json\JsonResource;

trait BaseResponse
{
    /**
     * Get Response
     * @param bool $status
     * @param string $message
     * @param \Illuminate\Http\Resources\Json\JsonResource $data
     * @param int $code
     * @return \Illuminate\Http\Response
     */
    public function getResponse(bool $status, string $message = null, JsonResource $data = null, int $code = 200)
    {
        return \response()->json([
            'status' => $status ? 'ok' : 'error',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Get Response Validate
     * @param bool $status
     * @param object $message
     * @param int $code
     * @return \Illuminate\Http\Response
     */
    public function getResponseValidate(bool $status, object $message, int $code = 400)
    {
        return response()->json([
            'status' => $status ? 'ok' : 'error',
            'message' => $message
        ], $code);
    }
}
