<template>
  <div>
    <Breadcrumbs
      :main="$t('calories.heading')"
      :mainLink="'caloriesList'"
      :title="
        $t('calories.' + (caloriesId ? 'updateCalories' : 'createCalories'))
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
                    <label for="form_calorieValue">
                      {{ $t("calories.formFields.calorieValue") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_calorieValue"
                      v-model="form.calorieValue"
                      :state="form_result.calorieValue"
                      :placeholder="$t('calories.formFields.calorieValue')"
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
import { caloriesService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        calorieValue: "",
      },
      form_result: {
        id: null,
        calorieValue: null,
      },
      caloriesId: "",
      mealCategoriesList: [],
      selectedCalories: [],
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
    ...mapGetters("user", ["getCalories"]),
  },
  methods: {
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        let payload = {
          id: this.form.id,
          calorie_value: this.form.calorieValue,
        };
        this.setLoadingState(true);
        if (this.caloriesId) {
          payload = {
            id: this.form.id,
            ...payload,
          };
          caloriesService.updateCalories(payload, this.caloriesId).then(
            () => {
              this.setLoadingState(false);
              this.successModal(this.$t("calories.updateSuccess"));
              // this.resetForm();
            },
            () => {
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        } else {
          caloriesService.createCalories(payload).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("calories.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "caloriesList" });
              });
            },
            (err) => {
              this.setLoadingState(false);
              this.failureModal(err.response.data.message);
            }
          );
        }
      }
    },
    checkForm() {
      this.caloriesId = this.$route.params.id || "";
      if (this.caloriesId) {
        let selectedCalories = this.getCalories;
        if (selectedCalories) {
          this.form.id = selectedCalories.id;
          this.form.calorieValue = selectedCalories.calorieValue;
        } else if (this.$route.name == "caloriesUpdate") {
          this.$router.push({ name: "caloriesList" });
        }
      }
    },
    validateForm() {
      if (this.caloriesId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.calorieValue = this.form.calorieValue !== "";
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        calorieValue: "",
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        calorieValue: null,
      };
    },
    addCalories(newTag) {
      this.caloriesList.push(newTag);
    },
  },
};
</script>