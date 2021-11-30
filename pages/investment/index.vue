<template>
  <div class="container-fluid mt-5">
    <div class="row justify-content-end my-4">
      <div class="col-6 text-right">
        <button
          class="btn btn-sm btn-success"
          @click="toggleInvestmentForm"
          v-if="!investmentForm && !investmentUpdateForm"
        >
          New Investment
        </button>
      </div>
    </div>
    <div v-if="!investmentForm && !investmentUpdateForm">
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
                  <th scope="col">Status</th>
                  <th scope="col">Campaign Start Date</th>
                  <th scope="col">Investment Start date</th>
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
                  <td>
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
                        @click="
                          setInvestmentId(investment.id),
                            setInvestment(investment)
                        "
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
                          @click="modals.modal2 = true"
                          >Payout</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="investmentUpdateForm = true"
                          >Edit Investment</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="modals.modal1 = true"
                          >Delete Investment</a
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
            <modal :show.sync="modals.modal2">
              <h6
                slot="header"
                class="modal-title mb-0"
                id="modal-title-default"
              >
                PayOut
              </h6>
              <input
                type="text"
                class="form-control"
                :class="payoutPercentageErr ? 'border-danger' : ''"
                v-model="payoutPercentage"
                placeholder="Payout percentage"
                required
              />
              <small v-if="payoutPercentageErr">{{payoutPercentageErr}}</small>
              <template slot="footer">
                <base-button type="primary" @click="modals.modal3 = true"
                  >Add Payout Percentage
                </base-button>
                <base-button
                  type="link"
                  class="ml-auto"
                  @click="modals.modal2 = false"
                  >Close
                </base-button>
              </template>
            </modal>
            <modal :show.sync="modals.modal3">
              <h6
                slot="header"
                class="modal-title mb-0"
                id="modal-title-default"
              >
                PayOut Confirmation
              </h6>
              <p>Are you sure you want to add Payout Percentage? NB: Your Action is Irreversible</p>
              <template slot="footer">
                <base-button type="primary" @click="addPayoutPercent">{{
                  payoutPercentLoading ? "Adding Payout percentage..." : "Yes"
                }}</base-button>
                <base-button
                  type="link"
                  class="ml-auto"
                  @click="modals.modal3 = false, modals.modal2 = false"
                  >Close
                </base-button>
              </template>
            </modal>
            <modal :show.sync="modals.modal1">
              <h6
                slot="header"
                class="modal-title mb-0"
                id="modal-title-default"
              >
                Delete Investment
              </h6>
              <p>Are you sure you want to delete Investment?</p>
              <template slot="footer">
                <base-button type="primary" @click="deleteInvestment">{{
                  deleteInvestmentLoading
                    ? "Deleting Investment..."
                    : "Delete Investment"
                }}</base-button>
                <base-button
                  type="link"
                  class="ml-auto"
                  @click="modals.modal1 = false"
                  >Close
                </base-button>
              </template>
            </modal>
          </div>
        </div>
      </card>
    </div>
    <div v-else-if="!investmentUpdateForm">
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
                    <!-- <base-input
                      type="text"
                      v-model="investmentData.investment_category_id"
                      required
                      id="id"
                    /> -->

                    <el-select
                      class="select-danger"
                      placeholder="Select Investment Category"
                      v-model="investmentData.investment_category_id"
                      required
                      id="id"
                    >
                      <el-option
                        v-for="category in categories"
                        class="select-danger"
                        :value="String(category.id)"
                        :label="category.name"
                        :key="category.id"
                      >
                      </el-option>
                    </el-select>
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
              <div class="col-md-4">
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
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="maximumInvestment"
                    class="col-md-6 col-form-label form-control-label"
                    >Investment Access:</label
                  >
                  <div class="col-md-12">
                    <!-- <base-input
                      type="text"
                      v-model="investmentData.maximum_amount"
                      required
                      id="maximumInvestment"
                    /> -->
                    <div class="form-group row">
                      <div
                        class="col-md-3 custom-control custom-checkbox pl-4"
                        v-for="(subscription, i) in subscriptions"
                        :key="i"
                      >
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          :id="subscription.name"
                          v-model="investmentData.access"
                          :value="subscription.id"
                        />
                        <label
                          class="custom-control-label"
                          :for="subscription.name"
                          >{{ subscription.name }}</label
                        >
                      </div>
                      <!-- <div class="col-md-3 custom-control custom-checkbox pl-4">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="none"
                        v-model="investmentAccess.access"
                        value="null"
                        @change="checkAll"
                      />
                      <label class="custom-control-label" for="none"
                        >All</label
                      >
                    </div> -->
                    </div>
                    <!-- <small>{{ investmentAccess.access }}</small> -->
                  </div>
                </div>
              </div>
              <div class="col-md-4">
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
                      required
                      id="duration"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="investmentStatus"
                    class="col-md-6 col-form-label form-control-label"
                    >Status</label
                  >
                  <div class="col-md-12">
                    <el-select
                      class="select-danger"
                      placeholder="Select Investment Status"
                      v-model="investmentData.status"
                      required
                      id="investmentStatus"
                    >
                      <el-option
                        v-for="option in [
                          { value: 1, label: 'Active' },
                          { value: 0, label: 'Closed' },
                        ]"
                        class="select-danger"
                        :value="option.value"
                        :label="option.label"
                        :key="option.label"
                      >
                      </el-option>
                    </el-select>
                    <!-- <base-input
                      type="text"
                      placeholder=" 1 for Active, 0 for Closed"
                      v-model="investmentData.status"
                      required
                      id="investmentDescription"
                    /> -->
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="startDate"
                    class="col-md-6 col-form-label form-control-label"
                    >Campaign Start Date:</label
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
                    >Investment Start Date:</label
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
              <div class="col-md-6">
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
            </div>
            <div class="row my-5">
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
                  <div class="col-md-6">
                    <button class="btn btn-sm btn-success">
                      {{
                        updateInvestmentLoading
                          ? "Updating Investment"
                          : "Save Investment"
                      }}
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      class="btn btn-sm btn-danger"
                      @click.prevent="toggleInvestmentForm"
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
    <div v-else>
      <div class="row mb-5">
        <div class="col-6">
          <h3 class="mb-0">Update Investment</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form @submit.prevent="updateInvestment">
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
                      v-model="investmentUpdateData.name"
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
                      v-model="investmentUpdateData.investment_category_id"
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
                      v-model="investmentUpdateData.roi"
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
                      v-model="investmentUpdateData.banner_link"
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
                      v-model="investmentUpdateData.document_links"
                      required
                      id="InvestmentDocument"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="minimumAmount"
                    class="col-md-6 col-form-label form-control-label"
                    >Minimum Amount:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentUpdateData.minimum_amount"
                      required
                      id="minimumAmount"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="maximumInvestment"
                    class="col-md-6 col-form-label form-control-label"
                    >Investment Access:</label
                  >
                  <div class="col-md-12">
                    <!-- <base-input
                      type="text"
                      v-model="investmentData.maximum_amount"
                      required
                      id="maximumInvestment"
                    /> -->
                    <div class="form-group row">
                      <div
                        class="col-md-3 custom-control custom-checkbox pl-4"
                        v-for="(subscription, i) in subscriptions"
                        :key="i"
                      >
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          :id="subscription.name"
                          v-model="investmentUpdateData.access"
                          :value="subscription.id"
                        />
                        <label
                          class="custom-control-label"
                          :for="subscription.name"
                          >{{ subscription.name }}</label
                        >
                      </div>
                      <!-- <div class="col-md-3 custom-control custom-checkbox pl-4">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="none"
                        v-model="investmentAccess.access"
                        value="null"
                        @change="checkAll"
                      />
                      <label class="custom-control-label" for="none"
                        >All</label
                      >
                    </div> -->
                    </div>
                    <!-- <small>{{ investmentAccess.access }}</small> -->
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="maximumInvestment"
                    class="col-md-6 col-form-label form-control-label"
                    >Maximum Amount:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="investmentUpdateData.maximum_amount"
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
                      v-model="investmentUpdateData.duration"
                      required
                      id="duration"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="investmentStatus"
                    class="col-md-6 col-form-label form-control-label"
                    >Status</label
                  >
                  <div class="col-md-12">
                    <el-select
                      class="select-danger"
                      placeholder="Select Investment Status"
                      v-model="investmentUpdateData.status"
                      required
                      id="investmentStatus"
                    >
                      <el-option
                        v-for="option in [
                          { value: 1, label: 'Active' },
                          { value: 0, label: 'Closed' },
                        ]"
                        class="select-danger"
                        :value="option.value"
                        :label="option.label"
                        :key="option.label"
                      >
                      </el-option>
                    </el-select>
                    <!-- <base-input
                      type="text"
                      placeholder=" 1 for Active, 0 for Closed"
                      v-model="investmentUpdateData.status"
                      required
                      id="investmentDescription"
                    /> -->
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="startDate"
                    class="col-md-6 col-form-label form-control-label"
                    >Campaign Start Date:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="date"
                      placeholder="Start Date"
                      id="startDate"
                      v-model="investmentUpdateData.start_date"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="endDate"
                    class="col-md-6 col-form-label form-control-label"
                    >Investment Start Date:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="date"
                      placeholder="ENd Date"
                      id="endDate"
                      v-model="investmentUpdateData.end_date"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
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
                      v-model="investmentUpdateData.description"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-5">
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
                  <div class="col-md-6">
                    <button class="btn btn-sm btn-success">
                      {{
                        newInvestmentLoading
                          ? "Updating Investment"
                          : "Update Investment"
                      }}
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      class="btn btn-sm btn-danger"
                      @click.prevent="investmentUpdateForm = false"
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
      deleteInvestmentLoading: false,
      updateInvestmentLoading: false,
      payoutPercentLoading: false,
      investmentForm: false,
      investmentUpdateForm: false,
      investmentData: {
        name: "",
        start_date: "",
        end_date: "",
        investment_category_id: "",
        access: [],
        maximum_amount: "",
        minimum_amount: "",
        roi: "",
        description: "",
        duration: "",
        dollar: "0",
        status: "",
        banner_link: "",
        document_links: "",
      },
      investmentUpdateData: {
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        maximum_amount: "",
        minimum_amount: "",
        access: [],
        banner_link: "",
        document_links: "",
        roi: "",
        duration: "",
        status: "",
        investment_category_id: "",
        dollar: "0",
      },
      investments: null,
      categories: null,
      subscriptions: null,
      investmentAccess: {
        access: [],
      },
      investmentId: "",
      modals: {
        modal1: false,
        modal2: false,
        modal3: false,
      },
      payoutPercentage: "",
      payoutPercentageErr: "",
    };
  },
  created() {
    this.fetchInvestments();
    this.fecthCategories();
    this.fecthSubscriptions();
  },
  methods: {
    // checkAll(e) {
    //   console.log({checked: e.target.checked});
    //   if (e.target.checked) {
    //     this.investmentAccess.access = null
    //   } else {
    //     this.investmentAccess.access = []
    //   }
    // },
    async addPayoutPercent() {
      this.modals.modal2 = false
      this.modals.modal3 = false
      this.payoutPercentLoading = true

      if (!this.payoutPercentage) {
        this.payoutPercentageErr =
          "Error... Payout percentage Field is required"

          setTimeout(() => {
            this.payoutPercentageErr = ""
          }, 5000);
      }

      // let url =
      //   "http://209.97.136.114/api/v1/investment/disburse";
      let url =
        "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/disburse";

      try {
        let response = await this.$axios.post(url, {
          investment_product_id: this.investmentId,
          disburse_perc: this.payoutPercentage,
        });
        this.payoutPercentLoading = false
        console.log({ response });
        this.$notify({
          type: "success",
          message: `Payout percentage Successfully Added`,
        });
      } catch (error) {
        this.payoutPercentLoading = false
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }
      }
    },
    setInvestmentId(id) {
      this.investmentId = id;
    },
    async fecthSubscriptions() {
      let url =
        "https://apiv1.smarthalalinvestorclub.com/api/v1/subscription_packages";
      // let url = "http://209.97.136.114/api/v1/subscription_packages";

      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.subscriptions = response.data.data;
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
            message: `Oops... Error Fetching Subscriptions`,
          });
        }
      }
    },
    async fecthCategories() {
      let url =
        "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_category";
      // let url = "http://209.97.136.114/api/v1/investment/_category";

      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.categories = response.data.data;
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
    setInvestment(investment) {
      // console.log({selectedInvestment: investment});
      this.investmentUpdateData.name = investment.name;
      this.investmentUpdateData.description = investment.description;
      this.investmentUpdateData.start_date = investment.start_date;
      this.investmentUpdateData.end_date = investment.end_date;
      if (investment.access == null) {
        this.investmentUpdateData.access = [];
      } else {
        this.investmentUpdateData.access = investment.access;
      }
      this.investmentUpdateData.maximum_amount = investment.maximum_amount;
      this.investmentUpdateData.minimum_amount = investment.minimum_amount;
      this.investmentUpdateData.banner_link = investment.banner_link;
      this.investmentUpdateData.document_links = investment.document_links;
      this.investmentUpdateData.roi = investment.roi;
      this.investmentUpdateData.duration = investment.duration;
      this.investmentUpdateData.status = investment.status;
      this.investmentUpdateData.investment_category_id = String(
        investment.investment_category.id
      );
      this.investmentUpdateData.dollar = "0";
    },
    toggleInvestmentForm() {
      this.investmentForm = !this.investmentForm;
    },
    async updateInvestment() {
      // let url = `http://209.97.136.114/api/v1/investment/_product/${this.investmentId}`;
      let url = `https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_product/${this.investmentId}`;
      this.updateInvestmentLoading = true;
      this.investmentUpdateForm = false;
      console.log({ updateData: this.investmentUpdateData });

      try {
        let response = await this.$axios.post(url, this.investmentUpdateData);
        console.log({ responseUpdate: response });
        this.updateInvestmentLoading = false;
        this.fetchInvestments();
        this.$notify({
          type: "success",
          message: `Investment Updated Successfully`,
        });
      } catch (error) {
        this.updateInvestmentLoading = false;
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Updating Investment`,
          });
        }
      }
    },
    async newInvestment() {
      // let url = "http://209.97.136.114/api/v1/investment/_product";
      let url =
        "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_product";
      this.newInvestmentLoading = true;
      this.investmentForm = false;
      console.log({ dataData: this.investmentData });

      try {
        let response = await this.$axios.post(url, this.investmentData);
        console.log({ responseSave: response });
        this.newInvestmentLoading = false;
        this.fetchInvestments();
        this.$notify({
          type: "success",
          message: `Investment created Successfully`,
        });
      } catch (error) {
        this.newInvestmentLoading = false;
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
    async deleteInvestment() {
      // let url = `http://209.97.136.114/api/v1/investment/_product/${this.investmentId}`;
      let url = `https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_product/${this.investmentId}`;
      this.deleteInvestmentLoading = true;
      this.modals.modal1 = false;
      console.log({ dataData: this.investmentData });

      try {
        let response = await this.$axios.delete(url);
        console.log({ responseDelete: response });
        this.deleteInvestmentLoading = false;
        this.fetchInvestments();
        this.$notify({
          type: "success",
          message: `Investment Deleted Successfully`,
        });
      } catch (error) {
        this.deleteInvestmentLoading = false;
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

    // setUserId(userId) {
    //   console.log("Okay ooo");
    //   console.log(userId);
    //   this.userId = userId;
    // },
    async fetchInvestments() {
      // let url =
      //   "http://209.97.136.114/api/v1/investment/admin/_product";
      let url =
        "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/admin/_product";
      // let url = "http://209.97.136.114/api/v1/investment/_product";

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
            message: `Oops... Error Fetching Investmens`,
          });
        }
      }
    },
  },
};
</script>
<style>
</style>
