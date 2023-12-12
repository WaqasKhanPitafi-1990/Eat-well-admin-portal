<template>
  <div>
    <Breadcrumbs
      :main="$t('addressTypes.heading')"
      :mainLink="'addressTypesList'"
      :title="
        $t(
          'addressTypes.' +
            (addressTypesId ? 'updateAddressType' : 'createAddressType')
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
                      {{ $t("addressTypes.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('addressTypes.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <label for="form_activecode">
                        {{ $t("addressTypes.formFields.isActive") }}
                      </label>
                      <div class="form-control border-0">
                        <feather
                          @click="form.isActive = !form.isActive"
                          class="pointer"
                          :class="{
                            'pointer-toggle-right': form.isActive,
                            'pointer-toggle-left': !form.isActive,
                          }"
                          :type="form.isActive ? 'toggle-right' : 'toggle-left'"
                        ></feather>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <label for="form_state">
                        {{ $t("addressTypes.formFields.image") }}
                        <i
                          class="fa fa-question-circle-o"
                          v-b-tooltip.hover
                          :title="
                            $t('addressTypes.formFields.imageTooltip') +
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
import { addressTypesService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        image: null,
        isActive: true,
        imageUrl: null,
      },
      form_result: {
        id: null,
        name: null,
        image: null,
      },
      addressTypesId: "",
      selectedAddressTypes: [],
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
    ...mapGetters("user", ["getAddressTypes"]),
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
        formData.append("isActive", this.form.isActive);
        this.setLoadingState(true);
        if (this.addressTypesId) {
          formData.append("id", this.form.id);
          addressTypesService
            .updateAddressTypes(formData, this.addressTypesId)
            .then(
              () => {
                this.setLoadingState(false);
                this.successModal(this.$t("addressTypes.updateSuccess"));
                // this.resetForm();
              },
              () => {
                this.setLoadingState(false);
                this.failureModal();
              }
            );
        } else {
          addressTypesService.createAddressTypes(formData).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("addressTypes.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "addressTypesList" });
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
      this.addressTypesId = this.$route.params.id || "";
      if (this.addressTypesId) {
        let selectedAddressTypes = this.getAddressTypes;
        if (selectedAddressTypes) {
          this.form.id = selectedAddressTypes.id;
          this.form.name = selectedAddressTypes.name;
          this.form.imageUrl = selectedAddressTypes.image;
          this.form.isActive = selectedAddressTypes.isActive;
        } else if (this.$route.name == "addressTypesUpdate") {
          this.$router.push({ name: "addressTypesList" });
        }
      }
    },
    validateForm() {
      if (this.addressTypesId) {
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
        isActive: null,
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
      };
      if (!this.addressTypesId) {
        this.form_result.image = null;
      }
    },
  },
};
</script>