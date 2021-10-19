<template>
  <div class="container-fluid mt-5">
    <div v-if="!investmentForm">
      <card
        class="no-border-card"
        body-classes="px-0 pb-1"
        footer-classes="pb-2"
      >
        <template slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Investments</h3>
            </div>
            <div class="col-6">
              <div
                class="btn btn-sm btn-secondary"
                @click="toggleInvestmentForm"
              >
                New Investment
              </div>
            </div>
          </div>
        </template>
        <div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Investment ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Min Amount (₦)</th>
                  <th scope="col">Max Amount (₦)</th>
                  <th scope="col">Category</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(investment, i) in investments" :key="i">
                  <td>
                    {{ investment.id }}
                  </td>
                  <td>
                    {{ investment.name }}
                  </td>
                  <td>
                    {{ Number(investment.minimum_amount).toLocaleString() }}
                  </td>
                  <td>
                    {{ Number(investment.maximum_amount).toLocaleString() }}
                  </td>
                  <td>{{ investment.investment_category.name }}</td>
                  <td v-if="investment.status">
                    <span class="badge badge-success">Active</span>
                  </td>
                  <td v-else>
                    <span class="badge badge-warning">Closed</span>
                  </td>
                  <td>{{ investment.start_date }}</td>
                  <td>{{ investment.end_date }}</td>
                  <!-- <td>
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
                        @click="setInvestmentId(investment.id)"
                      >
                        <i class="fas fa-ellipsis-v mt-2"></i>
                      </span>
                      <el-dropdown-menu
                        class="dropdown-menu dropdown-menu-arrow show"
                        role="list"
                        slot="dropdown"
                      >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="modals.modal1 = true"
                          >Approve User</a
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </card>
    </div>
    <div v-else>
      <div class="row mb-5">
        <div class="col-6">
          <h3 class="mb-0">New Investment</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form @submit.prevent="newInvestment">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="investmentName"
                    class="col-md-6 col-form-label form-control-label"
                    >Investment Name:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.name"
                      required
                      id="investmentName"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="id"
                    class="col-md-6 col-form-label form-control-label"
                    >Category ID:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.investment_category_id"
                      required
                      id="id"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="example-date-input"
                    class="col-md-6 col-form-label form-control-label"
                    >ROI:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.roi"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="investmentBanner"
                    class="col-md-6 col-form-label form-control-label"
                    >Investment Banner:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.banner_link"
                      required
                      id="investmentBanner"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="InvestmentDocument"
                    class="col-md-6 col-form-label form-control-label"
                    >Investment Document:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.document_links"
                      required
                      id="InvestmentDocument"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="minimumAmount"
                    class="col-md-6 col-form-label form-control-label"
                    >Minimum Amount:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.minimum_amount"
                      required
                      id="minimumAmount"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="maximumInvestment"
                    class="col-md-6 col-form-label form-control-label"
                    >Maximum Amount:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentData.maximum_amount"
                      required
                      id="maximumInvestment"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="duration"
                    class="col-md-6 col-form-label form-control-label"
                    >Duration</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" in Months e.g 1 Month, 12 Months"
                      v-model="investmentData.duration"
                      required id="duration"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="investmentDescription"
                    class="col-md-6 col-form-label form-control-label"
                    >Status</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" 1 for Active, 0 for Closed"
                      v-model="investmentData.status"
                      required
                      id="investmentDescription"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="startDate"
                    class="col-md-6 col-form-label form-control-label"
                    >Start Date:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="date"
                      placeholder="Start Date"
                      id="startDate"
                      v-model="investmentData.start_date"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="endDate"
                    class="col-md-6 col-form-label form-control-label"
                    >End Date:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="date"
                      placeholder="ENd Date"
                      id="endDate"
                      v-model="investmentData.end_date"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-8">
                <div class="form-group row align-items-end">
                  <label
                    for="investmentDescription"
                    class="col-md-6 col-form-label form-control-label"
                    >Description</label
                  >
                  <div class="col-md-12">
                    <textarea
                      class="form-control"
                      id="investmentDescription"
                      rows="3"
                      placeholder=""
                      v-model="investmentData.description"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div
                  class="
                    form-group
                    row
                    h-50
                    justify-content-end
                    align-items-end
                  "
                >
                  <div class="col-md-6 text-right">
                    <button class="btn-sm btn-primary">
                      {{newInvestmentLoading ? 'Creating New Investment' : 'Save New Investment'}}
                    </button>
                  </div>
                  <div class="col-md-6 text-right">
                    <button
                      class="btn-sm btn-danger"
                      @click="toggleInvestmentForm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BasePagination } from "@/components/argon-core";
import { mapGetters } from "vuex";
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Tooltip,
  Select,
  Option,
  Button,
} from "element-ui";

export default {
  middleware: "redirect",
  layout: "DashboardLayout",

  components: {
    BasePagination,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
  },

  data() {
    return {
      newInvestmentLoading: false,
      investmentForm: false,
      investmentData: {
        name: "",
        start_date: "",
        end_date: "",
        investment_category_id: "",
        maximum_amount: "",
        minimum_amount: "",
        roi: "",
        description: "",
        duration: "",
        dollar: "0",
        status: "",
        banner_link: "",
        document_links: ""
      },
      investments: null,
      modals: {
        modal1: false,
      },
    };
  },
  created() {
    this.fetchInvestments();
  },
  methods: {
    toggleInvestmentForm() {
      this.investmentForm = !this.investmentForm;
    },
    async newInvestment() {
      let url = "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_product";
      this.newInvestmentLoading = true
      this.investmentForm = false
      console.log({dataData: this.investmentData});

      try {
        let response = await this.$axios.post(url, this.investmentData);
        console.log({ responseSave: response });
        this.newInvestmentLoading = false
        this.fetchInvestments();
        this.$notify({
          type: "success",
          message: `Investment created Successfully`,
        });
      } catch (error) {
          this.newInvestmentLoading = false
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Fetching Categories`,
          });
        }
      }
    },

    // setUserId(userId) {
    //   console.log("Okay ooo");
    //   console.log(userId);
    //   this.userId = userId;
    // },
    async fetchInvestments() {
      let url = "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_product"
    //   let url = "http://209.97.136.114/api/v1/investment/_product";

      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.investments = response.data.data;
      } catch (error) {
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Fetching Categories`,
          });
        }
      }
    },
  },
};
</script>
<style>
</style>
