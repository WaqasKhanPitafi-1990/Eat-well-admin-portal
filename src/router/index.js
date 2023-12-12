import Vue from 'vue'
import Router from "vue-router";

import Body from '../components/body'

import Login from '../pages/authentication/login';

import Dashboard from '../pages/dashboard'

import LanguageList from '../pages/languages/list'
import LanguageForm from '../pages/languages/form'

import GoalsList from '../pages/goals/list'
import GoalsForm from '../pages/goals/form'

import DietCategoryList from '../pages/dietCategory/list'
import DietCategoryForm from '../pages/dietCategory/form'

import PlansList from '../pages/plans/list'
import PlansForm from '../pages/plans/form'

import MealCategoriesList from '../pages/mealCategories/list'
import MealCategoriesForm from '../pages/mealCategories/form'

import IngredientsList from '../pages/ingredients/list'
import IngredientsForm from '../pages/ingredients/form'

import MealsPerDayList from '../pages/mealsPerDay/list'
import MealsPerDayForm from '../pages/mealsPerDay/form'

import CaloriesList from '../pages/calories/list'
import CaloriesForm from '../pages/calories/form'

import MealItemsList from '../pages/mealItems/list'
import MealItemsForm from '../pages/mealItems/form'

import OrdersList from '../pages/orders/list'
import OrdersDetails from '../pages/orders/details'

import AddressTypesList from '../pages/addressTypes/list'
import AddressTypesForm from '../pages/addressTypes/form'

import UserAddressList from '../pages/userAddress/list'
import UserAddressForm from '../pages/userAddress/form'

import UserManagementList from '../pages/userManagement/list'
import UserManagementForm from '../pages/userManagement/form'

import { userService } from '../services';

// component

Vue.use(Router)

const routes = [
  { path: '', redirect: { name: 'default' } },
  {
    path: '/dashboard',
    component: Body,
    children: [
      {
        path: 'default',
        name: 'default',
        component: Dashboard,
        meta: {
          title: 'Dashboard | IMC EatWell Admin Portal',
        }
      }
    ]
  },
  {
    path: '/language',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'languageList',
        component: LanguageList,
        meta: {
          title: 'Language List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'languageUpdate',
        component: LanguageForm,
        meta: {
          title: 'Language Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'languageCreate',
        component: LanguageForm,
        meta: {
          title: 'Language Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/goals',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'goalsList',
        component: GoalsList,
        meta: {
          title: 'Goals List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'goalsUpdate',
        component: GoalsForm,
        meta: {
          title: 'Goals Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'goalsCreate',
        component: GoalsForm,
        meta: {
          title: 'Goals Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/diet-category',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'dietCategoryList',
        component: DietCategoryList,
        meta: {
          title: 'Diet Category List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'dietCategoryUpdate',
        component: DietCategoryForm,
        meta: {
          title: 'Diet Category Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'dietCategoryCreate',
        component: DietCategoryForm,
        meta: {
          title: 'Diet Category Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/plans',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'plansList',
        component: PlansList,
        meta: {
          title: 'Plans List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'plansUpdate',
        component: PlansForm,
        meta: {
          title: 'Plans Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'plansCreate',
        component: PlansForm,
        meta: {
          title: 'Plans Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/meal-categories',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'mealCategoryList',
        component: MealCategoriesList,
        meta: {
          title: 'Meal Categories List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'mealCategoryUpdate',
        component: MealCategoriesForm,
        meta: {
          title: 'Meal Categories Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'mealCategoryCreate',
        component: MealCategoriesForm,
        meta: {
          title: 'Meal Categories Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/ingredients',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'ingredientList',
        component: IngredientsList,
        meta: {
          title: 'Ingredients List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'ingredientUpdate',
        component: IngredientsForm,
        meta: {
          title: 'Ingredients Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'ingredientCreate',
        component: IngredientsForm,
        meta: {
          title: 'Ingredients Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/meals-per-day',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'mealsPerDayList',
        component: MealsPerDayList,
        meta: {
          title: 'Meals Per Day List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'mealsPerDayUpdate',
        component: MealsPerDayForm,
        meta: {
          title: 'Meals Per Day Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'mealsPerDayCreate',
        component: MealsPerDayForm,
        meta: {
          title: 'Meals Per Day Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/calories',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'caloriesList',
        component: CaloriesList,
        meta: {
          title: 'Calories List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'caloriesUpdate',
        component: CaloriesForm,
        meta: {
          title: 'Calories Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'caloriesCreate',
        component: CaloriesForm,
        meta: {
          title: 'Calories Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/meal-items',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'mealItemsList',
        component: MealItemsList,
        meta: {
          title: 'Meal Items List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'mealItemsUpdate',
        component: MealItemsForm,
        meta: {
          title: 'Meal Items Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'mealItemsCreate',
        component: MealItemsForm,
        meta: {
          title: 'Meal Items Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/orders',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'ordersList',
        component: OrdersList,
        meta: {
          title: 'Orders List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'list/:id',
        name: 'ordersDetails',
        component: OrdersDetails,
        meta: {
          title: 'Orders Details | IMC EatWell Admin Portal',
        }
      }
    ]
  },
  {
    path: '/address-types',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'addressTypesList',
        component: AddressTypesList,
        meta: {
          title: 'Address Types List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'addressTypesUpdate',
        component: AddressTypesForm,
        meta: {
          title: 'Address Types Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'addressTypesCreate',
        component: AddressTypesForm,
        meta: {
          title: 'Address Types Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/user-address',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'userAddressList',
        component: UserAddressList,
        meta: {
          title: 'User Address List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'userAddressUpdate',
        component: UserAddressForm,
        meta: {
          title: 'User Address Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'userAddressCreate',
        component: UserAddressForm,
        meta: {
          title: 'User Address Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/user-management',
    component: Body,
    children: [
      {
        path: 'list',
        name: 'userManagementList',
        component: UserManagementList,
        meta: {
          title: 'User Management List | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'update/:id',
        name: 'userManagementUpdate',
        component: UserManagementForm,
        meta: {
          title: 'User Management Update | IMC EatWell Admin Portal',
        }
      },
      {
        path: 'create',
        name: 'userManagementCreate',
        component: UserManagementForm,
        meta: {
          title: 'User Management Create | IMC EatWell Admin Portal',
        }
      },
    ]
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login | IMC EatWell Admin Portal',
    }
  },
];

const router = new Router({
  routes,
  base: '/eatwellportal/',
  linkActiveClass: "active",
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.title)
    document.title = to.meta.title;
  const path = ['/auth/login', '/auth/register'];
  if (path.includes(to.path) || to.path === '/callback' || userService.isAuthenticatedUser()) {
    return next();
  }
  next('/auth/login');
});



export default router
