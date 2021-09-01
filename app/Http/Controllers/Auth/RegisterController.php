<?php

namespace App\Http\Controllers\Auth;

use App\Events\RegisterEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\UserProfile;
use App\Providers\RouteServiceProvider;
use App\Models\User;

use App\Traits\BaseResponse;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers, BaseResponse;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'username' => ['required', 'max:20', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
//            'phone' => ['required'|'regex:/^([0-9\s\-\+\(\)]*)$/'|'min:10'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \App\Http\Requests\UserRequest $request
     * @return \Illuminate\Http\Response
     * Overide register
     */
    public function register(UserRequest $request)
    {
        $data = $request->parameters();

        $user = User::create($data['user']);

        $user->profile()->save(new UserProfile($data['profile']));

        event(new RegisterEvent($user, $user->profile));

        $user->roles()->attach($data['role_id']);

        return $this->getResponse(true, trans('message.txt_created_user_successfully', ['attribute' => trans('message.user')]), new UserResource($user));
    }
}
