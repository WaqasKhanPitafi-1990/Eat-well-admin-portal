<template>
  <div>
    <Breadcrumbs
      :main="$t('dietCategory.heading')"
      :mainLink="'dietCategoryList'"
      :title="
        $t(
          'dietCategory.' +
            (dietCategoryId ? 'updateDietCategory' : 'createDietCategory')
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
                  <div class="col-md-4 mb-4">
                    <label for="form_name">
                      {{ $t("dietCategory.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('dietCategory.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_goalId">
                      {{ $t("dietCategory.formFields.goalId") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="form.goals"
                        :options="goalsList"
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
                          'is-invalid': form_result.goals == false,
                          'is-valid': form_result.goals == true,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="col-md-2 mb-4">
                    <label for="form_headingColor">
                      {{ $t("dietCategory.formFields.headingColor") }}
                    </label>
                    <b-form-input
                      type="color"
                      id="form_headingColor"
                      v-model="form.headingColor"
                      :state="form_result.headingColor"
                      :placeholder="$t('dietCategory.formFields.headingColor')"
                    ></b-form-input>
                  </div>
                  <div class="col-md-12 mb-4">
                    <label for="form_description">
                      {{ $t("dietCategory.formFields.description") }}
                    </label>
                    <b-input-group>
                      <b-form-textarea
                        id="form_description"
                        rows="5"
                        max-rows="10"
                        v-model="form.description"
                        :state="
                          form_result.description &&
                          form.description.length <=
                            constants.maxCharacter.large
                        "
                        :placeholder="$t('dietCategory.formFields.description')"
                      ></b-form-textarea>
                    </b-input-group>
                    Max Characters:
                    {{
                      (form.description ? form.description.length : 0) +
                      "/" +
                      constants.maxCharacter.large
                    }}
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="text-center">
                      <label for="form_state">
                        {{ $t("dietCategory.formFields.image") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('dietCategory.formFields.imageTooltip') +
                            constants.images.values.join('/')
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
                              constants.images
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
                        {{ $t("dietCategory.formFields.bgImage") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('dietCategory.formFields.imageTooltip') +
                            constants.icons.values.join('/')
                          "
                        ></i>
                      </label>
                      <div class="cutom-input-without-browse">
                        <b-form-file
                          id="form_bgImage"
                          :state="form_result.bgImage"
                          placeholder="Choose file..."
                          drop-placeholder="Drop file here..."
                          @change="
                            previewImage(
                              $event,
                              form,
                              'bgImage',
                              'Url',
                              'image',
                              constants.icons
                            )
                          "
                          accept="image/*"
                        ></b-form-file>
                        <label for="form_bgImage" data-browse="Browse">
                          <img
                            class="pointer"
                            v-if="form.bgImageUrl"
                            data-browse="Browse"
                            :src="getImageUrl(form.bgImageUrl)"
                            :alt="$t('imageNotLoaded')"
                          />
                          <feather
                            class="pointer"
                            style="width: 100px"
                            v-else
                            type="upload"
                          ></feather>
                          <template v-if="form.bgImageUrl">
                            <div class="file-buttons">
                              <i
                                @click="removeFile('bgImage')"
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
import { dietCategoryService, goalsService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        description: "",
        headingColor: "",
        goals: [],
        image: null,
        imageUrl: null,
        bgImage: null,
        bgImageUrl: null,
      },
      form_result: {
        id: null,
        name: null,
        description: null,
        headingColor: null,
        goals: null,
        image: null,
        bgImage: null,
      },
      dietCategoryId: "",
      goalsList: [],
      selectedDietCategory: [],
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
    ...mapGetters("user", ["getDietCategory"]),
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
        formData.append("description", this.form.description);
        formData.append("headingColor", this.form.headingColor);
        formData.append("image", this.form.image);
        formData.append("bgImage", this.form.bgImage);
        this.form.goals.forEach((goal) => {
          formData.append("goalIds", goal.id);
        });
        this.setLoadingState(true);
        if (this.dietCategoryId) {
          formData.append("id", this.form.id);
          dietCategoryService
            .updateDietCategory(formData, this.dietCategoryId)
            .then(
              () => {
                this.setLoadingState(false);
                this.successModal(this.$t("dietCategory.updateSuccess"));
                // this.resetForm();
              },
              () => {
                this.setLoadingState(false);
                this.failureModal();
              }
            );
        } else {
          dietCategoryService.createDietCategory(formData).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("dietCategory.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "dietCategoryList" });
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
      if (this.goalsList.length) {
        this.checkConditions();
        return;
      }
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
    },
    checkConditions() {
      this.dietCategoryId = this.$route.params.id || "";
      if (this.dietCategoryId) {
        let selectedDietCategory = this.getDietCategory;
        if (selectedDietCategory) {
          this.form.id = selectedDietCategory.id;
          this.form.name = selectedDietCategory.name;
          this.form.description = selectedDietCategory.description;
          this.form.headingColor = selectedDietCategory.headingColor;
          this.form.imageUrl = selectedDietCategory.image;
          this.form.bgImageUrl = selectedDietCategory.bgImage;
          this.form.goals = [];
          selectedDietCategory.goalsDietCategories.forEach((goal) => {
            let goalObj = this.goalsList.find(
              (item) => item.id == goal.goalsId
            );
            if (goalObj) {
              this.form.goals.push(goalObj);
            }
          });
        } else if (this.$route.name == "dietCategoryUpdate") {
          this.$router.push({ name: "dietCategoryList" });
        }
      }
    },
    validateForm() {
      if (this.dietCategoryId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.description =
        this.form.description !== "" &&
        this.form.description.length <= this.constants.maxCharacter.large;
      this.form_result.goals = this.form.goals.length > 0;
      this.form_result.headingColor = this.form.headingColor !== "";
      this.form_result.image =
        this.form.image !== null || this.form.imageUrl !== null;
      this.form_result.bgImage =
        this.form.bgImage !== null || this.form.bgImageUrl !== null;
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        description: "",
        headingColor: "",
        goals: [],
        image: null,
        imageUrl: null,
        bgImage: null,
        bgImageUrl: null,
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
        description: null,
        headingColor: null,
        goals: null,
      };
      if (!this.dietCategoryId) {
        this.form_result.image = null;
        this.form_result.bgImage = null;
      }
    },
  },
};
</script>