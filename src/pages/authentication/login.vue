<template>
  <div class="container-fluid">
    <div class="row">
      <div
        class="col-xl-7 b-center bg-size image-section"
        :style="{
          backgroundImage:
            'url(' +
            require('../../assets/images/login/imcbuilding.jpeg') +
            ')',
        }"
      >
        <img
          class="bg-img-cover bg-center"
          src="../../assets/images/login/imcbuilding.jpeg"
          alt="loginpage"
          style="display: none"
        />
      </div>
      <div class="col-xl-5 p-0">
        <div class="login-card">
          <div @click="switchLanguage" class="language-switcher">
            {{ layoutType == "ltr" ? "ع" : "En" }}
          </div>
          <div>
            <div>
              <a class="logo text-center">
                <img
                  class="img-fluid"
                  src="../../assets/images/logo/logo.png"
                  alt="loginpage"
                />
              </a>
            </div>
            <div class="login-main login-form-card login-res">
              <form method="POST" @submit="onSubmit" class="theme-form">
                <h4>{{ $t("login.heading") }}</h4>
                <p>{{ $t("login.subheading") }}</p>
                <div class="form-group">
                  <label class="col-form-label">{{
                    $t("login.fields.emailLabel")
                  }}</label>
                  <input
                    class="form-control"
                    type="email"
                    required=""
                    :placeholder="$t('login.fields.emailLabel')"
                    v-model="email"
                  />
                </div>
                <div class="form-group">
                  <label class="col-form-label">{{
                    $t("login.fields.passwordLabel")
                  }}</label>
                  <input
                    class="form-control"
                    :type="showPassword ? 'text' : 'password'"
                    name="login[password]"
                    required=""
                    v-model="password"
                    placeholder="*********"
                  />
                  <div class="show-hide" @click="showPassword = !showPassword">
                    <span :class="{ show: !showPassword }"> </span>
                  </div>
                </div>
                <div class="form-group mb-0">
                  <button
                    class="btn btn-primary btn-block loader-button"
                    :class="{ disabled: loading }"
                    type="submit"
                  >
                    {{ $t("login.signIn") }}
                    <div v-if="loading" class="loader-icon"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { authService, userService } from "../../services";
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loading: false,
      layoutType: "ltr",
    };
  },
  mounted() {
    this.layoutType = this.$i18n.locale == "en" ? "ltr" : "rtl";
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      if (this.loading) {
        return;
      }
      this.loading = true;
      authService.login(this.email, this.password).then(
        (response) => {
          this.loading = false;
          let res = response.data;
          if (!res.status) {
            this.$toasted.show(this.$t("error.invalidCredentials"), {
              theme: "bubble",
              position: "top-right",
              type: "error",
              duration: 2000,
            });
            return;
          }
          userService.storeLoginInfo(res.data, res.data.accessToken);
          this.$router.push({ name: "default" });
        },
        (error) => {
          console.error(error);
          this.$toasted.show(this.$t("error.somethingWentWrong"), {
            theme: "bubble",
            position: "top-right",
            type: "error",
            duration: 2000,
          });
          this.loading = false;
        }
      );
    },
    switchLanguage() {
      this.layoutType = this.layoutType == "ltr" ? "rtl" : "ltr";
      this.$store.dispatch("layout/setLayoutType", this.layoutType);
      this.$i18n.locale = this.layoutType == "rtl" ? "ar" : "en";
    },
  },
};
</script>
<style lang="scss" scoped>
.image-section {
  position: relative;
  background-size: cover;
  background-position: center center;
  display: block;
  &:before {
    content: "";
    background: linear-gradient(
      to top,
      rgba(246, 247, 249, 0),
      rgba(0, 90, 155, 0.35)
    );
    position: absolute;
    inset: 0;
  }
}
.language-switcher {
  position: absolute;
  right: -5px;
  top: 0.5rem;
  background: var(--theme-default);
  padding: 1rem;
  border-radius: 5px;
  color: var(--light);
  cursor: pointer;
}
</style>