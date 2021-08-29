import React, { Component } from "react";
import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class HotelRoomMiddleware extends CommonMiddleware {
    constructor(props) {
        super(props);
    }

    getRoomsByHotelId = async (id, params) => {
        let result;
        await axios
            .get(`${env.API_URL}/hotels/${id}/rooms`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
    createRoom = async (id, params) => {
        let result;
        await axios
            .post(`${env.API_URL}/hotels/${id}/rooms`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);

        return result;
    };

    updateRoom = async (id, params) => {
        let result;
        await axios
            .put(`${env.API_URL}/hotels/rooms/${id}`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };

    deleteRoom = async (params) => {
        let result;
        await axios
            .delete(
                `${env.API_URL}/hotels/rooms`,
                { data: params } /*, axiosConfigObject*/
            )
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
}

export default HotelRoomMiddleware;
