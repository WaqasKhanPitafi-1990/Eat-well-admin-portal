import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const userAddressService = {
    getAll,
    createUserAddress,
    updateUserAddress,
    deleteUserAddress,
}

function getAll() {
    return axios({
        method: apiPath.userAddress.getAll.method,
        url: apiPath.userAddress.getAll.url
    })
}
function createUserAddress(item) {
    return axios({
        method: apiPath.userAddress.create.method,
        url: apiPath.userAddress.create.url,
        data: item
    })
}
function updateUserAddress(item) {
    return axios({
        method: apiPath.userAddress.update.method,
        url: apiPath.userAddress.update.url,
        data: item
    })
}
function deleteUserAddress(item) {
    return axios({
        method: apiPath.userAddress.delete(item.id).method,
        url: apiPath.userAddress.delete(item.id).url,
    })
}