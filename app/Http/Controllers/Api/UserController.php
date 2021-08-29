<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserProfile;
use App\Repositories\UserRepository;
use App\Repositories\RoleRepository;
use Illuminate\Support\Facades\Validator;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    protected $userRepository;
    protected $roleRepository;

    public function __construct(
        UserRepository $userRepository,
        RoleRepository $roleRepository
    ) {
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
    }

    /**
     * @OA\Get(
     ** path="/v1/user-login",
     *   tags={"Login"},
     *   summary="Login",
     *   operationId="login",
     *
     *   @OA\Parameter(
     *      name="email",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *           type="string"
     *      )
     *   ),
     *   @OA\Parameter(
     *      name="password",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *          type="string"
     *      )
     *   ),
     *   @OA\Response(
     *      response=200,
     *       description="Success",
     *      @OA\MediaType(
     *           mediaType="application/json",
     *      )
     *   ),
     *   @OA\Response(
     *      response=401,
     *       description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *      response=400,
     *      description="Bad Request"
     *   ),
     *   @OA\Response(
     *      response=404,
     *      description="not found"
     *   ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *)
     **/
    /**
     * List account
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $params = [
            'search' => $request->search ?? ''
        ];

        return UserResource::collection($this->userRepository->getUsers($params));
    }

    public function show($id)
    {
        $user = $this->userRepository->findById($id);
        if (! $user) return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.user')])
            ]);

        return new UserResource($user);
    }

    public function store(UserRequest $request)
    {
        $data = $request->all();

        $user = [];
        $user['username'] = $data['username'];
        $user['email'] = $data['email'];
        $user['password'] = Hash::make($data['password']);
        $user['is_approved'] = $data['is_approved'];

        $user = $this->userRepository->create($user);
        //event(new Registered($user));

        $user->profile()->save(new UserProfile($data['profile']));

        $user->roles()->attach($data['role_id']);

        if (empty($user)) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_created_failure', ['attribute' => trans('message.user')])
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => new UserResource($user),
            'message' => trans('message.txt_created_user_successfully')
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'current_password' => 'required',
                'password' => 'required|string|min:8',
                'password_confirmation' => 'required|same:password',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 400,
                'message' => ['current_password' => trans('message.txt_checkpassword_failure')],
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json([
            'status' => 200,
            'message' => trans('message.txt_changepassword_successfully'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'firstname' => 'required|max:50',
                'lastname' => 'required|max:50',
                'phone' => 'regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'role_id' => 'required|max:255',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $role = $this->roleRepository->find($request->role_id);
        if (empty($role)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.role')])
            ]);
        }
        $input = $request->except(['username']);
        $user = $this->userRepository->find($id);
        if (empty($user)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.user')])
            ]);
        }
        $UserUpdated = $this->userRepository->update($id, $input);
        if (!($UserUpdated)) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_updated_failure', ['attribute' => trans('message.user')])
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => $UserUpdated,
            'message' => trans('message.txt_updated_successfully', ['attribute' => trans('message.user')])
        ]);
    }

    public function delete(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'ids' => 'required|array',
                'ids.*' => 'required|integer'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        foreach ($request->ids as $id) {
            $user = $this->userRepository->find($id);
            if (empty($user)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.user')])
                ]);
            }
            if ($user->role_id == config('constants.ROLE.ROOT')) {
                return response()->json([
                    'status'  => 400,
                    'message' => trans('message.txt_cant_deleted', ['attribute' => trans('message.user')])
                ]);
            }
            $userDeleted = $this->userRepository->delete($id);
            if (!$userDeleted) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.user')])
                ]);
            }
        }
        return response()->json([
            'status' => 200,
            'message' => trans('message.txt_deleted_successfully', ['attribute' => trans('message.user')])
        ]);
    }
}
