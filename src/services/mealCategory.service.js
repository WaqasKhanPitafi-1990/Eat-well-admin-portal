import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const mealCategoryService = {
    getAll,
    createMealCategory,
    updateMealCategory,
    deleteMealCategory,
}

function getAll() {
    return axios({
        method: apiPath.mealCategory.getAll.method,
        url: apiPath.mealCategory.getAll.url
    })
}
function createMealCategory(item) {
    return axios({
        method: apiPath.mealCategory.create.method,
        url: apiPath.mealCategory.create.url,
        data: item
    })
}
function updateMealCategory(item) {
    return axios({
        method: apiPath.mealCategory.update.method,
        url: apiPath.mealCategory.update.url,
        data: item
    })
}
function deleteMealCategory(item) {
    return axios({
        method: apiPath.mealCategory.delete(item.id).method,
        url: apiPath.mealCategory.delete(item.id).url,
    })
}