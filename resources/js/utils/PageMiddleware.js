import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class PageMiddleware extends CommonMiddleware {
    constructor() {
        super();
    }
    getPage = async (id) => {
        let result;
        await axios
            .get(`${env.API_URL}/posts/${id}`)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    getHomePage = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/posts/get-list`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => (result = error));
        return result;
    };
    deletePage = async (params) => {
        let result;
        await axios
            .delete(
                `${env.API_URL}/posts`,
                { data: params } /*, axiosConfigObject*/
            )
            .then((res) => {
                result = res.data;
            })
            .catch((error) => (result = error));
        return result;
    };
    createPage = async (params) => {
        let result;
        await axios
            .post(`${env.API_URL}/posts`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => (result = error));
        return result;
    };
    updatePage = async (id, params) => {
        let result;
        await axios
            .post(`${env.API_URL}/posts/`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => (result = error));
        return result;
    };
}

export default PageMiddleware;
