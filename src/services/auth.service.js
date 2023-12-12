import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const authService = {
    login
}


function login(email, password) {
    return axios({
        method: apiPath.login.method,
        url: apiPath.login.url,
        data: {
            "email": email,
            "password": password,
        }
    })
}