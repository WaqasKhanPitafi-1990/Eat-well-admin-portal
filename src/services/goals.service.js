import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const goalsService = {
    getAll,
    updateGoal,
    deleteGoal,
    createGoal
}

function getAll() {
    return axios({
        method: apiPath.goals.getAll.method,
        url: apiPath.goals.getAll.url
    })
}
function createGoal(item) {
    return axios({
        method: apiPath.goals.create.method,
        url: apiPath.goals.create.url,
        data: item
    })
}
function updateGoal(item) {
    return axios({
        method: apiPath.goals.update.method,
        url: apiPath.goals.update.url,
        data: item
    })
}
function deleteGoal(item) {
    return axios({
        method: apiPath.goals.delete(item.id).method,
        url: apiPath.goals.delete(item.id).url,
    })
}