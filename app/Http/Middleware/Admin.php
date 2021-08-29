<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $role = Auth::user()->roles()->first();
        if($role->id != config('constants.ROLE.ROOT') && $role->id != config('constants.ROLE.ADMIN')){
            return response()->json([
                'status'  => 400,
                'message' => trans('message.txt_permission_failure')
            ]);
        }
        return $next($request);
    }
}
