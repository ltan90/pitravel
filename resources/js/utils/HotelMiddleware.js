import React, { Component } from "react";
import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class HotelMiddleware extends CommonMiddleware {
    constructor() {
        super();
    }

    getHotels = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/hotels`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
    getHotelById = async (id) => {
        let result;
        await axios
            .get(`${env.API_URL}/hotels/${id}`)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    createHotel = async (params) => {
        let result;
        await axios
            .post(`${env.API_URL}/hotels`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
    updateHotel = async (id, params) => {
        let result;
        await axios
            .post(`${env.API_URL}/hotels/${id}`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
    deleteHotel = async (params) => {
        let result;
        await axios
            .delete(
                `${env.API_URL}/hotels`,
                { data: params } /*, axiosConfigObject*/
            )
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error);

        return result;
    };
    getLocations = async () => {
        let result;
        await axios
            .get(`${env.API_URL}/locations`)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    getLocationsHasHotel = async () => {
        let result;
        await axios
            .get(`${env.API_URL}/hotels/locations`)
            .then((res) => {
                result = res.data.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    getPosts = async () => {
        let result;
        await axios
            .get(`${env.API_URL}/posts`)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    createBooking = async (params) => {
        let result;
        await axios
            .post(`${env.API_URL}/booking`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => {
                result = error.response.data;
            });
        return result;
    };
    getServices = async (params) => {
        let result;
        await axios.get(`${env.API_URL}/services`, { params })
            .then(res => {
                result = res.data;
            })
            .catch(error => console.log(error));
        return result;
    }
    getServiceById = async (id) => {
        let result;
        await axios
            .get(`${env.API_URL}/services/${id}`)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };
    createServices = async (params) => {
        let result;
        await axios.post(`${env.API_URL}/services`, params)
            .then(res => {
                result = res.data;
            })
            .catch(error => console.log(error));
        return result;

    }
    // getRoomsByHotelId = async (id) => {
    //     let result;
    //     await axios
    //         .post(`${env.API_URL}/services`, params)
    //         .then((res) => {
    //             result = res.data;
    //         })
    //         .catch((error) => console.log(error));

    //     return result;
    // };
    updateServices = async (id, params) => {
        let result;
        await axios
            .post(`${env.API_URL}/services/${id}`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    }
    updateServicesHotel = async (id, params) => {
        let result;
        await axios
            .put(`${env.API_URL}/hotels/${id}/services`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    }
    getPostById = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/posts?${params.param_id}=${params.hotel_id}`)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    deleteServices = async (params) => {
        let result;
        await axios
            .delete(`${env.API_URL}/services`, { data: params }/*, axiosConfigObject*/)
            .then((res) => {
                result = res.data;
            })
            .catch(error => console.log(error));

        return result;
    };
    postEditor = async (params) => {
        let result;
        await axios.post(`${env.API_URL}/posts`, params)
            .then(res => {
                result = res.data;
            })
            .catch(error => console.log(error));

        return result;
    }
    postFile = async (params) => {
        let result;
        await axios.post(`${env.API_URL}/files`, params)
            .then(res => {
                result = res.data;
            })
            .catch(error => console.log(error));

        return result;
    }
    changeStatus = async (id, params) => {
        let result;
        await axios
            .put(`${env.API_URL}/hotels/${id}/change-status`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));

        return result;
    };


}

export default HotelMiddleware
