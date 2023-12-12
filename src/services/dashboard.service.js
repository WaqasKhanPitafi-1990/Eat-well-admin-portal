import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const dashboardService = {
    getAll,
    getFilteredRecord
}

function getAll() {
    return axios({
        method: apiPath.dashboard.getAll.method,
        url: apiPath.dashboard.getAll.url
    })
}
function getFilteredRecord(filters) {
    return axios({
        method: apiPath.dashboard.getFiltered.method,
        url: apiPath.dashboard.getFiltered.url,
        data: filters
    })
}