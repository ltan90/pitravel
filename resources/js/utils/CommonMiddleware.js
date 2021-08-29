import axios from "axios";
import { env } from "../data/constants";
import Cookies from 'js-cookie'
class CommonMiddleware {
    constructor() {
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        const authToken = Cookies.get('token');
        axios.defaults.headers.common['Authorization'] = authToken;
    };

    login = async (params) => {
        let result;
        await axios.post(`${env.API_URL}/login`, params)
            .then(res => {
                result = res.data;
            })
            .catch(error => console.log(error));
        return result;
    };

    logout = async () => {
        let result;
        await axios.post(`${env.API_URL}/logout`)
            .then(res => {
                result = res.data;
            })
            .catch((error) => {
                result = error.response.data
            });

        return result;
    };
    changePass = async (params) => {
        let result;
        await axios.put(`${env.API_URL}/users/change-password`, params)
            .then(res => {
                result = res.data;
            })
            .catch((error) => {
                result = error.response.data
            });
        return result;
    }
}

export default CommonMiddleware;