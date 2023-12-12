import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import Breadcrumbs from './components/bread_crumbs'
import { store } from './store';
import VueFeather from 'vue-feather';
import VueI18n from 'vue-i18n';
import VueSweetalert2 from 'vue-sweetalert2';
import Toasted from 'vue-toasted';
import VueApexCharts from 'vue-apexcharts';
import VueExcelXlsx from "vue-excel-xlsx";
import moment from 'moment'
import PerPage from "./components/per_page"
import Multiselect from "vue-multiselect";

Vue.prototype.moment = moment

import PxCard from './components/Pxcard.vue'
Vue.component(PxCard.name, PxCard)

Vue.component('perpage', PerPage)
Vue.component('multiselect', Multiselect)

// Multi Language Add
import en from './locales/en.json';
import ar from './locales/ar.json';
import { defaultLocale, localeOptions } from './constants/config';

// Import Theme scss
import './assets/scss/app.scss'

import interceptor from './interceptor'
import { userService } from './services'
interceptor();

Vue.use(VueFeather);
Vue.use(BootstrapVue);
Vue.use(VueExcelXlsx);
Vue.use(VueI18n);
Vue.use(VueSweetalert2);
Vue.component('apexchart', VueApexCharts);
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});

Vue.mixin({
  data() {
    return {
      restartEnabled: false,
      fileCheckResponse: false,
      constants: {
        orderStatus: {
          "-1": "CANCELLED",
          "0": "INACTIVE",
          "1": "ACTIVE",
          "2": "FREEZE",
          "3": "COMPLETED",
        },
        deliveryStatus: {
          "D": "DELIVERY",
          "P": "SELF_PICKUP",
        },
        lineItemStatus: {
          "1": "ORDER_PLACED",
          "2": "ACKNOWLEDGED",
          "3": "ASSIGNED_TO_CHEF",
          "4": "PROCESSING",
          "5": "READY_FOR_PICKUP",
          "6": "ASSIGNED_TO_DELIVERY_BOY",
          "7": "PICKED",
          "8": "DELIVERED",
          "9": "RETURNED",
        },
        paymentStatus: {
          "1": "PENDING",
          "3": "COMPLETED",
          "-2": "CANCELLED",
          "0": "ERROR",
          "-9": "FAILED_PAYMENT",
        },
        images: {
          validation: "validation.only_image",
          values: ['png', 'jpg', 'jpeg']
        },
        icons: {
          validation: "validation.only_svg",
          values: ['svg']
        },
        // these widths are in rem
        customTableColumnWidth: {
          name: 7,
          description: 14
        },
        maxCharacter: {
          small: 50,
          medium: 100,
          large: 250,
        }
      },
    }
  },
  methods: {
    getLocaleKey: function (key, wordCase = "camel") {
      let postKey = this.$i18n.locale == "ar" ? "Ar" : "En";
      if (wordCase == "upper") {
        postKey = postKey.toUpperCase();
      } else if (wordCase == "lower") {
        postKey = postKey.toLowerCase();
      }
      return key + postKey;
    },
    getCurrentLang() {
      return this.$i18n.locale;
    },
    confirmModal(title, confirmText, cancelText) {
      return this.$swal({
        text: title || this.$t('areYouSure'),
        type: 'question',
        showCancelButton: true,
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
        cancelButtonText: cancelText || this.$t("cancel"),
        cancelButtonColor: "#4466f2",
      });
    },
    successModal(title, confirmText) {
      this.$swal({
        text: title || this.$t('changesDone'),
        type: 'success',
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2"
      });
    },
    failureModal(title, confirmText) {
      this.$swal({
        text: title || this.$t('error.somethingWentWrong'),
        type: 'error',
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2"
      });
    },
    failureToast(message) {
      this.$toasted.show(message || this.$t("error.somethingWentWrong"), {
        theme: "bubble",
        position: "top-right",
        type: "error",
        duration: 5000,
      });
    },
    setLoadingState(state) {
      this.$store.dispatch('user/setLoading', state);
    },
    download(url) {
      userService.downloadFile(url);
    },
    serverRestartRequired(flag = undefined) {
      if (flag == true) {
        localStorage.setItem('restartRequired', flag)
      } else if (flag == false) (
        localStorage.removeItem('restartRequired')
      )
      return localStorage.getItem('restartRequired')
    },
    async checkUploadFileValidation(file) {
      try {
        let sizeInBytes = file.size;
        let sizeInKb = sizeInBytes / 1024;
        let sizeInMb = sizeInKb / 1024;
        let maxSizeInMb = 5;
        if (sizeInMb > maxSizeInMb) {
          const error_msg = this.$t("validation.image_file_size_1024", { size: maxSizeInMb });
          this.failureToast(error_msg)
          this.fileCheckResponse = true;
        }
        /**
         * 500x500 image validation
         * commented because it is not necessary in our current scenario
         */
        // else if (file_type == 'image' && await this.readFileAsync(file)) {
        //   this.failureToast(this.$t("validation.image_dem_500_500"));
        //   this.fileCheckResponse = true;
        // }

        return this.fileCheckResponse;
      } catch (err) {
        console.log(err);
      }
    },
    getImageUrl(value) {
      if (!value) return;
      if (value.startsWith("blob")) {
        return value;
      } else {
        return process.env.VUE_APP_SERVER + value;
      }
    },
    async previewImage(evt, form, key, subkey, fileType, allowedExtensions) {
      const file = evt.target.files[0];
      await this.checkUploadFileValidation(file, fileType);
      if (this.fileCheckResponse) {
        this.fileCheckResponse = false;
      } else if (file.type.includes(fileType)) {
        let imageExtension = file.type.split("/")[1].split("+")[0].split(".")[0];
        if (allowedExtensions.values.includes(imageExtension)) {
          form[key + subkey] = URL.createObjectURL(file);
          form[key] = file;
        } else {
          this.failureToast(this.$t(allowedExtensions.validation));
        }
      } else {
        this.failureToast(this.$t("validation.invalide_file"));
      }
    },
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            let img_width = img.width;
            let img_height = img.height;
            if (img_width > 500 || img_height > 500) {
              resolve(true);
            }
            reject(false)
          }
        };
      })
    },
    getTableValue(val) {
      if (val && val.length > 50) {
        return val.substring(0, 50) + '...'
      } else {
        return val
      }
    },
    getTableSeparator(index) {
      return index == 0 ? '' : ', ';
    },
    getTableValueFromArray(data, key) {
      let result = '';
      let keySplit = key.split('.')
      let isArray = Array.isArray(data);

      if (isArray) {
        if (data && data.length > 0) {
          data.forEach((item, index) => {
            let temp = item;
            keySplit.forEach(k => {
              temp = temp[k]
            })
            result += this.getTableSeparator(index) + temp;
          })
        }
      } else {
        let temp = data;
        keySplit.forEach(k => {
          temp = temp[k]
        })
        result = temp;
      }
      return result;
    }
  },
})

Vue.component('Breadcrumbs', Breadcrumbs)

const messages = { en: en, ar: ar };
const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')