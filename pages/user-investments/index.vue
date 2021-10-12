<template>
  <div class="container-fluid mt-5">
    <div>
      <card
        class="no-border-card"
        body-classes="px-0 pb-1"
        footer-classes="pb-2"
      >
        <template slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Users List</h3>
            </div>
          </div>
        </template>
        <div>
          <!-- <div
            class="
              col-12
              d-flex
              justify-content-center justify-content-sm-between
              flex-wrap
              mb-4
            "
          >
            <el-select
              class="select-primary pagination-select"
              v-model="pagination.perPage"
              placeholder="Per page"
            >
              <el-option
                class="select-primary"
                v-for="item in pagination.perPageOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div> -->
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Investment</th>
                  <th scope="col">Amount <br> Deposited (₦)</th>
                  <th scope="col">Depositor</th>
                  <th scope="col">Depositor's Bank</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(investment, i) in usersInvestment" :key="i">
                  <td>
                    {{ `${investment.user.name}` }}
                  </td>
                  <td>{{ investment.user.email }}</td>
                  <td>
                    {{ investment.investment_product.name}}
                  </td>
                  <td>{{ investment.payment_data.amount_deposited }}</td>
                  <td>
                    {{investment.payment_data.account_name_sent_from}}
                  </td>
                  <td>
                    {{investment.payment_data.bank_name_sent_from}}
                  </td>
                  <td v-if="investment.status">
                    <span class="badge badge-success">Active</span>
                  </td>
                  <td v-else>
                    <span class="badge badge-warning">Pending</span>
                  </td>
                  <td>
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
                        @click="setUserInvestmentId(investment.id)"
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
                          href="#" v-if="!investment.status"
                          @click="approveUserInvestment"
                          >Approve Investment</a
                        >
                        <a
                          class="dropdown-item"
                          href="#" v-else
                          @click="deleteUserInvestment"
                          >Delete Investment</a
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
                  <!-- <modal :show.sync="modals.modal1">
                    <h6
                      slot="header"
                      class="modal-title mb-0"
                      id="modal-title-default"
                    >
                      Approve User
                    </h6>
                    <div class="form-group row">
                      <label
                        for="example-date-input"
                        class="col-md-6 col-form-label form-control-label"
                        >Subscriptions:</label
                      >
                      <div class="col-md-12">
                        <el-select
                        class="select-danger"
                        placeholder="Select Subscription"
                        v-model="userSub.subscription_package_id"
                      >
                        <el-option
                          v-for="option in [
                            { value: 1, label: 'Platinum' },
                            { value: 2, label: 'Gold' },
                            { value: 3, label: 'Starter' },
                          ]"
                          class="select-danger"
                          :value="option.value"
                          :label="option.label"
                          :key="option.label"
                        >
                        </el-option>
                      </el-select>
                      </div>
                      
                    </div>
                    <div class="form-group row">
                      <label
                        for="example-date-input"
                        class="col-md-6 col-form-label form-control-label"
                        >Start Date:</label
                      >
                      <div class="col-md-12">
                        <base-input
                          type="date"
                          value="2018-11-23"
                          id="example-date-input"
                          v-model="userSub.start_date"
                        />
                      </div>
                    </div>

                    <template slot="footer">
                      <base-button type="primary" @click="approveUser"
                        >{{ approvalLoading ? 'Approving User...' : 'Save changes'}}</base-button
                      >
                      <base-button
                        type="link"
                        class="ml-auto"
                        @click="modals.modal1 = false"
                        >Close
                      </base-button>
                    </template>
                  </modal> -->
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Modal Approve User -->

          <!-- <modal
                    name="approve_user_modal"
                    class="modal__view success_modal"
                    :width="390"
                    :height="170"
                  >
                    <div class="container">
                      <form class="row">
                        <div class="col">
                          hello
                        </div>
                      </form>
                    </div>
                  </modal> -->

          <!-- End Modal -->
        </div>
        <!-- <div
          slot="footer"
          class="
            col-12
            d-flex
            justify-content-center justify-content-sm-between
            flex-wrap
          "
        >
          <div class="">
            <p class="card-category">
              Showing {{ from + 1 }} to {{ to }} of {{ total }} entries

              <span v-if="selectedRows.length">
                &nbsp; &nbsp; {{ selectedRows.length }} rows selected
              </span>
            </p>
          </div>
          <base-pagination
            class="pagination-no-border"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          />
        </div> -->
      </card>
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
  middleware: 'redirect',
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
      selectedRows: [],
      // users: [],
      sort: "created_at",

      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
      },

      approvalLoading: false,

      total: 1,
      userSub: {
        status: 1,
        subscription_package_id: "",
        user_id: "",
        start_date: "",
      },
      userInvestmentId: "",
      modals: {
        modal1: false,
      },
    };
  },
  mounted() {
  },
  computed: {
    ...mapGetters({
      usersInvestment: "users/getUsersInvestment",
    }),
  },

  created() {
    // this.getList();
  },

  methods: {
    setUserInvestmentId(setUserInvestmentId) {
      console.log("Okay ooo");
      console.log({setUserInvestmentId});
      this.userInvestmentId = setUserInvestmentId;
    },
    async approveUserInvestment() {
      this.approvalLoading = true
      let url = `https://apiv1.smarthalalinvestorclub.com/api/v1/investment/investments/${this.userInvestmentId}`;

      try {
        let response = await this.$axios.put(url, {status: 1});
        this.approvalLoading = false
        console.log({ approvalResponse: response });
        this.$notify({
          type: "success",
          message: "Investment Approved",
        });
        this.$store.dispatch('users/getUsersInvestment')
      } catch (error) {
        console.log({ error });
        this.approvalLoading = false
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Approving Investment`,
          });
        }
      }
    },
    async deleteUserInvestment() {
      this.approvalLoading = true
      let url = `https://apiv1.smarthalalinvestorclub.com/api/v1/investment/investments/${this.userInvestmentId}`;

      try {
        let response = await this.$axios.delete(url);
        this.approvalLoading = false
        console.log({ approvalResponse: response });
        this.$notify({
          type: "success",
          message: "Investment Deleted",
        });
        this.$store.dispatch('user/getUsersInvestment')
      } catch (error) {
        console.log({ error });
        this.approvalLoading = false
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Deleting Investment`,
          });
        }
      }
    },
  },
};
</script>
<style>
#pro-feature {
  color: #5e72e4;
  font-weight: bold;
}
#pro-feature:hover {
  color: #233dd2;
}
</style>
