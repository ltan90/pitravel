<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Repositories\HotelRepository;
use App\Repositories\RoomRepository;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    protected $hotelRepository;
    protected $roomRepository;

    public function __construct(RoomRepository $roomRepository, HotelRepository $hotelRepository)
    {
        $this->roomRepository = $roomRepository;
        $this->hotelRepository = $hotelRepository;
    }

    /**
     * Display a listing of the resource.
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function index(int $id)
    {
        return RoomResource::collection($this->roomRepository->getRoomsByHotelId($id));
    }

    /**
     * Store a newly created resource in storage.
     * @param int $id
     * @param  \App\Http\Requests\RoomRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoomRequest $request, int $id)
    {
        $hotel = $this->hotelRepository->findById($id);
        if (empty($hotel)) return response()->json([
            'status' => 'error',
            'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
        ], 404);

        $data = $request->all();

        $room = $this->roomRepository->create($data);

        return response()->json([
            'status' => 'ok',
            'message' => trans('message.txt_created_successfully', ['attribute' => trans('message.room')]),
            'data' => new RoomResource($room)
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $room
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id, int $room)
    {
        $room = $this->roomRepository->findRoomIdByHotelId($id, $room);

        if (empty($room)) return response()->json([
            'status' => 'error',
            'message' => trans('message.txt_not_found', ['attribute' => trans('message.room')])
        ], 404);
        return response()->json([
            'status' => 'ok',
            'message' => '',
            'data' => new RoomResource($room)
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\RoomRequest $request
     * @param  int $id
     * @param  int $room
     * @return \Illuminate\Http\Response
     */
    public function update(RoomRequest $request, int $id, int $room)
    {
        $hotel = $this->hotelRepository->findById($id);
        if (empty($hotel)) return response()->json([
            'status' => 'error',
            'message' => trans('message.txt_not_found', ['attribute' => trans('message.hotel')])
        ], 404);

        $room = $this->roomRepository->findRoomIdByHotelId($id, $room);

        if (empty($room)) return response()->json([
            'status' => 'error',
            'message' => trans('message.txt_not_found', ['attribute' => trans('message.room')])
        ], 404);

        $data = $request->all();

        $room = $this->roomRepository->update($room->id, $data);

        return response()->json([
            'status' => 'ok',
            'message' => trans('message.txt_updated_successfully', ['attribute' => trans('message.room')]),
            'data' => new RoomResource($room)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @param  int $room
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id, int $room)
    {
        $room = $this->roomRepository->findRoomIdByHotelId($id, $room);

        if (empty($room)) return response()->json([
            'status' => 'error',
            'message' => trans('message.txt_not_found', ['attribute' => trans('message.room')])
        ], 404);

        if ($room->delete()) return response()->json([
            'status' => 'ok',
            'message' => trans('message.txt_deleted_successfully', ['attribute' => trans('message.room')])
        ], 200);
    }
}
