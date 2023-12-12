<template>
  <div>
    <Breadcrumbs
      :main="$t('orders.heading')"
      :mainLink="'ordersList'"
      :title="'ordersDetails'"
    />
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <px-card :actions="false">
            <div slot="with-padding">
              <b-form class="needs-validation">
                <div class="form-row">
                  <div
                    class="col-md-4 mb-4"
                    v-for="(key, index) in showDataKeys"
                    :key="'data-' + index"
                  >
                    <label for="form_id">
                      {{ $t("orders.formFields." + key) }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_id"
                      disabled
                      :value="
                        key.includes('status')
                          ? $t('status.' + showData[key])
                          : showData[key]
                      "
                    ></b-form-input>
                  </div>
                </div>
                <div class="table-responsive datatable-vue">
                  <h3>{{ $t("orders.formFields.lineItems") }}</h3>
                  <b-table
                    show-empty
                    sticky-header
                    :items="lineItems"
                    :fields="lineItemsFields"
                    v-if="lineItems.length && lineItemsFields.length"
                  >
                    <template #table-busy>
                      <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong> {{ $t("loading") }}...</strong>
                      </div>
                    </template>

                    <template #head()="data">
                    <div
                      :style="
                        data.field.width ? 'min-width: ' + data.field.width + 'rem' : ''
                      "
                    >
                      {{ data.label.toUpperCase() }}
                    </div>
                  </template>
                    <template #cell()="data">
                      <template
                        v-if="data.field.key.toLowerCase().includes('category')"
                      >
                        <img
                          class="table-image"
                          :src="getImageUrl(data.value.image)"
                          alt="img"
                        />
                        {{ data.value.name }}
                      </template>
                      <template
                        v-else-if="
                          data.field.key.toLowerCase().includes('mealitem')
                        "
                      >
                        <template v-if="data.value && data.value.name">
                          <img
                            class="table-image"
                            :src="getImageUrl(data.value.imageMenu)"
                            alt="img"
                          />
                          {{ data.value.name }}
                        </template>
                        <template v-else>
                          {{ data.value }}
                        </template>
                      </template>
                      <template
                        v-else-if="
                          data.field.key.toLowerCase().includes('status')
                        "
                      >
                        {{ data.value ? $t("status." + data.value) : "-" }}
                      </template>
                      <template v-else>
                        {{ getTableValue(data.value) || "-" }}
                      </template>
                    </template>
                  </b-table>
                </div>
                <b-button class="mt-5" type="submit" variant="primary">
                  {{ $t("submit") }}
                </b-button>
              </b-form>
            </div>
          </px-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mealCategoryService,
  ingredientService,
  dietCategoryService,
  goalsService,
  plansService,
  caloriesService,
  mealsPerDayService,
  mealItemsService,
} from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      ordersId: "",
      selectedOrder: {},
      selectedCategories: [],
      selectedIngredients: [],
      mealCategoryList: [],
      ingredientsList: [],
      dietCategoryList: [],
      goalsList: [],
      plansList: [],
      caloriesList: [],
      mealsPerDayList: [],
      mealItemsList: [],
      mealDetails: [
        {
          id: null,
          dietCategoryId: null,
          goalsId: null,
          calories: null,
          size: null,
        },
      ],
      showDataKeys: [],
      showData: {},
      lineItems: [],
      lineItemsFields: [],
    };
  },
  watch: {
    "$route.params": {
      handler: function () {
        this.checkForm();
      },
    },
  },
  mounted() {
    this.checkForm();
  },
  computed: {
    ...mapGetters("user", ["getOrders"]),
  },
  methods: {
    checkForm() {
      if (this.mealCategoryList.length) {
        this.checkConditions();
        return;
      }
      this.setLoadingState(true);
      mealCategoryService.getAll().then(
        (response) => {
          this.mealCategoryList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      ingredientService.getAll().then(
        (response) => {
          this.ingredientsList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      dietCategoryService.getAll().then(
        (response) => {
          this.dietCategoryList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      goalsService.getAll().then(
        (response) => {
          this.goalsList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      plansService.getAll().then(
        (response) => {
          this.plansList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      caloriesService.getAll().then(
        (response) => {
          this.caloriesList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      mealsPerDayService.getAll().then(
        (response) => {
          this.mealsPerDayList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      mealItemsService.getAll().then(
        (response) => {
          this.mealItemsList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
    },
    checkConditions() {
      this.ordersId = this.$route.params.id || "";
      if (this.ordersId) {
        let selectedOrder = this.getOrders;
        if (selectedOrder) {
          selectedOrder = {
            ...selectedOrder,
            goal: this.goalsList.find(
              (goal) => goal.id === selectedOrder.goalId
            ),
            plan: this.plansList.find(
              (plan) => plan.id === selectedOrder.planId
            ),
            dietCategory: this.dietCategoryList.find(
              (dietCategory) => dietCategory.id === selectedOrder.dietCategoryId
            ),
            calories: this.caloriesList.find(
              (calorie) => calorie.id === selectedOrder.caloriesId
            ),
            mealsPerDay: this.mealsPerDayList.find(
              (mealPerDay) => mealPerDay.id === selectedOrder.mealsPerDayId
            ),
          };
          this.showData = {
            id: selectedOrder.id || "-",
            userId: selectedOrder.userId || "-",
            addressId: selectedOrder.addressId || "-",
            goal: (selectedOrder.goal && selectedOrder.goal.name) || "-",
            plan: (selectedOrder.plan && selectedOrder.plan.name) || "-",
            dietCategory:
              (selectedOrder.dietCategory && selectedOrder.dietCategory.name) ||
              "-",
            calories:
              (selectedOrder.calories && selectedOrder.calories.calorieValue) ||
              "-",
            mealsPerDay:
              (selectedOrder.mealsPerDay && selectedOrder.mealsPerDay.name) ||
              "-",
            dieticianAssessment: +selectedOrder.dieticianAssessment || "-",
            startDate: selectedOrder.startDate || "-",
            endDate: selectedOrder.endDate || "-",
            price: selectedOrder.price || "-",
            discount: selectedOrder.discount || "-",
            vat: selectedOrder.vat || "-",
            totalAmount: selectedOrder.totalAmount || "-",
            deliveryMethod: selectedOrder.deliveryMethod
              ? selectedOrder.deliveryMethod == "P"
                ? "Self Pickup"
                : "Delivery"
              : "-",
            orderStatus: this.constants.orderStatus[selectedOrder.orderStatus],
            checkoutFlag: +selectedOrder.checkoutFlag || "-",
            createdAt: selectedOrder.createdAt || "-",
            createdBy: selectedOrder.createdBy || "-",
            updatedAt: selectedOrder.updatedAt || "-",
            updatedBy: selectedOrder.updatedBy || "-",
          };
          this.showDataKeys = Object.keys(this.showData);
          this.lineItems = [];
          selectedOrder.mealCategories.forEach((item) => {
            item.lineItems.forEach((lineItem) => {
              let mealItem = this.mealItemsList.find(
                (mealItem) => mealItem.id === lineItem.dietCategoryMealItemsId
              );
              this.lineItems.push({
                lineItemId: lineItem.id,
                mealItem: mealItem || lineItem.dietCategoryMealItemsId,
                mealCategory: item.mealCategory,
                status: lineItem.status,
                orderDate: lineItem.orderDate,
              });
            });
          });
          this.lineItemsFields = [];
          if (this.lineItems.length) {
            Object.keys(this.lineItems[0]).forEach((key) => {
              if (!key.toLowerCase().includes("old")) {
                this.lineItemsFields.push({
                  key: key,
                  label: key
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/_/g, " "),
                  sortable: true,
                });
              }
            });
          }
        } else if (this.$route.name == "ordersDetails") {
          this.$router.push({ name: "ordersList" });
        }
      }
    },
  },
};
</script>
<style>
.table-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
