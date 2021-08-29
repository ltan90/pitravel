import axios from "axios";
import { env } from "../data/constants";
import CommonMiddleware from "./CommonMiddleware";

class ConfigMiddleware extends CommonMiddleware {
    constructor(props) {
        super(props);
    }
    getList = async (params) => {
        let result;
        await axios
            .get(`${env.API_URL}/configs`, { params })
            .then((res) => {
                result = res.data;
            })
            .catch((error) => console.log(error));
        return result;
    };
    update = async (id, params) => {
        let result;
        await axios
            .put(`${env.API_URL}/configs/${id}`, params)
            .then((res) => {
                result = res.data;
            })
            .catch((error) => result = error.response.data);
        return result;
    };
}

export default ConfigMiddleware;
