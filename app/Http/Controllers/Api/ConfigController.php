<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\ConfigRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ConfigController extends Controller
{
    protected $configRepository;

    public function __construct(
        ConfigRepository $configRepository
    ) {
        $this->configRepository = $configRepository;
    }

    public function index(Request $request)
    {
        $params = [
            'entity' => $request->entity ?? '',
            'limit' => $request->limit ?? config('constants.PAGINATION.LIMIT'),
            'offset' => $request->offset ?? config('constants.PAGINATION.OFFSET')
        ];

        $authUser = Auth::user();
        if (!empty($authUser) && $authUser->role_id != config('constants.ROLE.USER')) {
            return response()->json($this->configRepository->showConfig($params));
        }
    }

    public function show($id)
    {
        $config = $this->configRepository->find($id);
        if (empty($config)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.config')])
            ]);
        };

        return response()->json($config);
    }

    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'entity_id' => 'required',
                'entity_type'     => 'required',
                'value'    => 'required',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->messages(), 400);
        }
        $input = $request->all();
        $authUser = Auth::user();
        $input['created_by'] = $authUser->id;
        $configCreated = $this->configRepository->create($input);
        if (empty($configCreated)) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_created_failure', ['attribute' => trans('message.config')])
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => $configCreated,
            'message' => trans('message.txt_created_successfully', ['attribute' => trans('message.config')])
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'entity_id' => 'required',
                'entity_type'     => 'required',
                'value'    => 'required',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $config = $this->configRepository->find($id);
        if (empty($config)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.config')])
            ]);
        }
        $input = $request->all();
        $authUser = Auth::user();
        $input['updated_by'] = $authUser->id;
        $configUpdated = $this->configRepository->update($id, $input);
        if (!$configUpdated) {
            return response()->json([
                'status' => 400,
                'message' => trans('message.txt_updated_failure', ['attribute' => trans('message.config')])
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => $configUpdated,
            'message' => trans('message.txt_updated_successfully', ['attribute' => trans('message.config')])
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
            $config = $this->configRepository->find($id);
            if (empty($config)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.config')])
                ]);
            }
            $authUser = Auth::user();
            $input['deleted_by'] = $authUser->id;
            $this->configRepository->update($id, $input);
            $configDeleted = $this->configRepository->delete($id);
            if (!$configDeleted) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.config')])
                ]);
            }
        }
        return response()->json([
            'status' => 200,
            'message' => trans('message.txt_deleted_successfully', ['attribute' => trans('message.config')])
        ]);
    }
}
