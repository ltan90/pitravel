import React, { Component } from "react";
import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class BedMiddleware extends CommonMiddleware {
    constructor(props) {
        super(props);
    }

    getBeds = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/beds`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
    createBed = async (params) => {
        let result;
        await axios
            .post(`${env.API_URL}/beds`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
    updateBed = async (id, params) => {
        let result;
        await axios
            .put(`${env.API_URL}/beds/${id}`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
    deleteBed = async (params) => {
        let result;
        await axios
            .delete(
                `${env.API_URL}/beds`,
                { data: params } /*, axiosConfigObject*/
            )
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
}

export default BedMiddleware;
