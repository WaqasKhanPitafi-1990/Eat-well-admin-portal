<template>
  <div>
    <Breadcrumbs :title="$t('addressTypes.heading')" />
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <b-row>
                <b-col sm="6">
                  <b-input-group class="datatable-btn ew-search-box">
                    <b-form-input
                      v-model="filter"
                      :placeholder="$t('typeToSearch')"
                      type="search"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">
                        <i class="fa fa-times"></i>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-col>

                <b-col sm="6">
                  <perpage />
                </b-col>
              </b-row>
              <div class="table-responsive datatable-vue">
                <b-table
                  show-empty
                  sticky-header
                  :items="items"
                  :fields="tablefields"
                  :filter="filter"
                  :current-page="currentPage"
                  :per-page="getPerPageSelection"
                  @filtered="onFiltered"
                  :busy="isBusy"
                >
                  <template #table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong> {{ $t("loading") }}...</strong>
                    </div>
                  </template>

                  <template #head()="data">
                    <div
                      :style="
                        data.field.width
                          ? 'min-width: ' + data.field.width + 'rem'
                          : ''
                      "
                    >
                      {{ data.label.toUpperCase() }}
                    </div>
                  </template>
                  <template #cell()="data">
                    <template v-if="data.field.key == 'action'">
                      <div class="action-buttons">
                        <feather
                          @click="deleteAddressTypes(data)"
                          class="pointer"
                          type="trash"
                        ></feather>
                        <feather
                          @click="editAddressTypes(data)"
                          class="pointer"
                          type="edit"
                        ></feather>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        data.field.key.toLowerCase().includes('active')
                      "
                    >
                      <feather
                        :class="{
                          'pointer-toggle-right': data.value,
                          'pointer-toggle-left': !data.value,
                        }"
                        :type="data.value ? 'toggle-right' : 'toggle-left'"
                      ></feather>
                    </template>
                    <template
                      v-else-if="data.field.key.toLowerCase().includes('image')"
                    >
                      <div class="preview-image">
                        <img
                          class="table-img"
                          :src="getImageUrl(data.value)"
                          alt="img"
                        />
                      </div>
                    </template>
                    <template v-else>{{
                      getTableValue(data.value) || "-"
                    }}</template>
                  </template>
                </b-table>
              </div>

              <b-col md="6" class="my-1 p-0">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="getPerPageSelection"
                  class="my-0"
                  v-if="getPerPageSelection"
                ></b-pagination>
                <b-pagination v-else class="my-0"> </b-pagination>
              </b-col>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
</template>

<script>
import { addressTypesService } from "../../services";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      tablefields: [],

      items: [],

      filter: null,

      isBusy: false,
      totalRows: 1,
      currentPage: 1,
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.tablefields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    ...mapGetters("user", ["getPerPageSelection"]),
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions("user", ["setAddressTypes"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    fetchData() {
      // Set the initial number of items
      this.isBusy = true;
      this.setLoadingState(true);
      addressTypesService.getAll().then(
        (response) => {
          this.items = response.data.data;
          this.totalRows = this.items.length;
          this.tablefields = [];
          if (this.items && this.items.length)
            Object.keys(this.items[0]).forEach((key) => {
              if (key.toLowerCase() != "subcategories") {
                this.tablefields.push({
                  key: key,
                  label: key
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/_/g, " "),
                  sortable: true,
                });
              }
            });
          if (this.tablefields.length) {
            this.tablefields.push({
              key: "action",
              label: "Action",
            });
          }
          this.setLoadingState(false);
          this.isBusy = false;
        },
        (error) => {
          this.setLoadingState(false);
          this.isBusy = false;
          console.log("httperror  => ", error);
        }
      );
    },
    deleteAddressTypes(item) {
      this.confirmModal(this.$t("addressTypes.deleteConfirm")).then(
        (result) => {
          if (result.value) {
            this.setLoadingState(true);
            addressTypesService.deleteAddressTypes(item.item).then(
              () => {
                this.items = [
                  ...this.items.filter((x) => x.id != item.item.id),
                ];
                this.setLoadingState(false);
                this.serverRestartRequired(true);
                this.successModal(this.$t("addressTypes.deleteSuccess"));
              },
              (error) => {
                console.log("httperror  => ", error);
                this.setLoadingState(false);
                this.failureToast(this.$t("error.somethingWentWrong"));
              }
            );
          }
        }
      );
    },
    editAddressTypes(item) {
      this.setAddressTypes(item.item);
      this.$router.push("/address-types/update/" + item.item.id);
    },
  },
};
</script>