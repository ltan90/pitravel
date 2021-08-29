<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\PostRepository;
use App\Repositories\HotelRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    protected $hotelRepository;
    protected $postRepository;

    public function __construct(
        PostRepository $postRepository,
        HotelRepository $hotelRepository
    ) {
        $this->postRepository = $postRepository;
        $this->hotelRepository = $hotelRepository;
    }

    public function index(Request $request)
    {
        $params = [
            'search' => $request->search ?? '',
            'limit'  => $request->limit ?? config('constants.PAGINATION.LIMIT'),
            'offset' => $request->offset ?? config('constants.PAGINATION.OFFSET')
        ];
        return response()->json($this->postRepository->getPostNotHotel($params));
    }

    public function getPostByType(Request $request)
    {
        $hotelId = $request->hotel_id;
        $typePost = $request->type;
        if (! $hotelId) return response()->json($this->postRepository->getPostByType($typePost ?? config('constants.POST_TYPE.HOME')));
        // if (!$hotelId) {
        //     if ($typePost) {
        //         return response()->json($this->postRepository->getPostByType($typePost));
        //     } else {
        //         return response()->json($this->postRepository->getPostByType(config('constants.POST_TYPE.HOME')));
        //     }
        // }
        return response()->json($this->postRepository->getPostByHotelId($hotelId));
    }

    public function getListPost(Request $request)
    {
         $params = [
            'search' => $request->search ?? '',
            'limit'  => $request->limit ?? config('constants.PAGINATION.LIMIT'),
            'offset' => $request->offset ?? config('constants.PAGINATION.OFFSET')
        ];
        return response()->json($this->postRepository->getPostNotHotel($params));
    }

    public function show($id)
    {
        $post = $this->postRepository->find($id);
        if (empty($post)) {
            return response()->json([
                'status' => 404,
                'message' => trans('message.txt_not_found', ['attribute' => trans('message.post')])
            ]);
        };
        return response()->json($post);
    }

    public function storeOrUpdate(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make(
            $input,
            [
                'name' => 'required|max:255',
                'content' => 'required|string',
                'type' => 'required|string'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages(),
                'status'    => 400
            ], 400);
        }
        $isStore = false;
        
        if (!$request->hotel_id) {
            $postType = $this->postRepository->findByField('type', $request->type)->first();
            if (empty($postType)) {
                $isStore = true;
                //$input = $request->all();
                $post = $this->postRepository->create($input);
            } else {
                $isStore = false;
                //$input = $request->all();
                $post = $this->postRepository->update($postType->id, $input);
            }
        } else {
            $hotel = $this->hotelRepository->find($request->hotel_id);
            if (empty($hotel)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
                ]);
            }
            $postTypeHotel = $this->postRepository->getPostByHotelId($request->hotel_id);            
            if (empty($postTypeHotel)) {
                $isStore = true;
                //$input = $request->all();
                $input['type'] = config('constants.POST_TYPE.HOTEL');
                $post = $this->postRepository->create($input);
            } else {
                $isStore = false;
                //$input = $request->all();
                $post = $this->postRepository->update($postTypeHotel->id, $input);
            }
        }
        if (empty($post)) {
            $msgError = $isStore ? 'message.txt_created_failure' :  'message.txt_updated_failure';
            return response()->json([
                'status' => 400,
                'message' => trans($msgError, ['attribute' => trans('message.post')])
            ]);
        }
        $msgSuccess = $isStore ? 'message.txt_created_successfully' :  'message.txt_updated_successfully';

        return response()->json([
            'status' => 200,
            'data' => $post,
            'message' => trans($msgSuccess, ['attribute' => trans('message.post')])
        ]);
    }

    public function destroy(Request $request)
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
            $post = $this->postRepository->find($id);
            if (empty($post)) {
                return response()->json([
                    'status' => 404,
                    'message' => trans('message.txt_not_found', ['attribute' => trans('message.post')])
                ]);
            }
            $postDeleted = $this->postRepository->delete($id);
            if (!$postDeleted) {
                return response()->json([
                    'status' => 400,
                    'message' => trans('message.txt_deleted_failure', ['attribute' => trans('message.post')])
                ]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => trans('message.txt_deleted_successfully', ['attribute' => trans('message.post')])
        ]);
    }
}
