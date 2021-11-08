<template>
  <div class="container-fluid mt-5">
    <div class="row my-4 justify-content-end">
      <div class="col-6 text-right">
              <div
                class="btn btn-sm btn-success"
                @click="modals.modal1 = true"
              >
                New Lesson Category
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
              <h3 class="mb-0">Lesson Categories</h3>
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
                  <th scope="col">Image</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(category, i) in categories" :key="i">
                  <td>
                    {{ category.id }}
                  </td>
                  <td>
                    {{ category.title }}
                  </td>
                  <td>
                    <img class="border rounded-md" height="50" width="80" :src="category.image" :alt="`${category.title}`">
                  </td>
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
          <form @submit.prevent="newLessonCategory">
            <h6 slot="header" class="modal-title mb-0" id="modal-title-default">
              New Lesson Category
            </h6>
            <div class="form-group row mb-1">
              <label
                for="categoryTitle"
                class="col-md-6 col-form-label form-control-label"
                >Tilte:</label
              >
              <div class="col-md-12">
                <base-input
                  type="text"
                  id="categoryTitle"
                  placeholder="Title"
                  v-model="lessonCategoryData.title"
                  required
                />
              </div>
            </div>
            <div class="form-group row mb-1">
              <label
                for="categoryImage"
                class="col-md-6 col-form-label form-control-label"
                >Image:</label
              >
              <div class="col-md-12">
                <base-input
                  type="text"
                  id="categoryImage"
                  placeholder="Image Url"
                  v-model="lessonCategoryData.image"
                  required
                />
              </div>
            </div>
            <div class="form-group row mb-1">
                  <label
                    for="lessonStatus"
                    class="col-md-6 col-form-label form-control-label"
                    >Status</label
                  >
                  <div class="col-md-12">
                    <el-select
                      class="select-danger"
                      placeholder="Select lesson Status"
                      v-model="lessonCategoryData.status"
                      required
                      id="lessonStatus"
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
                  v-model="lessonCategoryData.description"
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
      lessonCategoryData: {
        title: "",
        status: 0,
        description: "",
        image: ''
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
    async newLessonCategory() {
      let url = "https://apiv1.smarthalalinvestorclub.com/api/v1/Management/lesson-category";
    //   let url = "http://209.97.136.114/api/v1/Management/lesson-category";
      this.newCategoryLoading = true;
      this.modals.modal1 = false

      try {
        let response = await this.$axios.post(url, this.lessonCategoryData);
        console.log({ responseCat: response });
        this.newCategoryLoading = false;
        this.$notify({
          type: "success",
          message: `Lesson Category created Successfully`,
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
        let url = "https://apiv1.smarthalalinvestorclub.com/api/v1/Management/lesson-category";
    //   let url = "http://209.97.136.114/api/v1/Management/lesson-category";

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
