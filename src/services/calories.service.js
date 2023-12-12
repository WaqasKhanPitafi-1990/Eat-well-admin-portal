import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const caloriesService = {
    getAll,
    createCalories,
    updateCalories,
    deleteCalories,
}

function getAll() {
    return axios({
        method: apiPath.calories.getAll.method,
        url: apiPath.calories.getAll.url
    })
}
function createCalories(item) {
    return axios({
        method: apiPath.calories.create.method,
        url: apiPath.calories.create.url,
        data: item
    })
}
function updateCalories(item) {
    return axios({
        method: apiPath.calories.update.method,
        url: apiPath.calories.update.url,
        data: item
    })
}
function deleteCalories(item) {
    return axios({
        method: apiPath.calories.delete(item.id).method,
        url: apiPath.calories.delete(item.id).url,
    })
}