import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const ordersService = {
    getAll,
}

function getAll() {
    return axios({
        method: apiPath.orders.getAll.method,
        url: apiPath.orders.getAll.url
    })
}