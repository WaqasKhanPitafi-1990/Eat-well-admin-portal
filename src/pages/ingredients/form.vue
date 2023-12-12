<template>
  <div>
    <Breadcrumbs
      :main="$t('ingredient.heading')"
      :mainLink="'ingredientList'"
      :title="
        $t(
          'ingredient.' +
            (ingredientId ? 'updateIngredient' : 'createIngredient')
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
                      {{ $t("ingredient.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('ingredient.formFields.name')"
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
                        {{ $t("ingredient.formFields.image") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('ingredient.formFields.imageTooltip') +
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
import { ingredientService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        image: null,
        imageUrl: null,
      },
      form_result: {
        id: null,
        name: null,
        image: null,
      },
      ingredientId: "",
      selectedIngredient: [],
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
    ...mapGetters("user", ["getIngredient"]),
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
        this.setLoadingState(true);
        if (this.ingredientId) {
          formData.append("id", this.form.id);
          ingredientService.updateIngredient(formData, this.ingredientId).then(
            () => {
              this.setLoadingState(false);
              this.successModal(this.$t("ingredient.updateSuccess"));
              // this.resetForm();
            },
            () => {
              this.setLoadingState(false);
              this.failureModal();
            }
          );
        } else {
          ingredientService.createIngredient(formData).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("ingredient.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "goalsList" });
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
      this.ingredientId = this.$route.params.id || "";
      if (this.ingredientId) {
        let selectedIngredient = this.getIngredient;
        if (selectedIngredient) {
          this.form.id = selectedIngredient.id;
          this.form.name = selectedIngredient.name;
          this.form.imageUrl = selectedIngredient.image;
        } else if (this.$route.name == "ingredientUpdate") {
          this.$router.push({ name: "ingredientList" });
        }
      }
    },
    validateForm() {
      if (this.ingredientId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.image =
        this.form.image !== null || this.form.imageUrl !== null;
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        name: "",
        image: null,
        imageUrl: null,
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
      };
      if (!this.ingredientId) {
        this.form_result.image = null;
      }
    },
  },
};
</script>