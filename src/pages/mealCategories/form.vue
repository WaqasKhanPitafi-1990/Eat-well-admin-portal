<template>
  <div>
    <Breadcrumbs
      :main="$t('mealCategory.heading')"
      :mainLink="'mealCategoryList'"
      :title="
        $t(
          'mealCategory.' +
            (mealCategoryId ? 'updateMealCategory' : 'createMealCategory')
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
                  <div class="col-md-12 mb-4">
                    <label for="form_name">
                      {{ $t("mealCategory.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('mealCategory.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="text-center">
                      <label for="form_state">
                        {{ $t("mealCategory.formFields.image") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('mealCategory.formFields.imageTooltip') +
                            constants.icons.values.join('/')
                          "
                        ></i>
                      </label>
                      <div class="cutom-input-without-browse">
                        <b-form-file
                          id="form_image"
                          :state="form_result.image"
                          placeholder="Choose file..."
                          drop-placeholder="Drop file here..."
                          @change="
                            previewImage(
                              $event,
                              form,
                              'image',
                              'Url',
                              'image',
                              constants.icons
                            )
                          "
                          accept="image/*"
                        ></b-form-file>
                        <label for="form_image" data-browse="Browse">
                          <img
                            class="pointer"
                            v-if="form.imageUrl"
                            data-browse="Browse"
                            :src="getImageUrl(form.imageUrl)"
                            :alt="$t('imageNotLoaded')"
                          />
                          <feather
                            class="pointer"
                            style="width: 100px"
                            v-else
                            type="upload"
                          ></feather>
                          <template v-if="form.imageUrl">
                            <div class="file-buttons">
                              <i
                                @click="removeFile('image')"
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
                        {{ $t("mealCategory.formFields.selectedImage") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('mealCategory.formFields.imageTooltip') +
                            constants.icons.values.join('/')
                          "
                        ></i>
                      </label>
                      <div class="cutom-input-without-browse">
                        <b-form-file
                          id="form_selectedImage"
                          :state="form_result.selectedImage"
                          placeholder="Choose file..."
                          drop-placeholder="Drop file here..."
                          @change="
                            previewImage(
                              $event,
                              form,
                              'selectedImage',
                              'Url',
                              'image',
                              constants.icons
                            )
                          "
                          accept="image/*"
                        ></b-form-file>
                        <label for="form_selectedImage" data-browse="Browse">
                          <img
                            class="pointer"
                            v-if="form.selectedImageUrl"
                            data-browse="Browse"
                            :src="getImageUrl(form.selectedImageUrl)"
                            :alt="$t('imageNotLoaded')"
                          />
                          <feather
                            class="pointer"
                            style="width: 100px"
                            v-else
                            type="upload"
                          ></feather>
                          <template v-if="form.selectedImageUrl">
                            <div class="file-buttons">
                              <i
                                @click="removeFile('selectedImage')"
                                class="fa fa-times pointer"
                              ></i>
                            </div>
                          </template>
                        </label>
                      </div>
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
import { mealCategoryService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        image: null,
        imageUrl: null,
        selectedImage: null,
        selectedImageUrl: null,
      },
      form_result: {
        id: null,
        name: null,
        image: null,
        selectedImage: null,
      },
      mealCategoryId: "",
      selectedMealCategory: [],
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
    ...mapGetters("user", ["getMealCategory"]),
  },
  methods: {
    removeFile(type) {
      this.$set(this.form, type + "Url", null);
      this.$set(this.form, type, null);
    },
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        var formData = new FormData();
        formData.append("name", this.form.name);
        formData.append("image", this.form.image);
        formData.append("selectedImage", this.form.selectedImage);
        this.setLoadingState(true);
        if (this.mealCategoryId) {
          formData.append("id", this.form.id);
          mealCategoryService
            .updateMealCategory(formData, this.mealCategoryId)
            .then(
              () => {
                this.setLoadingState(false);
                this.successModal(this.$t("mealCategory.updateSuccess"));
                // this.resetForm();
              },
              () => {
                this.setLoadingState(false);
                this.failureModal();
              }
            );
        } else {
          mealCategoryService.createMealCategory(formData).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("mealCategory.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "mealCategoryList" });
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
      this.mealCategoryId = this.$route.params.id || "";
      if (this.mealCategoryId) {
        let selectedMealCategory = this.getMealCategory;
        if (selectedMealCategory) {
          this.form.id = selectedMealCategory.id;
          this.form.name = selectedMealCategory.name;
          this.form.imageUrl = selectedMealCategory.image;
          this.form.selectedImageUrl = selectedMealCategory.selectedImage;
        } else if (this.$route.name == "mealCategoryUpdate") {
          this.$router.push({ name: "mealCategoryList" });
        }
      }
    },
    validateForm() {
      if (this.mealCategoryId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.image =
        this.form.image !== null || this.form.imageUrl !== null;
      this.form_result.selectedImage =
        this.form.selectedImage !== null || this.form.selectedImageUrl !== null;
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        image: null,
        imageUrl: null,
        selectedImage: null,
        selectedImageUrl: null,
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
      };
      if (!this.mealCategoryId) {
        this.form_result.image = null;
        this.form_result.selectedImage = null;
      }
    },
  },
};
</script>