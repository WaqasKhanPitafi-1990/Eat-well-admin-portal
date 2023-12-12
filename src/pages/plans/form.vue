<template>
  <div>
    <Breadcrumbs
      :main="$t('plans.heading')"
      :mainLink="'plansList'"
      :title="$t('plans.' + (planId ? 'updatePlan' : 'createPlan'))"
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
                      {{ $t("plans.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('plans.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_dietCategoryId">
                      {{ $t("plans.formFields.dietCategoryId") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="form.dietCategoryId"
                        :options="dietCategoryList"
                        label="name"
                        track-by="id"
                        :placeholder="$t('multiselect.selectOption')"
                        :selectLabel="$t('multiselect.selectLabel')"
                        :selectedLabel="$t('multiselect.selectedLabel')"
                        :deselectLabel="$t('multiselect.deselectLabel')"
                      ></multiselect>
                      <div
                        class="custom-state-invalid icon"
                        :class="{
                          'is-invalid': form_result.dietCategoryId == false,
                          'is-valid': form_result.dietCategoryId == true,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_price">
                      {{ $t("plans.formFields.price") }}
                    </label>
                    <b-form-input
                      type="number"
                      id="form_price"
                      v-model="form.price"
                      :state="form_result.price"
                      :placeholder="$t('plans.formFields.price')"
                    ></b-form-input>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_duration">
                      {{ $t("plans.formFields.duration") }}
                    </label>
                    <b-form-input
                      type="number"
                      min="1"
                      id="form_duration"
                      v-model="form.duration"
                      :state="form_result.duration"
                      :placeholder="$t('plans.formFields.duration')"
                    ></b-form-input>
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
import { plansService, dietCategoryService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        price: "",
        duration: "",
        dietCategoryId: null,
      },
      form_result: {
        id: null,
        name: null,
        price: null,
        duration: null,
        dietCategoryId: null,
      },
      planId: "",
      dietCategoryList: [],
      selectedPlan: [],
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
    ...mapGetters("user", ["getPlans"]),
  },
  methods: {
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        let payload = {
          name: this.form.name,
          price: this.form.price,
          duration: this.form.duration,
          dietCategoryId: this.form.dietCategoryId.id,
        };
        this.setLoadingState(true);
        if (this.planId) {
          payload = {
            id: this.form.id,
            ...payload,
          };
          plansService.updatePlans(payload, this.planId).then(
            () => {
              this.setLoadingState(false);
              this.successModal(this.$t("plans.updateSuccess"));
            },
            () => {
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        } else {
          plansService.createPlans(payload).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("plans.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "plansList" });
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
      if (this.dietCategoryList.length) {
        this.checkConditions();
        return;
      }
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
    },
    checkConditions() {
      this.planId = this.$route.params.id || "";
      if (this.planId) {
        let selectedPlan = this.getPlans;
        if (selectedPlan) {
          this.form.id = selectedPlan.id;
          this.form.name = selectedPlan.name;
          this.form.price = selectedPlan.price;
          this.form.duration = selectedPlan.duration;
          this.form.dietCategoryId = null;
          let dietCategoryObj = this.dietCategoryList.find(
            (item) => item.id == selectedPlan.dietCategoryId
          );
          if (dietCategoryObj) {
            this.form.dietCategoryId = dietCategoryObj;
          }
        } else if (this.$route.name == "plansUpdate") {
          this.$router.push({ name: "plansList" });
        }
      }
    },
    validateForm() {
      if (this.planId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.price = this.form.price !== "";
      this.form_result.dietCategoryId = this.form.dietCategoryId !== null;
      this.form_result.duration = this.form.duration !== "";
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        price: "",
        duration: "",
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
        price: null,
        duration: null,
      };
    },
  },
};
</script>