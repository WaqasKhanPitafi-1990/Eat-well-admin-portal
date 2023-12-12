import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const ingredientService = {
    getAll,
    createIngredient,
    updateIngredient,
    deleteIngredient,
}

function getAll() {
    return axios({
        method: apiPath.ingredient.getAll.method,
        url: apiPath.ingredient.getAll.url
    })
}
function createIngredient(item) {
    return axios({
        method: apiPath.ingredient.create.method,
        url: apiPath.ingredient.create.url,
        data: item
    })
}
function updateIngredient(item) {
    return axios({
        method: apiPath.ingredient.update.method,
        url: apiPath.ingredient.update.url,
        data: item
    })
}
function deleteIngredient(item) {
    return axios({
        method: apiPath.ingredient.delete(item.id).method,
        url: apiPath.ingredient.delete(item.id).url,
    })
}