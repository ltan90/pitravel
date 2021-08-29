import React, { Component } from "react";
import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class UserMiddleware extends CommonMiddleware {
    constructor(props) {
        super(props);
    }

    getUsers = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/users`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
    createUser = async (params) => {
        let result;
        await axios
            .post(`${env.API_URL}/users`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
    updateUser = async (id, params) => {
        let result;
        await axios
            .put(`${env.API_URL}/users/${id}`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
    deleteUser = async (params) => {
        let result;
        await axios
            .delete(
                `${env.API_URL}/users`,
                { data: params } /*, axiosConfigObject*/
            )
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);
        return result;
    };
}

export default UserMiddleware;
