import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const mealsPerDayService = {
    getAll,
    createMealsPerDay,
    updateMealsPerDay,
    deleteMealsPerDay,
}

function getAll() {
    return axios({
        method: apiPath.mealsPerDay.getAll.method,
        url: apiPath.mealsPerDay.getAll.url
    })
}
function createMealsPerDay(item) {
    return axios({
        method: apiPath.mealsPerDay.create.method,
        url: apiPath.mealsPerDay.create.url,
        data: item
    })
}
function updateMealsPerDay(item) {
    return axios({
        method: apiPath.mealsPerDay.update.method,
        url: apiPath.mealsPerDay.update.url,
        data: item
    })
}
function deleteMealsPerDay(item) {
    return axios({
        method: apiPath.mealsPerDay.delete(item.id).method,
        url: apiPath.mealsPerDay.delete(item.id).url,
    })
}