import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const addressTypesService = {
    getAll,
    createAddressTypes,
    updateAddressTypes,
    deleteAddressTypes,
}

function getAll() {
    return axios({
        method: apiPath.addressTypes.getAll.method,
        url: apiPath.addressTypes.getAll.url
    })
}
function createAddressTypes(item) {
    return axios({
        method: apiPath.addressTypes.create.method,
        url: apiPath.addressTypes.create.url,
        data: item
    })
}
function updateAddressTypes(item) {
    return axios({
        method: apiPath.addressTypes.update.method,
        url: apiPath.addressTypes.update.url,
        data: item
    })
}
function deleteAddressTypes(item) {
    return axios({
        method: apiPath.addressTypes.delete(item.id).method,
        url: apiPath.addressTypes.delete(item.id).url,
    })
}