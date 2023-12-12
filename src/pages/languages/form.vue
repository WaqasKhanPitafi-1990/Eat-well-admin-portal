<template>
  <div>
    <Breadcrumbs
      :main="$t('language.heading')"
      :mainLink="'languageList'"
      :title="
        $t('language.' + (languageId ? 'updateLanguage' : 'createLanguage'))
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
                      {{ $t("language.formFields.name") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_name"
                      v-model="form.name"
                      :state="
                        form_result.name &&
                        form.name.length < constants.maxCharacter.small
                      "
                      :placeholder="$t('language.formFields.name')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.name ? form.name.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_nameAr">
                      {{ $t("language.formFields.nameAr") }}
                    </label>
                    <b-form-input
                      type="text"
                      id="form_nameAr"
                      v-model="form.nameAr"
                      :state="
                        form_result.nameAr &&
                        form.nameAr.length < constants.maxCharacter.small
                      "
                      :placeholder="$t('language.formFields.nameAr')"
                    ></b-form-input>
                    Max Characters:
                    {{
                      (form.nameAr ? form.nameAr.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="form_code">
                      {{ $t("language.formFields.code") }}
                    </label>
                    <b-input-group>
                      <b-form-input
                        type="text"
                        id="form_code"
                        v-model="form.code"
                        :state="
                          form_result.code &&
                          form.code.length < constants.maxCharacter.small
                        "
                        :placeholder="$t('language.formFields.code')"
                      ></b-form-input>
                    </b-input-group>
                    Max Characters:
                    {{
                      (form.code ? form.code.length : 0) +
                      "/" +
                      constants.maxCharacter.small
                    }}
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
import { languageService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        name: "",
        nameAr: "",
        code: "",
      },
      form_result: {
        name: null,
        nameAr: null,
        code: null,
      },
      languageId: "",
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
    ...mapGetters("user", ["getLanguage"]),
  },
  methods: {
    onCustomStyleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        this.setLoadingState(true);
        if (this.languageId) {
          languageService
            .updateLanguage({
              ...this.form,
              id: this.languageId,
            })
            .then(
              () => {
                this.setLoadingState(false);
                this.successModal(this.$t("language.updateSuccess"));
              },
              (error) => {
                console.log("httperror  => ", error);
                this.setLoadingState(false);
                this.failureModal();
              }
            );
        } else {
          languageService.createLanguage(this.form).then(
            () => {
              this.setLoadingState(false);
              this.confirmModal(
                this.$t("language.createSuccess"),
                this.$t("yes"),
                this.$t("no")
              ).then((res) => {
                res.value
                  ? this.resetForm()
                  : this.$router.push({ name: "languageList" });
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
      this.languageId = this.$route.params.id || "";
      if (this.languageId) {
        let selectedLanguage = this.getLanguage;
        if (selectedLanguage) {
          this.form.name = selectedLanguage.name;
          this.form.nameAr = selectedLanguage.nameAr;
          this.form.code = selectedLanguage.code;
        } else if (this.$route.name == "languageUpdate") {
          this.$router.push({ name: "languageList" });
        }
      }
    },
    validateForm() {
      this.form_result.name =
        this.form.name !== "" &&
        this.form.name.length <= this.constants.maxCharacter.small;
      this.form_result.nameAr =
        this.form.nameAr !== "" &&
        this.form.nameAr.length <= this.constants.maxCharacter.small;
      this.form_result.code =
        this.form.code !== "" &&
        this.form.code.length <= this.constants.maxCharacter.small;
      return !Object.values(this.form_result).includes(false);
    },
    resetForm() {
      //resetting the result form object
      this.form_result.name = null;
      this.form_result.nameAr = null;
      this.form_result.code = null;

      //resetting the form object that hold the input values
      this.form.name = "";
      this.form.nameAr = "";
      this.form.code = "";
    },
  },
};
</script>