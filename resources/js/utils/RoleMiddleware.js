import React, { Component } from "react";
import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class RoleMiddleware extends CommonMiddleware {
    constructor(props) {
        super(props);
    }

    getRoles = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/roles`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
}

export default RoleMiddleware;
