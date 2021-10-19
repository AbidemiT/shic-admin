<template>
  <div class="container-fluid mt-5">
    <div class="row my-4 justify-content-end">
      <div class="col-6 text-right">
              <div
                class="btn btn-sm btn-success"
                @click="modals.modal1 = true"
              >
                New Investment Category
              </div>
            </div>
    </div>
    <div>
      <card
        class="no-border-card"
        body-classes="px-0 pb-1"
        footer-classes="pb-2"
      >
        <template slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Investment Categories</h3>
            </div>
          </div>
        </template>
        <div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Category ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">slug</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(category, i) in categories" :key="i">
                  <td>
                    {{ category.id }}
                  </td>
                  <td>
                    {{ category.name }}
                  </td>
                  <td>{{ category.slug }}</td>
                  <td>{{ category.description }}</td>
                  <!-- <td>
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
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

        <modal :show.sync="modals.modal1">
          <form @submit.prevent="newInvestmentCategory">
            <h6 slot="header" class="modal-title mb-0" id="modal-title-default">
              New Investment Category
            </h6>
            <div class="form-group row mb-1">
              <label
                for="categoryName"
                class="col-md-6 col-form-label form-control-label"
                >Name:</label
              >
              <div class="col-md-12">
                <base-input
                  type="text"
                  id="categoryName"
                  placeholder="Agro"
                  v-model="investmentCategoryData.name"
                  required
                />
              </div>
            </div>
            <div class="form-group row mb-1">
              <label
                for="categorySlug"
                class="col-md-6 col-form-label form-control-label"
                >Slug:</label
              >
              <div class="col-md-12">
                <base-input
                  type="text"
                  id="categorySlug"
                  placeholder="agro"
                  v-model="investmentCategoryData.slug"
                  required
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label
                for="categoryDescription"
                class="col-md-6 col-form-label form-control-label"
                >Description</label
              >
              <div class="col-md-12">
                <textarea
                  class="form-control"
                  id="categoryDescription"
                  rows="3"
                  placeholder=""
                  v-model="investmentCategoryData.description"
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" class="btn btn-sm btn-success">{{
              newCategoryLoading ? "Saving Category..." : "Save category"
            }}</button>
            <base-button
              type="link"
              class="ml-auto text-danger"
              @click="modals.modal1 = false"
              >Close
            </base-button>
          </form>
        </modal>
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
      selectedRows: [],
      // users: [],
      sort: "created_at",
      newCategoryLoading: false,
      categories: null,
      investmentCategoryData: {
        name: "",
        slug: "",
        description: "",
      },
      modals: {
        modal1: false,
      },
    };
  },
  created() {
    this.fecthCategories();
  },
  methods: {
    // setUserId(userId) {
    //   console.log("Okay ooo");
    //   console.log(userId);
    //   this.userId = userId;
    // },
    async newInvestmentCategory() {
      let url = "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_category";
      // let url = "http://209.97.136.114/api/v1/investment/_category";
      this.newCategoryLoading = true;
      this.modals.modal1 = false

      try {
        let response = await this.$axios.post(url, this.investmentCategoryData);
        console.log({ responseCat: response });
        this.newCategoryLoading = false;
        this.$notify({
          type: "success",
          message: `Investment Category created Successfully`,
        });
        this.fecthCategories();
      } catch (error) {
        this.newCategoryLoading = false;
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
    async fecthCategories() {
        let url = "https://apiv1.smarthalalinvestorclub.com/api/v1/investment/_category";
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
  },
};
</script>
<style>
</style>
