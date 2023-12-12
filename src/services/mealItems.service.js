import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const mealItemsService = {
    getAll,
    createMealItems,
    updateMealItems,
    deleteMealItems,
}

function getAll() {
    return axios({
        method: apiPath.mealItems.getAll.method,
        url: apiPath.mealItems.getAll.url
    })
}
function createMealItems(item) {
    return axios({
        method: apiPath.mealItems.create.method,
        url: apiPath.mealItems.create.url,
        data: item
    })
}
function updateMealItems(item) {
    return axios({
        method: apiPath.mealItems.update.method,
        url: apiPath.mealItems.update.url,
        data: item
    })
}
function deleteMealItems(item) {
    return axios({
        method: apiPath.mealItems.delete(item.id).method,
        url: apiPath.mealItems.delete(item.id).url,
    })
}