<template>
  <div>
    <Breadcrumbs
      :main="$t('mealItems.heading')"
      :mainLink="'mealItemsList'"
      :title="
        $t('mealItems.' + (mealItemsId ? 'updateMealItems' : 'createMealItems'))
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
                  <div class="col-md-12 mb-4">
                    <label for="form_name">
                      {{ $t("mealItems.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('mealItems.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-12 mb-4">
                    <label for="form_description">
                      {{ $t("mealItems.formFields.description") }}
                    </label>
                    <b-form-textarea
                      id="form_description"
                      rows="5"
                      max-rows="10"
                      v-model="form.description"
                      :state="
                        form_result.description &&
                        form.description.length <= constants.maxCharacter.large
                      "
                      :placeholder="$t('mealItems.formFields.description')"
                    ></b-form-textarea>
                    Max Characters:
                    {{
                      (form.description ? form.description.length : 0) +
                      "/" +
                      constants.maxCharacter.large
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_categories">
                      {{ $t("mealItems.formFields.categories") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="selectedCategories"
                        :options="mealCategoryList"
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
                          'is-invalid':
                            formSubmitted && selectedCategories.length == 0,
                          'is-valid':
                            formSubmitted && selectedCategories.length > 0,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_ingredients">
                      {{ $t("mealItems.formFields.ingredients") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="selectedIngredients"
                        :options="ingredientsList"
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
                          'is-invalid':
                            formSubmitted && selectedIngredients.length == 0,
                          'is-valid':
                            formSubmitted && selectedIngredients.length > 0,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="text-center">
                      <label for="form_state">
                        {{ $t("mealItems.formFields.imageMenu") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('mealItems.formFields.tooltip.image') +
                            constants.images.values.join('/')
                          "
                        ></i>
                      </label>
                      <div class="cutom-input-without-browse">
                        <b-form-file
                          id="form_image_menu"
                          :state="form_result.image_menu"
                          placeholder="Choose file..."
                          drop-placeholder="Drop file here..."
                          @change="
                            previewImage(
                              $event,
                              form,
                              'image_menu',
                              '_url',
                              'image',
                              constants.images
                            )
                          "
                          accept="image/*"
                        ></b-form-file>
                        <label for="form_image_menu" data-browse="Browse">
                          <img
                            class="pointer"
                            v-if="form.image_menu_url"
                            data-browse="Browse"
                            :src="getImageUrl(form.image_menu_url)"
                            :alt="$t('imageNotLoaded')"
                          />
                          <feather
                            class="pointer"
                            style="width: 100px"
                            v-else
                            type="upload"
                          ></feather>
                          <template v-if="form.image_menu_url">
                            <div class="file-buttons">
                              <i
                                @click="removeFile('image_menu')"
                                class="fa fa-times pointer"
                              ></i>
                            </div>
                          </template>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="text-center">
                      <label for="form_state">
                        {{ $t("mealItems.formFields.imageItem") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('mealItems.formFields.tooltip.image') +
                            constants.images.values.join('/')
                          "
                        ></i>
                      </label>
                      <div class="cutom-input-without-browse">
                        <b-form-file
                          id="form_image_item"
                          :state="form_result.image_item"
                          placeholder="Choose file..."
                          drop-placeholder="Drop file here..."
                          @change="
                            previewImage(
                              $event,
                              form,
                              'image_item',
                              '_url',
                              'image',
                              constants.images
                            )
                          "
                          accept="image/*"
                        ></b-form-file>
                        <label for="form_image_item" data-browse="Browse">
                          <img
                            class="pointer"
                            v-if="form.image_item_url"
                            data-browse="Browse"
                            :src="getImageUrl(form.image_item_url)"
                            :alt="$t('imageNotLoaded')"
                          />
                          <feather
                            class="pointer"
                            style="width: 100px"
                            v-else
                            type="upload"
                          ></feather>
                          <template v-if="form.image_item_url">
                            <div class="file-buttons">
                              <i
                                @click="removeFile('image_item')"
                                class="fa fa-times pointer"
                              ></i>
                            </div>
                          </template>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <h3 class="mb-4">{{ "Details" }}</h3>
                <div
                  class="form-row pt-4"
                  v-for="(detail, index) in mealDetails"
                  :key="'meal-detail-' + index"
                >
                  <div class="col-sm-11">
                    <div class="form-row">
                      <div class="col-md-6 mb-4">
                        <label for="form_goal">
                          {{ $t("mealItems.formFields.goal") }}
                        </label>
                        <div class="custom-validation">
                          <multiselect
                            v-model="detail.goalsId"
                            :options="goalsList"
                            label="name"
                            track-by="id"
                            @input="populateDietCategories(detail)"
                            :placeholder="$t('multiselect.selectOption')"
                            :selectLabel="$t('multiselect.selectLabel')"
                            :selectedLabel="$t('multiselect.selectedLabel')"
                            :deselectLabel="$t('multiselect.deselectLabel')"
                          ></multiselect>
                          <div
                            class="custom-state-invalid icon"
                            :class="
                              formSubmitted
                                ? detail.goalsId
                                  ? 'is-valid'
                                  : 'is-invalid'
                                : ''
                            "
                          ></div>
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="form_dietCategory">
                          {{ $t("mealItems.formFields.dietCategory") }}
                        </label>
                        <div class="custom-validation">
                          <multiselect
                            v-model="detail.dietCategoryId"
                            :options="detail.dietCategoryList"
                            label="name"
                            track-by="id"
                            :placeholder="$t('multiselect.selectOption')"
                            :selectLabel="$t('multiselect.selectLabel')"
                            :selectedLabel="$t('multiselect.selectedLabel')"
                            :deselectLabel="$t('multiselect.deselectLabel')"
                          ></multiselect>
                          <div
                            class="custom-state-invalid icon"
                            :class="
                              formSubmitted
                                ? detail.dietCategoryId
                                  ? 'is-valid'
                                  : 'is-invalid'
                                : ''
                            "
                          ></div>
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="form_calories">
                          {{ $t("mealItems.formFields.calorie") }}
                          <i
                            class="fa fa-question-circle-o"
                            v-b-tooltip.hover
                            :title="$t('mealItems.formFields.tooltip.calorie')"
                          ></i>
                        </label>
                        <b-form-input
                          type="text"
                          id="form_calories"
                          v-model="detail.calories"
                          :state="formSubmitted ? !!detail.calories : null"
                          :placeholder="$t('mealItems.formFields.calorie')"
                          :prepend="'oz'"
                        ></b-form-input>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="form_size">
                          {{ $t("mealItems.formFields.size") }}
                          <i
                            class="fa fa-question-circle-o"
                            v-b-tooltip.hover
                            :title="$t('mealItems.formFields.tooltip.size')"
                          ></i>
                        </label>
                        <b-form-input
                          type="text"
                          id="form_size"
                          v-model="detail.size"
                          :state="formSubmitted ? !!detail.size : null"
                          :placeholder="$t('mealItems.formFields.size')"
                        ></b-form-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-1 line-item-action-buttons">
                    <span
                      v-if="mealDetails.length > 1"
                      class="add-button"
                      @click="removeMealDetail(index)"
                    >
                      {{ "-" }}
                    </span>
                    <span
                      class="add-button"
                      v-if="mealDetails.length - 1 === index"
                      @click="addMealDetail()"
                    >
                      {{ "+" }}
                    </span>
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
  mealItemsService,
  mealCategoryService,
  ingredientService,
  dietCategoryService,
  goalsService,
} from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        description: "",
        image_menu: null,
        image_menu_url: null,
        image_item: null,
        image_item_url: null,
      },
      form_result: {
        id: null,
        name: null,
        description: null,
        image_menu: null,
        image_item: null,
      },
      formSubmitted: false,
      mealItemsId: "",
      selectedMealItems: [],
      selectedCategories: [],
      selectedIngredients: [],
      mealCategoryList: [],
      ingredientsList: [],
      dietCategoryList: [],
      goalsList: [],
      mealDetails: [
        {
          id: null,
          dietCategoryId: null,
          dietCategoryList: [],
          goalsId: null,
          calories: null,
          size: null,
        },
      ],
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
    ...mapGetters("user", ["getMealItems"]),
  },
  methods: {
    removeFile(type) {
      this.$set(this.form, type + "_url", null);
      this.$set(this.form, type, null);
    },
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      this.formSubmitted = true;
      if (this.validateForm()) {
        var formData = new FormData();
        formData.append("name", this.form.name);
        formData.append("description", this.form.description);
        formData.append("image_menu", this.form.image_menu);
        formData.append("image_item", this.form.image_item);
        this.selectedCategories.forEach((x) => {
          formData.append("meal_category_ids", x.id);
        });
        this.selectedIngredients.forEach((x) =>
          formData.append("ingredient_ids", x.id)
        );
        let i = 0;
        this.mealDetails.forEach((x) => {
          if (x.dietCategoryId && x.goalsId && x.calories && x.size) {
            formData.append(
              "details[" + i + "].dietCategoryId",
              x.dietCategoryId.id
            );
            formData.append("details[" + i + "].goalId", x.goalsId.id);
            formData.append("details[" + i + "].calories", x.calories);
            formData.append("details[" + i + "].size", x.size);
            i++;
          }
        });
        this.setLoadingState(true);
        if (this.mealItemsId) {
          formData.append("id", this.form.id);
          mealItemsService.updateMealItems(formData, this.mealItemsId).then(
            () => {
              this.setLoadingState(false);
              this.successModal(this.$t("mealItems.updateSuccess"));
              // this.resetForm();
            },
            () => {
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        } else {
          mealItemsService.createMealItems(formData).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("mealItems.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "mealItemsList" });
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
    populateDietCategories(details) {
      details.dietCategoryId = null;
      if (!details.goalsId) {
        details.dietCategoryList = [];
        return;
      }
      let dietList = this.filteredList(details.goalsId.id);

      this.setLoadingState(true);
      details.dietCategoryList = [...dietList];
      this.setLoadingState(false);
    },
    filteredList(id) {
      return this.dietCategoryList.filter((x) =>
        x.goalsDietCategories.find((y) => y.goalsId === id)
      );
    },
    async checkForm() {
      if (
        this.mealCategoryList.length &&
        this.ingredientsList.length &&
        this.dietCategoryList.length &&
        this.goalsList.length
      ) {
        this.checkConditions();
        return;
      }

      this.setLoadingState(true);

      await Promise.all([
        mealCategoryService.getAll().then((response) => {
          this.mealCategoryList = response.data.data;
        }),
        ingredientService.getAll().then((response) => {
          this.ingredientsList = response.data.data;
        }),
        dietCategoryService.getAll().then((response) => {
          this.dietCategoryList = response.data.data;
        }),
        goalsService.getAll().then((response) => {
          this.goalsList = response.data.data;
        }),
      ]);

      this.checkConditions();
      this.setLoadingState(false);
    },
    checkConditions() {
      this.mealItemsId = this.$route.params.id || "";
      if (this.mealItemsId) {
        let selectedMealItems = this.getMealItems;
        if (selectedMealItems) {
          this.form.id = selectedMealItems.id;
          this.form.name = selectedMealItems.name;
          this.form.description = selectedMealItems.description;
          this.form.image_menu_url = selectedMealItems.imageMenu;
          this.form.image_item_url = selectedMealItems.imageItem;
          this.selectedCategories = selectedMealItems.mealCategories;
          this.selectedIngredients = selectedMealItems.ingredients;

          if (selectedMealItems.details && selectedMealItems.details.length) {
            this.mealDetails = [];
          }
          selectedMealItems.details.forEach((item) => {
            let diet = this.dietCategoryList.find(
              (x) => x.id === item.dietCategoryId
            );
            let dietList = this.filteredList(item.goalsId);
            this.mealDetails.push({
              id: item.id,
              dietCategoryId: diet || null,
              dietCategoryList: dietList || [],
              goalsId: { ...this.goalsList.find((x) => x.id === item.goalsId) },
              calories: item.calories,
              size: item.size,
            });
          });
        } else if (this.$route.name == "mealItemsUpdate") {
          this.$router.push({ name: "mealItemsList" });
        }
      }
    },
    validateForm() {
      if (this.mealItemsId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.description =
        this.form.description !== "" &&
        this.form.description.length <= this.constants.maxCharacter.large;
      this.form_result.image_menu =
        this.form.image_menu !== null || this.form.image_menu_url !== null;
      this.form_result.image_item =
        this.form.image_item !== null || this.form.image_item_url !== null;
      let ingredientState = this.selectedIngredients.length > 0;
      let categoryState = this.selectedCategories.length > 0;
      let detailsState = this.validateDetails();
      return ![
        Object.values(this.form_result),
        ingredientState,
        categoryState,
        detailsState,
      ].includes(false);
    },
    validateDetails() {
      let status = true;
      this.mealDetails.forEach((x) => {
        if (!x.dietCategoryId || !x.goalsId || !x.calories || !x.size) {
          status = false;
        }
      });
      return status;
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        description: "",
        image_menu: null,
        image_menu_url: null,
        image_item: null,
        image_item_url: null,
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
        description: null,
      };
      if (!this.mealItemsId) {
        this.form_result.image_menu = null;
        this.form_result.image_item = null;
      }

      this.mealDetails = [
        {
          id: null,
          dietCategoryId: null,
          dietCategoryList: [],
          goalsId: null,
          calories: null,
          size: null,
        },
      ];
      this.formSubmitted = false;
      this.selectedCategories = [];
      this.selectedIngredients = [];
    },
    checkLastItemOfMealDetail() {
      let item = this.mealDetails[this.mealDetails.length - 1];
      let isValid =
        item.dietCategoryId && item.goalsId && item.calories && item.size;
      if (!isValid) {
        this.failureToast(this.$t("mealItems.mealDetailError"));
      }
      return isValid;
    },
    addMealDetail() {
      if (this.checkLastItemOfMealDetail()) {
        this.mealDetails.push({
          id: "",
          dietCategoryId: "",
          dietCategoryList: [],
          goalsId: "",
          calories: "",
          size: "",
        });
      }
    },
    removeMealDetail(index) {
      this.mealDetails.splice(index, 1);
    },
  },
};
</script>
<style>
.add-button {
  border-radius: 50%;
  background-color: #dad6ff;
  color: var(--theme-default);
  width: 3rem;
  height: 3rem;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.line-item-action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  gap: 1rem;
}
</style>
