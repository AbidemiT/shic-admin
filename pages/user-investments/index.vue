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
              <h3 class="mb-0">{{ headingTitle }}</h3>
            </div>
            <div class="col-6">
              <button
                v-if="showInvestmentUsers"
                class="btn btn-primary btn-sm"
                @click="
                  (showInvestmentUsers = false),
                    (headingTitle = 'Investments List')
                "
              >
                Back
              </button>
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
          <div class="table-responsive" v-if="!showInvestmentUsers">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">s/n</th>
                  <th scope="col">Investment</th>
                  <th scope="col">No. Of Investors</th>
                  <th scope="col">Investment Target</th>
                  <th scope="col">Amount Invested</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  @click="fetchInvestment(investment)"
                  v-for="(investment, i) in investments"
                  :key="i"
                >
                  <td>
                    {{ i + 1 }}
                  </td>
                  <td>
                    {{ `${investment.name}` }}
                  </td>
                  <td>{{ investment.active_investments_count }}</td>
                  <td>
                    ₦ {{ Number(investment.maximum_amount).toLocaleString() }}
                  </td>

                  <td>
                    ₦
                    {{
                      (
                        Number(investment.maximum_amount) -
                        Number(investment.leftover_amount)
                      ).toLocaleString()
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive" v-else>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">
                    Amount <br />
                    Deposited (₦)
                  </th>
                  <th scope="col">Depositor</th>
                  <th scope="col">Account No.</th>
                  <th scope="col">Depositor's Bank</th>
                </tr>
              </thead>
              <tbody v-if="investmentUsers">
                <tr v-for="(investment, i) in investmentUsers" :key="i">
                  <td>
                    {{ investment.user.name }}
                  </td>
                  <td>{{ investment.user.email }}</td>
                  <td
                    v-if="
                      investment.payment_data_transfer &&
                      investment.payment_method == 'transfer'
                    "
                  >
                    {{ investment.payment_data_transfer.amount_deposited }}
                  </td>
                  <td
                    v-if="
                      investment.payment_data_transfer &&
                      investment.payment_method == 'transfer'
                    "
                  >
                    {{
                      investment.payment_data_transfer.account_name_sent_from
                    }}
                  </td>
                  <td
                    v-if="
                      investment.payment_data_transfer &&
                      investment.payment_method == 'transfer'
                    "
                  >
                    {{
                      investment.payment_data_transfer.account_number_sent_from
                    }}
                  </td>
                  <td
                    v-if="
                      investment.payment_data_transfer &&
                      investment.payment_method == 'transfer'
                    "
                  >
                    {{ investment.payment_data_transfer.bank_name_sent_from }}
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
                          href="#"
                          v-if="!investment.status"
                          @click="approveUserInvestment"
                          >Approve Investment</a
                        >
                        <a class="dropdown-item" href="#" @click="confirmDelete"
                          >Delete Investment</a
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
                  <modal :show.sync="modals.modal1">
                    <h6
                      slot="header"
                      class="modal-title mb-0"
                      id="modal-title-default"
                    >
                      Delete User Investment
                    </h6>
                    <p>Are you sure you want to delete User Investment?</p>
                    <template slot="footer">
                      <base-button
                        type="primary"
                        @click="deleteUserInvestment"
                        >{{
                          deleteLoading
                            ? "Deleting User Investment..."
                            : "Delete User Investment"
                        }}</base-button
                      >
                      <base-button
                        type="link"
                        class="ml-auto"
                        @click="modals.modal1 = false"
                        >Close
                      </base-button>
                    </template>
                  </modal>
                </tr>
              </tbody>
            </table>
            <div
              slot="footer"
              class="
                col-12
                d-flex
                justify-content-center justify-content-sm-between
                flex-wrap
              "
            >
              <div class="">
                <!-- <p class="card-category">
              Showing {{ from + 1 }} to {{ to }} of {{ total }} entries

              <span v-if="selectedRows.length">
                &nbsp; &nbsp; {{ selectedRows.length }} rows selected
              </span>
            </p> -->
              </div>
              <nav aria-label="...">
                <ul class="pagination">
                  <li class="page-item" v-if="prevPage">
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Previous"
                      @click="prev"
                    >
                      <i class="fa fa-angle-left"></i>
                      <span class="sr-only">Previous</span>
                    </a>
                  </li>
                  <li class="page-item" v-if="nextPage">
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Next"
                      @click="next"
                    >
                      <i class="fa fa-angle-right"></i>
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
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
      headingTitle: "Investments List",
      selectedRows: [],
      // users: [],
      sort: "created_at",

      pagination: {
        perPage: 20,
      },
      approvalLoading: false,
      deleteLoading: false,
      showInvestmentUsers: false,
      total: 1,
      userSub: {
        status: 1,
        subscription_package_id: "",
        user_id: "",
        start_date: "",
      },
      investment: "",
      userInvestmentId: "",
      modals: {
        modal1: false,
      },
    };
  },
  mounted() {
    
  },
  computed: {
    searchInvestment() {
      if (this.investment === "") {
        return this.usersInvestment;
      } else {
        return this.usersInvestment.filter((investment) => {
          let investmentNameAndEmail = `${investment.investment_product.name} ${investment.user.email}`;
          return investmentNameAndEmail
            .toLowerCase()
            .includes(this.investment.toLowerCase());
        });
      }
    },
    ...mapGetters({
      nextPage: "investment/getNextPage",
      prevPage: "investment/getPrevPage",
      usersInvestment: "users/getUsersInvestment",
      investmentUsers: "investment/getInvestmentUsers",
      investments: "investment/getInvestments",
    }),
  },

  created() {
    // this.getList();
  },

  methods: {
    async next() {   
      let link = this.nextPage.split('/v1')
      let linkParam = link[1]
      let url = linkParam
      console.log({prev: this.prevPage});
     try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit(
          "investment/SET_INVESTMENT_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "investment/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "investment/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        
        this.$store.commit(
          "investment/SET_INVESTMENT_USERS_TOTAL",
          response.data.data.total
        );
      } catch (error) {
        console.log({error});
      }
    },
    async prev() {
      let link = this.prevPage.split('/v1')
      let linkParam = link[1]
      let url = linkParam
      console.log({url});
     try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit(
          "investment/SET_INVESTMENT_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "investment/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "investment/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        this.$store.commit(
          "investment/SET_INVESTMENT_USERS_TOTAL",
          response.data.data.total
        );
      } catch (error) {
        console.log({error});
        // this.$notify({
        //   type: "error",
        //   message: `${error.message}`,
        // });
      }
    },
    confirmDelete() {
      this.modals.modal1 = true;
    },
    setUserInvestmentId(setUserInvestmentId) {
      this.userInvestmentId = setUserInvestmentId;
    },
    async approveUserInvestment() {
      this.approvalLoading = true;
      let url = `/investment/investments/${this.userInvestmentId}`;

      try {
        let response = await this.$axios.put(url, { status: 1 });
        this.approvalLoading = false;
        console.log({ approvalResponse: response });
        this.$notify({
          type: "success",
          message: "Investment Approved",
        });
        this.$store.dispatch("users/getUsersInvestment");
      } catch (error) {
        console.log({ error });
        this.approvalLoading = false;
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
      this.deleteLoading = true;
      let url = `/investment/investments/${this.userInvestmentId}`;

      try {
        let response = await this.$axios.delete(url);
        this.deleteLoading = false;
        console.log({ approvalResponse: response });
        this.$store.dispatch("user/getUsersInvestment");
        this.$notify({
          type: "success",
          message: "Investment Deleted",
        });
        this.$store.dispatch("user/getUsersInvestment");
      } catch (error) {
        console.log({ error });
        this.deleteLoading = false;
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
    async fetchInvestment(investment) {
      let url = `/investment/get-investor-by-investment-product-all/${investment.id}/${this.pagination.perPage}`;

      try {
        let response = await this.$axios.get(url);
        console.log({ response });

        this.$store.commit(
          "investment/SET_INVESTMENT_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "investment/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "investment/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        this.$store.commit(
          "investment/SET_INVESTMENT_USERS_TOTAL",
          response.data.data.total
        );
        this.headingTitle = investment.name;
        this.showInvestmentUsers = true;
      } catch (error) {
        this.$notify({
          type: "error",
          message: `${error.message}`,
        });
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
