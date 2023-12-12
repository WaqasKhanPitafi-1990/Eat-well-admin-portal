import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const languageService = {
    getAll,
    updateLanguage,
    deleteLanguage,
    createLanguage
}

function getAll() {
    return axios({
        method: apiPath.language.getAll.method,
        url: apiPath.language.getAll.url
    })
}
function createLanguage(item) {
    return axios({
        method: apiPath.language.create.method,
        url: apiPath.language.create.url,
        data: item
    })
}
function updateLanguage(item) {
    return axios({
        method: apiPath.language.update.method,
        url: apiPath.language.update.url,
        data: item
    })
}
function deleteLanguage(item) {
    return axios({
        method: apiPath.language.delete(item.id).method,
        url: apiPath.language.delete(item.id).url,
    })
}