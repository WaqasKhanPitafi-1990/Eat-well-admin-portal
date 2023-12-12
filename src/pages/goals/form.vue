<template>
  <div>
    <Breadcrumbs
      :main="$t('goals.heading')"
      :mainLink="'goalsList'"
      :title="$t('goals.' + (goalId ? 'updateGoals' : 'createGoals'))"
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
                      {{ $t("goals.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('goals.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_description">
                      {{ $t("goals.formFields.description") }}
                    </label>
                    <b-input-group>
                      <b-form-textarea
                        type="text"
                        id="form_description"
                        rows="5"
                        max-rows="10"
                        v-model="form.description"
                        :state="
                          form_result.description &&
                          form.description.length <=
                            constants.maxCharacter.large
                        "
                        :placeholder="$t('goals.formFields.description')"
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
                        {{ $t("goals.formFields.image") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('goals.formFields.imageTooltip') +
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
                            :src="getImageUrl(this.form.imageUrl)"
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
import { goalsService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        description: "",
        image: null,
        imageUrl: null,
      },
      form_result: {
        id: null,
        name: null,
        description: null,
        image: null,
      },
      goalId: "",
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
    ...mapGetters("user", ["getGoal"]),
  },
  methods: {
    removeFile(type) {
      if (type == "image") {
        this.$set(this.form, "imageUrl", null);
        this.$set(this.form, "image", null);
      }
    },
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        var formData = new FormData();
        formData.append("name", this.form.name);
        formData.append("description", this.form.description);
        formData.append("image", this.form.image);

        this.setLoadingState(true);
        if (this.goalId) {
          formData.append("id", this.form.id);
          goalsService.updateGoal(formData, this.goalId).then(
            () => {
              this.setLoadingState(false);
              this.successModal(this.$t("goals.updateSuccess"));
              // this.resetForm();
            },
            (error) => {
              console.log("httperror  => ", error);
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        } else {
          goalsService.createGoal(formData).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("goals.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "goalsList" });
              });
            },
            (error) => {
              console.log("httperror  => ", error);
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        }
      }
    },
    checkForm() {
      this.goalId = this.$route.params.id || "";
      if (this.goalId) {
        let selectedGoal = this.getGoal;
        if (selectedGoal) {
          this.form.id = selectedGoal.id;
          this.form.name = selectedGoal.name;
          this.form.description = selectedGoal.description;
          this.form.imageUrl = selectedGoal.image;
        } else if (this.$route.name == "goalsUpdate") {
          this.$router.push({ name: "goalsList" });
        }
      }
    },
    validateForm() {
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.description =
        this.form.description !== "" &&
        this.form.description.length <= this.constants.maxCharacter.large;
      if (this.goalId) {
        this.form_result.id = this.form.id !== "";
      } else {
        this.form_result.image = this.form.image !== null;
      }
      this.form_result.image =
        this.form.image !== null || this.form.imageUrl !== null;
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        description: "",
        image: null,
        imageUrl: null,
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
        description: null,
      };
      if (!this.goalId) {
        this.form_result.image = null;
      }
    },
  },
};
</script>