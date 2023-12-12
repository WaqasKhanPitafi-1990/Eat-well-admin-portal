import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const plansService = {
    getAll,
    createPlans,
    updatePlans,
    deletePlans,
}

function getAll() {
    return axios({
        method: apiPath.plans.getAll.method,
        url: apiPath.plans.getAll.url
    })
}
function createPlans(item) {
    return axios({
        method: apiPath.plans.create.method,
        url: apiPath.plans.create.url,
        data: item
    })
}
function updatePlans(item) {
    return axios({
        method: apiPath.plans.update.method,
        url: apiPath.plans.update.url,
        data: item
    })
}
function deletePlans(item) {
    return axios({
        method: apiPath.plans.delete(item.id).method,
        url: apiPath.plans.delete(item.id).url,
    })
}