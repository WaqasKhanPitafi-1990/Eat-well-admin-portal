let basePath = process.env.VUE_APP_API_BASE_URL + "";

let getApiObject = (method, url, subpath = 'api/', pre = basePath) => {
    return { method, url: pre + subpath + url };
}

export const apiPath = {
    //Login
    login: getApiObject("post", "auth/login", ''),

    //Dashboard Statistics CRUD
    dashboard: {
        getAll: getApiObject("get", "statistics/all"),
        getFiltered: getApiObject("post", "statistics/allLogByFilter")
    },

    //Language CRUD
    language: {
        getAll: getApiObject("get", "lang/get/all"),
        create: getApiObject("post", "lang/save"),
        update: getApiObject("put", "lang/update"),
        delete: (id) => getApiObject("delete", "lang/delete?langId=" + id),
    },

    //Goals CRUD
    goals: {
        getAll: getApiObject("get", "user/goals/get/all"),
        create: getApiObject("post", "user/goals/save"),
        update: getApiObject("put", "user/goals/update"),
        delete: (id) => getApiObject("delete", "user/goals/delete?goalId=" + id),
    },

    //Diet Category CRUD
    dietCategory: {
        getAll: getApiObject("get", "user/diet/get/all"),
        getByGoal: (id) => getApiObject("get", "user/diet/get?goalId=" + id),
        create: getApiObject("post", "user/diet/save"),
        addPlans: getApiObject("post", "user/diet/save/plans"),
        update: getApiObject("put", "user/diet/update"),
        delete: (id) => getApiObject("delete", "user/diet/delete?dietId=" + id),
    },

    //Plans CRUD
    plans: {
        getAll: getApiObject("get", "user/plans/get/all"),
        create: getApiObject("post", "user/plans/save"),
        update: getApiObject("put", "user/plans/update"),
        delete: (id) => getApiObject("delete", "user/plans/delete?planId=" + id),
    },

    //Meal Category CRUD
    mealCategory: {
        getAll: getApiObject("get", "user/meal-categories/get/all"),
        create: getApiObject("post", "user/meal-categories/save"),
        update: getApiObject("put", "user/meal-categories/update"),
        delete: (id) => getApiObject("delete", "user/meal-categories/delete?mealCategoryId=" + id),
    },

    //Ingredient CRUD
    ingredient: {
        getAll: getApiObject("get", "user/ingredients/get/all"),
        create: getApiObject("post", "user/ingredients/save"),
        update: getApiObject("put", "user/ingredients/update"),
        delete: (id) => getApiObject("delete", "user/ingredients/delete?ingredientId=" + id),
    },

    //Meals Per Day CRUD
    mealsPerDay: {
        getAll: getApiObject("get", "user/meal-per-day/get/all"),
        create: getApiObject("post", "user/meal-per-day/save"),
        update: getApiObject("put", "user/meal-per-day/update"),
        delete: (id) => getApiObject("delete", "user/meal-per-day/delete?mealPerDayId=" + id),
    },

    //Calories CRUD
    calories: {
        getAll: getApiObject("get", "user/calories/get/all"),
        create: getApiObject("post", "user/calories/save"),
        update: getApiObject("put", "user/calories/update"),
        delete: (id) => getApiObject("delete", "user/calories/delete/" + id),
    },

    //Meal Items CRUD
    mealItems: {
        getAll: getApiObject("get", "user/meal/get/all"),
        create: getApiObject("post", "user/meal/v2/save"),
        update: getApiObject("put", "user/meal/v2/update"),
        delete: (id) => getApiObject("delete", "user/meal/delete?mealItemId=" + id),
    },

    //Orders CRUD
    orders: {
        getAll: getApiObject("get", "user/order/get/all"),
    },

    //Address Types CRUD
    addressTypes: {
        getAll: getApiObject("get", "address-types/get/all"),
        create: getApiObject("post", "address-types/save"),
        update: getApiObject("put", "address-types/update"),
        delete: (id) => getApiObject("delete", "address-types/delete?addressTypeId=" + id),
    },

    //User Address CRUD
    userAddress: {
        getAll: getApiObject("get", "user/user-address/get/all"),
        create: getApiObject("post", "user/user-address/save"),
        update: getApiObject("put", "user/user-address/update"),
        delete: (id) => getApiObject("delete", "user/user-address/delete?userAddressId=" + id),
    },

    //User Management CRUD
    userManagement: {
        getAll: getApiObject("get", "user/user-management/get/all"),
        create: getApiObject("post", "user/user-management/save"),
        update: getApiObject("put", "user/user-management/update"),
        delete: (id) => getApiObject("delete", "user/user-management/delete?userManagementId=" + id),
    },
};