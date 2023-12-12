<template>
  <div>
    <Breadcrumbs :title="$t('dashboard.heading')" />
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 box-col-12">
          <div class="card custom-full-height-card">
            <div class="card-header flex-inline">
              <h5>{{ $t("dashboard.filters") }}</h5>
              <div
                v-if="
                  platformSelectedFilters.length || moduleSelectedFilters.length
                "
                class="reset-button"
                @click="resetFilters"
              >
                {{ $t("dashboard.reset") }}
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <h5>{{ $t("dashboard.platform") }}</h5>
                  <multiselect
                    v-model="platformSelectedFilters"
                    :tag-placeholder="
                      $t('dashboard.multiselect.addPlaceholder')
                    "
                    :placeholder="$t('dashboard.multiselect.selectPlaceholder')"
                    :selectLabel="$t('dashboard.multiselect.selectLabel')"
                    :deselectLabel="$t('dashboard.multiselect.deselectLabel')"
                    label="platformListName"
                    track-by="platformListId"
                    :options="platformOptions"
                    :multiple="multiSelectFilterEnabled"
                    :taggable="true"
                    @input="addTagPlatform"
                  ></multiselect>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <h5>{{ $t("dashboard.module") }}</h5>
                  <multiselect
                    v-model="moduleSelectedFilters"
                    :tag-placeholder="
                      $t('dashboard.multiselect.addPlaceholder')
                    "
                    :placeholder="$t('dashboard.multiselect.selectPlaceholder')"
                    :selectLabel="$t('dashboard.multiselect.selectLabel')"
                    :deselectLabel="$t('dashboard.multiselect.deselectLabel')"
                    :label="getLocaleKey('moduleName')"
                    track-by="moduleId"
                    :options="moduleOptions"
                    :multiple="multiSelectFilterEnabled"
                    :taggable="true"
                    @input="addTagModule"
                    @remove="removeModuleFilter"
                  >
                    <template slot="option" slot-scope="props">
                      <div class="option__desc">
                        <span class="option__title">{{
                          props.option[getLocaleKey("moduleName")]
                        }}</span>
                      </div>
                    </template>
                  </multiselect>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <h5>{{ $t("dashboard.patient") }}</h5>
                  <multiselect
                    v-model="patientSelectedFilters"
                    :tag-placeholder="
                      $t('dashboard.multiselect.addPlaceholder')
                    "
                    :placeholder="$t('dashboard.multiselect.selectPlaceholder')"
                    :selectLabel="$t('dashboard.multiselect.selectLabel')"
                    :deselectLabel="$t('dashboard.multiselect.deselectLabel')"
                    :options="patientOptions"
                    :multiple="multiSelectFilterEnabled"
                    :taggable="true"
                    @input="addPatientFilter"
                    @remove="removePatientFilter"
                  ></multiselect>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-5 col-lg-6 col-md-12 box-col-12">
          <div class="row">
            <div class="col-md-12 box-col-12">
              <px-card :actions="false" class="">
                <div slot="headerCustom">
                  <div class="row">
                    <div class="col-8">
                      <h5>{{ $t("dashboard.moduleWiseStats") }}</h5>
                    </div>
                    <div class="col-4 text-right flex-inline-end">
                      <div
                        class="reset-button"
                        v-if="moduleSelectedFilters.length"
                        @click="resetModuleFilter"
                      >
                        {{ $t("dashboard.reset") }}
                      </div>
                      <div
                        class="reset-button"
                        v-if="barChartApply"
                        @click="applyChartFilters"
                      >
                        {{ $t("dashboard.apply") }}
                      </div>
                    </div>
                  </div>
                </div>
                <div slot="with-padding">
                  <div class="chart-container">
                    <div
                      id="columnchart text-center
                "
                    >
                      <div class="loader-box" v-if="!barChartData || loading">
                        <!-- style="height: 350px" -->
                        <div class="loader-side-by-side"></div>
                      </div>
                      <apexchart
                        v-else
                        type="bar"
                        height="350"
                        :options="barChartData.options"
                        :series="barChartData.series"
                      ></apexchart>
                    </div>
                  </div>
                </div>
              </px-card>
            </div>
            <div class="col-md-12 box-col-12">
              <px-card
                :actions="false"
                class="custom-full-height-card custom-flex-center-card-body"
              >
                <div slot="headerCustom">
                  <div class="row">
                    <div class="col-8">
                      <h5>{{ $t("dashboard.platformWiseStats") }}</h5>
                    </div>
                    <div class="col-4 text-right flex-inline-end">
                      <div
                        class="reset-button"
                        v-if="platformSelectedFilters.length"
                        @click="resetPlatformFilter"
                      >
                        {{ $t("dashboard.reset") }}
                      </div>
                      <div
                        class="reset-button"
                        v-if="donutChartApply"
                        @click="applyChartFilters"
                      >
                        {{ $t("dashboard.apply") }}
                      </div>
                    </div>
                  </div>
                </div>
                <div slot="with-padding">
                  <div class="chart-container">
                    <div id="donutchart">
                      <div class="loader-box" v-if="!donutChart || loading">
                        <!-- style="height: 350px" -->
                        <div class="loader-side-by-side"></div>
                      </div>

                      <apexchart
                        v-else
                        width="350"
                        type="donut"
                        :options="donutChart.chartOptions"
                        :series="donutChart.series"
                      ></apexchart>
                    </div>
                  </div>
                </div>
              </px-card>
            </div>
          </div>
        </div>
        <div class="col-xl-7 col-lg-6 col-md-12 box-col-12">
          <div class="card custom-full-height-card">
            <div class="card-header flex-inline">
              <h5>{{ $t("dashboard.data") }}</h5>

              <vue-excel-xlsx
                class="export-button "
                :data="tableData"
                :columns="tableHeader"
                :file-name="'filename'"
                :file-type="'xlsx'"
                :sheet-name="'sheetname'"
              >
                <div>
                  {{ $t("dashboard.export") }} <i class="fa fa-share"></i>
                </div>
              </vue-excel-xlsx>
            </div>
            <div class="card-body">
              <div
                class="best-seller-table responsive-tbl"
                v-if="(tableData && tableHeader) || loading"
              >
                <div class="item" v-if="tableData.length && tableHeader.length">
                  <div class="table-responsive product-list datatable-vue">
                    <table class="table table-bordernone ">
                      <thead>
                        <tr>
                          <th
                            v-for="(header, index) in tableHeader"
                            :key="'stats-table-header-' + index"
                          >
                            {{ header.label }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in tableData"
                          :key="'stats-table-item-' + index"
                        >
                          <td
                            v-for="(header, index) in tableHeader"
                            :key="
                              'stats-table-item-' + index + '-' + header.field
                            "
                          >
                            <div class="d-inline-block align-middle">
                              <div class="d-inline-block">
                                <span
                                  v-if="
                                    item[header.field] != null &&
                                    item[header.field] != undefined
                                  "
                                  >{{ item[header.field] }}</span
                                >
                                <span v-else>-</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="noData">
                  <h5>{{ $t("dashboard.noData") }}</h5>
                </div>
              </div>
              <div class="loader-box" v-else style="height: 100%">
                <div class="loader-side-by-side"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
</template>

<script>
import { dashboardService } from "../services";

export default {
  data() {
    return {
      colors: [
        "rgba(115, 102, 255, 1)",
        "#f73164",
        "#51bb25",
        "#a927f9",
        "#f8d62b",
      ],
      chartNameIdSeparator: "%&%",
      multiSelectFilterEnabled: true,
      platformSelectedFilters: [],
      platformOptions: [],
      moduleOptions: [],
      moduleSelectedFilters: [],
      patientOptions: [],
      patientSelectedFilters: [],
      loading: false,
      barChartData: null,
      progressChartData: [],
      donutChart: null,
      moduleWiseStatsXAxisData: null,
      moduleWiseStatsYAxisData: null,
      platformWiseStatsXAxisData: null,
      platformWiseStatsYAxisData: null,
      platformWiseData: null,
      moduleWiseData: null,
      filters: {
        moduleId: [],
        platformListId: [],
        patId: [],
      },
      tableData: null,
      tableHeader: null,
      barChartApply: false,
      donutChartApply: false,
    };
  },
  mounted() {
    this.preProcessData();
  },
  watch: {
    "$i18n.locale": function () {
      this.loading = true;
      setTimeout(() => {
        this.processChartData();
        this.loading = false;
      }, 300);
    },
  },
  methods: {
    toggleValue(id, add = false) {
      if (this.filters.platformListId.includes(id)) {
        this.filters.platformListId = this.filters.platformListId.filter(
          (x) => x != id
        );
      } else {
        this.filters.platformListId.push(id);
      }
      if (add) {
        this.platformOptions.forEach((x) => {
          if (x.platformListId == id) {
            if (+x.selected) {
              x.selected = "0";
            } else {
              x.selected = "1";
            }
          }
        });
      }
    },
    resetModuleFilter() {
      this.moduleSelectedFilters = [];
      this.filters.moduleId = [];
      this.barChartApply = false;
      this.preProcessData();
    },
    applyChartFilters() {
      this.applyModuleFilter();
      this.applyPlatformFilter();
      this.preProcessData();
    },
    applyModuleFilter() {
      this.moduleSelectedFilters = [];
      this.barChartApply = false;
      this.filters.moduleId.forEach((id) => {
        let obj = this.moduleOptions.find((x) => x.moduleId == id);
        this.moduleSelectedFilters.push(obj);
      });
    },
    resetPlatformFilter() {
      this.platformSelectedFilters = [];
      this.filters.platformListId = [];
      this.barChartApply = false;
      this.preProcessData();
    },
    applyPlatformFilter() {
      this.platformSelectedFilters = [];
      this.donutChartApply = false;
      this.filters.platformListId.forEach((id) => {
        let obj = this.platformOptions.find((x) => x.platformListId == id);
        this.platformSelectedFilters.push(obj);
      });
    },
    resetFilters() {
      this.filters = {
        moduleId: [],
        platformListId: [],
        patId: [],
      };
      this.barChartApply = false;
      this.donutChartApply = false;

      this.platformSelectedFilters = [];
      this.moduleSelectedFilters = [];
      this.patientSelectedFilters = [];
      this.preProcessData();
    },
    addTagPlatform(query) {
      if (query)
        this.addPlatformFilter(query.map((item) => item.platformListId));
    },
    removeTagPlatform(query) {
      if (query) this.removePlatformFilter(query.platformListId);
    },
    addPlatformFilter(id) {
      this.filters.platformListId = id;
      this.preProcessData();
    },
    removePlatformFilter(id) {
      this.filters.platformListId = this.filters.platformListId.filter(
        (x) => x != id
      );
      this.platformSelectedFilters = [];
      this.filters.platformListId.forEach((id) => {
        let obj = this.platformOptions.find((x) => x.platformListId == id);
        this.platformSelectedFilters.push(obj);
      });
      this.preProcessData();
    },
    addTagModule(query) {
      if (query) this.addModuleFilter(query.map((item) => item.moduleId));
    },
    addModuleFilter(id) {
      this.filters.moduleId = id;
      this.preProcessData();
    },
    removeModuleFilter() {
      this.filters.moduleId = null;
      this.preProcessData();
    },
    addPatientFilter(id) {
      this.filters.patId = id;
      this.preProcessData();
    },
    removePatientFilter() {
      this.filters.patId = [];
      this.preProcessData();
    },
    preProcessData() {
      this.barChartData = null;
      this.donutChart = null;
      this.tableData = null;
      this.tableHeader = null;
      dashboardService.getFilteredRecord(this.filters).then(
        (res) => {
          if (res.data && res.data.status) {
            this.tableData = res.data.data;
            if (this.tableData && this.tableData.length) {
              this.processTableData();
              if (!this.patientOptions.length)
                this.tableData.forEach((item) => {
                  if (item.patId && !this.patientOptions.includes(item.patId)) {
                    this.patientOptions.push(item.patId);
                  }
                });

              this.processChartData();
            } else {
              this.noDataDashboard();
            }
          }
        },
        () => {
          this.noDataDashboard();
        }
      );
    },
    processChartData() {
      let vue = this;
      let moduleRawData = {};
      let platformRawData = {};
      this.tableData.forEach((item) => {
        if (!moduleRawData[item.moduleId]) {
          moduleRawData[item.moduleId] = {
            moduleNameEn: item.moduleNameEn,
            moduleNameAr: item.moduleNameAr,
            moduleUsageCount: 1,
            moduleId: item.moduleId,
          };
        } else {
          moduleRawData[item.moduleId].moduleUsageCount++;
        }

        if (!platformRawData[item.platformId]) {
          platformRawData[item.platformId] = {
            platformListName: item[this.getLocaleKey("platformName")],
            platformListUsageCount: 1,
            platformListId: item.platformId,
          };
        } else {
          platformRawData[item.platformId].platformListUsageCount++;
        }
      });
      this.moduleWiseData = Object.values(moduleRawData);

      this.moduleWiseStatsXAxisData = this.moduleWiseData.map(
        (x) => vue.chartNameIdSeparator + x.moduleId
      );
      this.moduleWiseStatsYAxisData = this.moduleWiseData.map(
        (x) => x.moduleUsageCount
      );

      this.platformWiseData = Object.values(platformRawData);
      this.platformWiseStatsXAxisData = this.platformWiseData.map(
        (x) => x.platformListName + vue.chartNameIdSeparator + x.platformListId
      );
      this.platformWiseStatsYAxisData = this.platformWiseData.map(
        (x) => x.platformListUsageCount
      );
      this.platformWiseData = this.platformWiseData;

      if (!this.moduleOptions.length) {
        this.moduleOptions = [...this.moduleWiseData];
      }
      if (!this.platformOptions.length) {
        this.platformOptions = this.platformWiseData.map((x) => {
          return {
            ...x,
            selected: "0",
          };
        });
      }
      this.barChartData = this.getBarChartData(
        this.moduleWiseStatsXAxisData,
        this.moduleWiseStatsYAxisData
      );
      this.donutChart = this.getDonutChartData(
        this.platformWiseStatsXAxisData,
        this.platformWiseStatsYAxisData
      );
    },
    processTableData() {
      let tableKeys = Object.keys(this.tableData[0]);
      if (tableKeys && tableKeys.length) {
        this.tableHeader = tableKeys.map((x) => {
          return {
            label: x
              .split(/(?=[A-Z])/)
              .join(" ")
              .toUpperCase(),
            field: x,
            dataFormat: x.toLowerCase().includes("atedat")
              ? this.dateFormat
              : null,
          };
        });
      }
    },
    noDataDashboard() {
      this.tableData = [];
      this.tableHeader = [];
      this.barChartData = this.getBarChartData([], []);
      this.donutChart = this.getDonutChartData([], []);
      this.moduleWiseStatsXAxisData = [];
      this.moduleWiseStatsYAxisData = [];
      this.platformWiseStatsXAxisData = [];
      this.platformWiseStatsYAxisData = [];
    },
    dateFormat(val) {
      return this.moment.utc(val).format("LLLL");
    },
    getBarChartData(xAxis, yAxis) {
      const vue = this;
      return {
        options: {
          responsive: [
            {
              breakpoint: 1368,
              options: {
                chart: {
                  height: 450,
                },
              },
            },
            {
              breakpoint: 768,
              options: {
                chart: {
                  height: 400,
                },
              },
            },
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 400,
                },
              },
            },
          ],
          chart: {
            type: "bar",
            toolbar: {
              show: true,
              tools: {
                download: true,
              },
              export: {
                csv: {
                  filename: "modulewisestats.csv",
                  columnDelimiter: ",",
                  headerCategory: "Category",
                  headerValue: "Value",
                  dateFormatter(timestamp) {
                    return new Date(timestamp).toDateString();
                  },
                },
                svg: {
                  filename: "modulewisestats.svg",
                },
                png: {
                  filename: "modulewisestats.png",
                },
              },
            },
            events: {
              dataPointSelection(event, chartContext, config) {
                // gets the position of the marker in the series
                const si = config.seriesIndex;
                let selectedDataPoints = config.selectedDataPoints[si];
                vue.filters.moduleId = [];
                vue.barChartApply = true;
                selectedDataPoints.forEach((point) => {
                  let id = xAxis[point].split(vue.chartNameIdSeparator)[1];
                  vue.filters.moduleId.push(id);
                });
              },
            },
          },
          states: {
            active: {
              allowMultipleDataPointsSelection: vue.multiSelectFilterEnabled,
            },
          },
          noData: {
            text: vue.$t("dashboard.noData"),
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: "14px",
              fontFamily: undefined,
            },
          },
          legend: {
            show: false,
          },
          colors: ["#005a9b"],
          dataLabels: {
            enabled: false,
          },
          plotOptions: {
            bar: {
              radius: 10,
              horizontal: false,
              columnWidth: "55%",
            },
          },
          stroke: {
            show: true,
            colors: ["transparent"],
            curve: "smooth",
            lineCap: "butt",
          },
          xaxis: {
            categories: xAxis,
            labels: {
              formatter: function (value) {
                if (value)
                {
                  let id = value.toString().split(vue.chartNameIdSeparator)[1];
                  let item =vue.moduleWiseData.find(x => x.moduleId == id);
                  return item[vue.getLocaleKey("moduleName")]
                }
              },
            },
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val.toFixed(0);
              },
            },
          },
          fill: {
            colors: ["#005a9b"],
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val;
              },
            },
          },
        },
        series: [
          {
            name: this.$t("dashboard.noOfUsers"),
            data: yAxis,
          },
        ],
      };
    },
    getDonutChartData(xAxis, yAxis) {
      let vue = this;
      return {
        chartOptions: {
          legend: {
            formatter: function (seriesName) {
              return seriesName.toString().split(vue.chartNameIdSeparator)[0];
            },
            position: "bottom",
          },
          chart: {
            type: "donut",
            toolbar: {
              show: true,
              tools: {
                download: true,
              },
              export: {
                csv: {
                  filename: "platformwisestats.csv",
                  columnDelimiter: ",",
                  headerCategory: "Category",
                  headerValue: "Value",
                  dateFormatter(timestamp) {
                    return new Date(timestamp).toDateString();
                  },
                },
                svg: {
                  filename: "platformwisestats.svg",
                },
                png: {
                  filename: "platformwisestats.png",
                },
              },
            },
            events: {
              dataPointSelection(event, chartContext, config) {
                const si = config.seriesIndex;
                let selectedDataPoints = config.selectedDataPoints[si];

                vue.filters.platformListId = [];
                vue.donutChartApply = true;
                selectedDataPoints.forEach((point) => {
                  let id = xAxis[point].split(vue.chartNameIdSeparator)[1];
                  vue.filters.platformListId.push(id);
                });
              },
            },
          },
          states: {
            active: {
              allowMultipleDataPointsSelection: vue.multiSelectFilterEnabled,
            },
          },
          noData: {
            text: vue.$t("dashboard.noData"),
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: "14px",
              fontFamily: undefined,
            },
          },
          labels: xAxis,
          responsive: [
            {
              breakpoint: 1600,
              options: {
                chart: {
                  width: 400,
                },
              },
            },
            {
              breakpoint: 1368,
              options: {
                chart: {
                  width: 400,
                },
              },
            },
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300,
                },
              },
            },
          ],
          colors: this.colors,
          tooltip: {
            enabled: true,
            y: {
              formatter: function (val) {
                return vue.$t("dashboard.noOfUsers") + ": " + val;
              },
              title: {
                formatter: function (seriesName) {
                  return (
                    seriesName.toString().split(vue.chartNameIdSeparator)[0] +
                    " | "
                  );
                },
              },
            },
          },
          plotOptions: {
            pie: {
              startAngle: 0,
              endAngle: 360,
              expandOnClick: false,
              offsetX: 0,
              offsetY: 0,
              customScale: 1,
              dataLabels: {
                offset: 0,
                minAngleToShowLabel: 10,
              },
              donut: {
                size: "55%",
                background: "transparent",
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: "22px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 600,
                    color: undefined,
                    offsetY: -10,
                    formatter: function (val) {
                      return val.toString().split(vue.chartNameIdSeparator)[0];
                    },
                  },
                  value: {
                    show: true,
                    fontSize: "16px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    color: undefined,
                    offsetY: 16,
                    formatter: function (val) {
                      return val;
                    },
                  },
                  total: {
                    show: true,
                    showAlways: false,
                    label: vue.$t("dashboard.total"),
                    fontSize: "22px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 600,
                    color: "#373d3f",
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce((a, b) => {
                        return a + b;
                      }, 0);
                    },
                  },
                },
              },
            },
          },
        },
        series: yAxis,
      };
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.noData {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.best-seller-table {
  height: 100%;
  .table-responsive {
    --barChartHeight: 350px;
    --barChartHeightPadding: 15px;
    --donutChartHeight: 215.7px;
    --padding: 40px;
    --margin: 30px;
    --text-height: 26.39px;
    max-height: calc(
      var(--barChartHeight) + var(--barChartHeightPadding) + var(--padding) +
        var(--padding) + var(--margin) + var(--text-height) +
        var(--donutChartHeight)
    );
    overflow: auto;
    @media (max-width: 1600px) {
      --donutChartHeight: 265.7px;
    }
    @media (max-width: 1368px) {
      --barChartHeight: 450px;
    }
    @media (max-width: 991px) {
      max-height: 400px;
    }
    thead {
      th {
        background: white;
        position: sticky;
        top: 0;
        z-index: 1;
        vertical-align: middle;
        word-wrap: normal;
      }
    }
  }
}
.flex-inline {
  display: flex !important;
  justify-content: space-between;
  flex-wrap: wrap;
}
.flex-inline-end {
  display: flex !important;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}
.reset-button {
  cursor: pointer;
}
.export-button {
  background: transparent;
  border: none !important;
  outline: none !important;
}
</style>