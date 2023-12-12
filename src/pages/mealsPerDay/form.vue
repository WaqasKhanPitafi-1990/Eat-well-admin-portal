<template>
  <div>
    <Breadcrumbs
      :main="$t('mealsPerDay.heading')"
      :mainLink="'mealsPerDayList'"
      :title="
        $t(
          'mealsPerDay.' +
            (mealsPerDayId ? 'updateMealsPerDay' : 'createMealsPerDay')
        )
      "
    />
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <px-card :actions="false">
            <div slot="with-padding">
              <b-form class="needs-validation" @submit="onCustomStyleSubmit">
                <div class="form-row">
                  <div class="col-md-6 mb-4">
                    <label for="form_name">
                      {{ $t("mealsPerDay.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('mealsPerDay.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_selection">
                      {{ $t("mealsPerDay.formFields.selection") }}
                      <i
                        class="fa fa-question-circle-o"
                        v-b-tooltip.hover
                        :title="$t('mealsPerDay.formFields.tooltip.selection')"
                      ></i>
                    </label>
                    <b-form-input
                      type="number"
                      id="form_selection"
                      v-model="form.selection"
                      :state="form_result.selection"
                      :placeholder="$t('mealsPerDay.formFields.selection')"
                    ></b-form-input>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_categories">
                      {{ $t("mealsPerDay.formFields.categories") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="form.categories"
                        :options="mealCategoriesList"
                        label="name"
                        track-by="id"
                        :multiple="true"
                        :placeholder="$t('multiselect.selectOption')"
                        :selectLabel="$t('multiselect.selectLabel')"
                        :selectedLabel="$t('multiselect.selectedLabel')"
                        :deselectLabel="$t('multiselect.deselectLabel')"
                      ></multiselect>
                      <div
                        class="custom-state-invalid icon"
                        :class="{
                          'is-invalid': form_result.categories == false,
                          'is-valid': form_result.categories == true,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_calories">
                      {{ $t("mealsPerDay.formFields.calories") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="form.calories"
                        :options="caloriesList"
                        :multiple="true"
                        label="calorieValue"
                        track-by="id"
                        :placeholder="$t('multiselect.selectOption')"
                        :selectLabel="$t('multiselect.selectLabel')"
                        :selectedLabel="$t('multiselect.selectedLabel')"
                        :deselectLabel="$t('multiselect.deselectLabel')"
                      ></multiselect>
                      <div
                        class="custom-state-invalid icon"
                        :class="{
                          'is-invalid': form_result.calories == false,
                          'is-valid': form_result.calories == true,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
                <b-button type="submit" variant="primary">
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
  mealsPerDayService,
  mealCategoryService,
  caloriesService,
} from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        selection: "",
        categories: [],
        calories: [],
      },
      form_result: {
        id: null,
        name: null,
        selection: null,
        categories: null,
        calories: null,
      },
      mealsPerDayId: "",
      mealCategoriesList: [],
      selectedMealsPerDay: [],
      caloriesList: [],
    };
  },
  watch: {
    "$route.params": {
      handler: function () {
        this.checkForm();
        this.resetForm();
      },
    },
  },
  mounted() {
    this.checkForm();
  },
  computed: {
    ...mapGetters("user", ["getMealsPerDay"]),
  },
  methods: {
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        let payload = {
          name: this.form.name,
          selection: this.form.selection,
          categoryIds: this.form.categories.map((x) => x.id),
          calorieIds: this.form.calories.map((x) => x.id),
        };
        this.setLoadingState(true);
        if (this.mealsPerDayId) {
          payload = {
            mealPerDayId: this.form.id,
            ...payload,
          };
          mealsPerDayService
            .updateMealsPerDay(payload, this.mealsPerDayId)
            .then(
              () => {
                this.setLoadingState(false);
                this.successModal(this.$t("mealsPerDay.updateSuccess"));
                // this.resetForm();
              },
              () => {
                this.setLoadingState(false);
                this.failureModal();
              }
            );
        } else {
          mealsPerDayService.createMealsPerDay(payload).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("mealsPerDay.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "mealsPerDayList" });
              });
            },
            () => {
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        }
      }
    },
    checkForm() {
      if (this.mealCategoriesList.length) {
        this.checkConditions();
        return;
      }
      this.setLoadingState(true);
      mealCategoryService.getAll().then(
        (response) => {
          this.mealCategoriesList = response.data.data;
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
    },
    checkConditions() {
      this.mealsPerDayId = this.$route.params.id || "";
      if (this.mealsPerDayId) {
        let selectedMealsPerDay = this.getMealsPerDay;
        if (selectedMealsPerDay) {
          this.form.id = selectedMealsPerDay.id;
          this.form.name = selectedMealsPerDay.name;
          this.form.selection = selectedMealsPerDay.selection;
          this.form.categories = selectedMealsPerDay.categories;
          this.form.calories = selectedMealsPerDay.calories;
        } else if (this.$route.name == "mealsPerDayUpdate") {
          this.$router.push({ name: "mealsPerDayList" });
        }
      }
    },
    validateForm() {
      if (this.mealsPerDayId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.selection = this.form.selection !== "";
      this.form_result.categories = this.form.categories.length > 0;
      this.form_result.calories = this.form.calories.length > 0;
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        selection: "",
        categories: [],
        calories: [],
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
        selection: null,
        categories: null,
        calories: null,
      };
    },
  },
};
</script>