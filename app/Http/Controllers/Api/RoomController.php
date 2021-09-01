<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use App\Repositories\HotelRepository;
use App\Repositories\RoomRepository;
use App\Traits\BaseResponse;

class RoomController extends Controller
{
    use BaseResponse;
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
        if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

        $room = $this->roomRepository->create($request->parameters());

        return $this->getResponse(true, trans('message.txt_created_successfully', ['attribute' => trans('message.room')]), new RoomResource($room));
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

        if (empty($room)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.room')]), null, 404);

        return $this->getResponse(true, trans('message.txt_created_successfully', ['attribute' => trans('message.room')]), new RoomResource($room));
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
        if (empty($hotel)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.hotel')]), null, 404);

        $room = $this->roomRepository->findRoomIdByHotelId($id, $room);
        if (empty($room)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.room')]), null, 404);

        $room = $this->roomRepository->update($room->id, $request->parameters());

        return $this->getResponse(true, trans('message.txt_updated_successfully', ['attribute' => trans('message.room')]), new RoomResource($room));
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

        if (empty($room)) return $this->getResponse(false, trans('message.txt_not_found', ['attribute' => trans('message.room')]), null, 404);

        if ($room->delete()) return $this->getResponse(true, trans('message.txt_deleted_successfully', ['attribute' => trans('message.room')]));
    }
}
