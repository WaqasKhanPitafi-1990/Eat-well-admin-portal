<template>
  <div>
    <Breadcrumbs
      :main="$t('userAddress.heading')"
      :mainLink="'userAddressList'"
      :title="
        $t(
          'userAddress.' +
            (userAddressId ? 'updateUserAddress' : 'createUserAddress')
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
                      {{ $t("userAddress.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('userAddress.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_userId">
                      {{ $t("userAddress.formFields.userId") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_userId"
                      v-model="form.userId"
                      :state="form_result.userId"
                      :placeholder="$t('userAddress.formFields.userId')"
                    ></b-form-input>
                  </div>
                  <div class="col-md-10 mb-4">
                    <label for="form_address">
                      {{ $t("userAddress.formFields.address") }}
                    </label>
                    <b-form-textarea
                      id="form_address"
                      rows="5"
                      max-rows="10"
                      v-model="form.address"
                      :state="
                        form_result.address &&
                        form.address.length <= constants.maxCharacter.large
                      "
                      :placeholder="$t('userAddress.formFields.address')"
                    ></b-form-textarea>
                    Max Characters:
                    {{
                      (form.address ? form.address.length : 0) +
                      "/" +
                      constants.maxCharacter.large
                    }}
                  </div>
                  <div class="col-md-2">
                    <div class="text-center mb-3">
                      <label for="form_isDefault">
                        {{ $t("userAddress.formFields.isDefault") }}
                      </label>
                      <div class="form-control border-0">
                        <feather
                          @click="form.isDefault = !form.isDefault"
                          class="pointer"
                          :class="{
                            'pointer-toggle-right': form.isDefault,
                            'pointer-toggle-left': !form.isDefault,
                          }"
                          :type="
                            form.isDefault ? 'toggle-right' : 'toggle-left'
                          "
                        ></feather>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4" v-if="isAddressTypeAllowed">
                    <label for="form_goal">
                      {{ $t("userAddress.formFields.addressType") }}
                    </label>
                    <div class="custom-validation">
                      <multiselect
                        v-model="form.addressType"
                        :options="addressTypesList"
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
                            ? form_result.addressType
                              ? 'is-valid'
                              : 'is-invalid'
                            : ''
                        "
                      ></div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_city">
                      {{ $t("userAddress.formFields.city") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_city"
                      v-model="form.city"
                      :state="
                        form_result.city &&
                        form.city.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('userAddress.formFields.city')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.city ? form.city.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_state">
                      {{ $t("userAddress.formFields.state") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_state"
                      v-model="form.state"
                      :state="
                        form_result.state &&
                        form.state.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('userAddress.formFields.state')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.state ? form.state.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_country">
                      {{ $t("userAddress.formFields.country") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_country"
                      v-model="form.country"
                      :state="
                        form_result.country &&
                        form.country.length <= constants.maxCharacter.small
                      "
                      :placeholder="$t('userAddress.formFields.country')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.country ? form.country.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_lat">
                      {{ $t("userAddress.formFields.lat") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_lat"
                      v-model="form.lat"
                      :state="form_result.lat"
                      :placeholder="$t('userAddress.formFields.lat')"
                    ></b-form-input>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_lng">
                      {{ $t("userAddress.formFields.lng") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_lng"
                      v-model="form.lng"
                      :state="form_result.lng"
                      :placeholder="$t('userAddress.formFields.lng')"
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
import { addressTypesService, userAddressService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        id: "",
        userId: "",
        name: "",
        addressType: null,
        isDefault: true,
        address: "",
        state: "",
        city: "",
        country: "",
        lat: "",
        lng: "",
      },
      form_result: {
        id: null,
        name: null,
        userId: null,
        addressType: null,
        address: null,
        state: null,
        city: null,
        country: null,
        lat: null,
        lng: null,
      },
      isAddressTypeAllowed: false,
      formSubmitted: false,
      userAddressId: "",
      selectedUserAddress: [],
      addressTypesList: [],
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
    ...mapGetters("user", ["getUserAddress"]),
  },
  methods: {
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      this.formSubmitted = true;
      if (this.validateForm()) {
        let payload = {
          name: this.form.name,
          isDefault: this.form.isDefault,
          userId: this.form.userId,
          addressType: this.isAddressTypeAllowed
            ? this.form.addressType.id
            : null,
          address: this.form.address,
          state: this.form.state,
          city: this.form.city,
          country: this.form.country,
          lat: this.form.lat,
          lng: this.form.lng,
        };
        this.setLoadingState(true);
        if (this.userAddressId) {
          payload = {
            ...payload,
            id: this.form.id,
          };
          userAddressService
            .updateUserAddress(payload, this.userAddressId)
            .then(
              () => {
                this.setLoadingState(false);
                this.successModal(this.$t("userAddress.updateSuccess"));
                // this.resetForm();
              },
              () => {
                this.setLoadingState(false);
                this.failureModal();
              }
            );
        } else {
          userAddressService.createUserAddress(payload).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("userAddress.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "userAddressList" });
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
      if (!this.isAddressTypeAllowed) {
        this.checkConditions();
        return;
      }
      if (this.addressTypesList.length) {
        this.checkConditions();
        return;
      }
      this.setLoadingState(true);
      addressTypesService.getAll().then(
        (response) => {
          this.addressTypesList = response.data.data;
          this.setLoadingState(false);
          this.checkConditions();
        },
        () => {
          this.setLoadingState(false);
        }
      );
    },
    checkConditions() {
      this.userAddressId = this.$route.params.id || "";
      if (this.userAddressId) {
        let selectedUserAddress = this.getUserAddress;
        if (selectedUserAddress) {
          this.form.id = selectedUserAddress.id;
          this.form.name = selectedUserAddress.name || "";
          this.form.isDefault = selectedUserAddress.isDefault;
          this.form.userId = selectedUserAddress.userId || "";
          if (this.isAddressTypeAllowed)
            this.form.addressType = selectedUserAddress.addressType;
          this.form.address = selectedUserAddress.address || "";
          this.form.state = selectedUserAddress.state || "";
          this.form.city = selectedUserAddress.city || "";
          this.form.country = selectedUserAddress.country || "";
          this.form.lat = selectedUserAddress.lat || "";
          this.form.lng = selectedUserAddress.lng || "";
        } else if (this.$route.name == "userAddressUpdate") {
          this.$router.push({ name: "userAddressList" });
        }
      }
    },
    validateForm() {
      if (this.userAddressId) {
        this.form_result.id = this.form.id !== "";
      }
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.userId = this.form.userId != "";
      this.form_result.addressType = this.isAddressTypeAllowed
        ? this.form.addressType != null
        : true;
      this.form_result.address =
        this.form.address != "" &&
        this.form.address.length <= this.constants.maxCharacter.large;
      this.form_result.state =
        this.form.state != "" &&
        this.form.state.length <= this.constants.maxCharacter.small;
      this.form_result.city =
        this.form.city != "" &&
        this.form.city.length <= this.constants.maxCharacter.small;
      this.form_result.country =
        this.form.country != "" &&
        this.form.country.length <= this.constants.maxCharacter.small;
      this.form_result.lat = this.form.lat != "";
      this.form_result.lng = this.form.lng != "";
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form = {
        id: "",
        userId: "",
        name: "",
        addressType: null,
        isDefault: true,
        address: "",
        state: "",
        city: "",
        country: "",
        lat: "",
        lng: "",
      };
      //resetting the form object that hold the input values
      this.form_result = {
        id: null,
        name: null,
        userId: null,
        addressType: null,
        address: null,
        state: null,
        city: null,
        country: null,
        lat: null,
        lng: null,
      };
      this.formSubmitted = false;
    },
  },
};
</script>