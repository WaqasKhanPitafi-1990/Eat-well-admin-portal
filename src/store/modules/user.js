export default {
    namespaced: true,
    state: {
        loading: false,
        perPage: 10,
        pageOptions: [5, 10, 15],
        selectedLanguage: null,
        selectedGoal: null,
        selectedDietCategory: null,
        selectedPlans: null,
        selectedMealCategory: null,
        selectedIngredient: null,
        selectedMealsPerDay: null,
        selectedCalories: null,
        selectedMealItems: null,
        selectedOrders: null,
        selectedAddressTypes: null,
        selectedUserAddress: null,
        selectedUserManagement: null,
    },
    actions: {
        setLoading({ commit }, data) {
            commit('SET_LOADING', data)
        },
        setPerPageSelection({ commit }, data) {
            commit('SET_PER_PAGE_SELECTION', data)
        },
        setLanguage({ commit }, data) {
            commit('SET_LANGUAGE', data)
        },
        setGoal({ commit }, data) {
            commit('SET_GOAL', data)
        },
        setDietCategory({ commit }, data) {
            commit('SET_DIET_CATEGORY', data)
        },
        setPlans({ commit }, data) {
            commit('SET_PLANS', data)
        },
        setMealCategory({ commit }, data) {
            commit('SET_MEAL_CATEGORY', data)
        },
        setIngredient({ commit }, data) {
            commit('SET_INGRDIENT', data)
        },
        setMealsPerDay({ commit }, data) {
            commit('SET_MEALS_PER_DAY', data)
        },
        setCalories({ commit }, data) {
            commit('SET_CALORIES', data)
        },
        setMealItems({ commit }, data) {
            commit('SET_MEAL_ITEMS', data)
        },
        setOrders({ commit }, data) {
            commit('SET_ORDERS', data)
        },
        setAddressTypes({ commit }, data) {
            commit('SET_ADDRESS_TYPES', data)
        },
        setUserAddress({ commit }, data) {
            commit('SET_USER_ADDRESS', data)
        },
        setUserManagement({ commit }, data) {
            commit('SET_USER_MANAGEMENT', data)
        }
    },
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_PER_PAGE_SELECTION(state, selection) {
            state.perPage = selection;
        },
        SET_LANGUAGE(state, language) {
            state.selectedLanguage = language;
        },
        SET_GOAL(state, goal) {
            state.selectedGoal = goal;
        },
        SET_DIET_CATEGORY(state, dietCategory) {
            state.selectedDietCategory = dietCategory;
        },
        SET_PLANS(state, plans) {
            state.selectedPlans = plans;
        },
        SET_MEAL_CATEGORY(state, mealCategory) {
            state.selectedMealCategory = mealCategory;
        },
        SET_INGRDIENT(state, ingredient) {
            state.selectedIngredient = ingredient;
        },
        SET_MEALS_PER_DAY(state, mealsPerDay) {
            state.selectedMealsPerDay = mealsPerDay;
        },
        SET_CALORIES(state, calories) {
            state.selectedCalories = calories;
        },
        SET_MEAL_ITEMS(state, mealItems) {
            state.selectedMealItems = mealItems;
        },
        SET_ORDERS(state, orders) {
            state.selectedOrders = orders;
        },
        SET_ADDRESS_TYPES(state, addressTypes) {
            state.selectedAddressTypes = addressTypes;
        },
        SET_USER_ADDRESS(state, userAddress) {
            state.selectedUserAddress = userAddress;
        },
        SET_USER_MANAGEMENT(state, userManagement) {
            state.selectedUserManagement = userManagement;
        }
    },
    getters: {
        getLoading: (state) => state.loading,
        getPerPageOption: (state) => state.pageOptions,
        getPerPageSelection: (state) => state.perPage,
        getLanguage: (state) => state.selectedLanguage,
        getGoal: (state) => state.selectedGoal,
        getDietCategory: (state) => state.selectedDietCategory,
        getPlans: (state) => state.selectedPlans,
        getMealCategory: (state) => state.selectedMealCategory,
        getIngredient: (state) => state.selectedIngredient,
        getMealsPerDay: (state) => state.selectedMealsPerDay,
        getCalories: (state) => state.selectedCalories,
        getMealItems: (state) => state.selectedMealItems,
        getOrders: (state) => state.selectedOrders,
        getAddressTypes: (state) => state.selectedAddressTypes,
        getUserAddress: (state) => state.selectedUserAddress,
        getUserManagement: (state) => state.selectedUserManagement,
    }
};