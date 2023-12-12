import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const dietCategoryService = {
    getAll,
    getByGoal,
    createDietCategory,
    addPlans,
    updateDietCategory,
    deleteDietCategory,
}

function getAll() {
    return axios({
        method: apiPath.dietCategory.getAll.method,
        url: apiPath.dietCategory.getAll.url
    })
}
function getByGoal(id) {
    return axios({
        method: apiPath.dietCategory.getByGoal(id).method,
        url: apiPath.dietCategory.getByGoal(id).url
    })
}
function createDietCategory(item) {
    return axios({
        method: apiPath.dietCategory.create.method,
        url: apiPath.dietCategory.create.url,
        data: item
    })
}
function addPlans(item) {
    return axios({
        method: apiPath.addPlans.create.method,
        url: apiPath.addPlans.create.url,
        data: item
    })
}
function updateDietCategory(item) {
    return axios({
        method: apiPath.dietCategory.update.method,
        url: apiPath.dietCategory.update.url,
        data: item
    })
}
function deleteDietCategory(item) {
    return axios({
        method: apiPath.dietCategory.delete(item.id).method,
        url: apiPath.dietCategory.delete(item.id).url,
    })
}