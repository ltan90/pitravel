<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\MessageBag;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('guest')->except('logout');
    }

    public function login(Request $request)
    {
        $input = $request->all();

        $this->validate($request, [
            'username' => 'required',
            'password' => 'required',
        ]);
        $errors = new MessageBag();
        $fieldType = filter_var($request->username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        if (!Auth::attempt(array($fieldType => $input['username'], 'password' => $input['password']))) {
            $errors->add('username', 'Invalid user. Please try again!');

            return response()->json([
                'status' => 400,
                'error_message' => 'Invalid user. Please try again'
            ]);
        }
        $token = Auth::user()->createToken('API Token')->accessToken;

        return response()->json([
            'status' => 200,
            'user' => Auth::user(),
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $token = Auth::user()->token();
        $token->revoke();
        $response = [
            'status' => 200,
            'message' => 'Successfully logout'
        ];
        return response()->json($response)->header('Content-Type', 'application/json');
    }
}
