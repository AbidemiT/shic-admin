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
              <div class="form-group">
                <button
                  v-if="showSubscriptionUsers || showUnsubscribedUsers"
                  class="btn btn-primary btn-sm"
                  @click="
                    (showSubscriptionUsers = false),
                      (showUnsubscribedUsers = false),
                      (headingTitle = 'Subscription List')
                  "
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </template>
        <div>
          <div
            class="table-responsive"
            v-if="!showSubscriptionUsers && !showUnsubscribedUsers"
          >
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">s/n</th>
                  <th scope="col">Subscription</th>
                  <th scope="col">No Of Subscribers</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  @click="fetchSubscriptionUsers(sub)"
                  v-for="(sub, i) in subscriptions"
                  :key="i"
                >
                  <td>
                    {{ i + 1 }}
                  </td>
                  <td>
                    {{ sub.name }}
                  </td>
                  <td>{{ sub.users.length }}</td>
                </tr>
                <tr @click="fetchUnsubscribedUsers()">
                  <td>
                    {{ subscriptions.length + 1 }}
                  </td>
                  <td>Pending Subscription</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive" v-else-if="showSubscriptionUsers">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(subscription, i) in subscriptionUsers" :key="i">
                  <td v-if="subscription.user">
                    {{ subscription.user.id }}
                  </td>
                  <td v-if="subscription.profile">
                    {{
                      `${subscription.profile.first_name} ${subscription.profile.last_name}`
                    }}
                  </td>
                  <td v-if="subscription.user">
                    {{ subscription.user.email }}
                  </td>
                  <td v-if="subscription.profile">
                    {{ subscription.profile.phone }}
                  </td>
                  <!-- <td v-else>
                    <span class="badge badge-warning">Pending</span>
                  </td> -->
                  <td v-if="subscription.user">
                    {{
                      new Date(
                        subscription.user.created_at
                      ).toLocaleDateString()
                    }}
                  </td>
                  <td v-if="subscription.user">
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
                        @click="setUserId(subscription.id), selectedUser(subscription),setRealId(subscription.user_id)"
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
                          >Edit User</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="modals.modal2 = true"
                          >Delete User</a
                        >
                        <!-- <a class="dropdown-item" href="#">Something else here</a> -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
                  <modal :show.sync="modals.modal1">
                    <h6
                      slot="header"
                      class="modal-title mb-0"
                      id="modal-title-default"
                    >
                      Edit User
                    </h6>
                    <div class="form-group row">
                      <div class="col-md-6">
                        <label
                          for="updateFirstName"
                          class="col-md-12 col-form-label form-control-label"
                          >First Name:</label
                        >
                        <base-input
                          type="text"
                          id="updateFirstName"
                          v-model="updateUser.first_name"
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="updateLastName"
                          class="col-md-12 col-form-label form-control-label"
                          >Last Name:</label
                        >
                        <base-input
                          type="text"
                          id="updateLastName"
                          v-model="updateUser.last_name"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="col-md-6">
                        <label
                          for="updatePhone"
                          class="col-md-6 col-form-label form-control-label"
                          >Phone:</label
                        >
                        <base-input
                          type="text"
                          id="updatePhone"
                          v-model="updateUser.phone"
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="updateEmail"
                          class="col-md-6 col-form-label form-control-label"
                          >Gender:</label
                        >
                        <el-select
                          class="select-danger"
                          placeholder="Select Gender"
                          v-model="updateUser.gender"
                        >
                          <el-option
                            v-for="option in [
                              { value: 'male', label: 'Male' },
                              { value: 'female', label: 'Female' },
                            ]"
                            class="select-success"
                            :value="option.value"
                            :label="option.label"
                            :key="option.label"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <template slot="footer">
                      <base-button type="primary" @click="updateUserFunc">{{
                        updateLoading ? "Updating User..." : "Save changes"
                      }}</base-button>
                      <base-button
                        type="link"
                        class="ml-auto"
                        @click="modals.modal1 = false"
                        >Close
                      </base-button>
                    </template>
                  </modal>
                  <modal :show.sync="modals.modal2">
                    <h6
                      slot="header"
                      class="modal-title mb-0"
                      id="modal-title-default"
                    >
                      Delete User
                    </h6>
                    <p>Are you sure you want to delete User?, your Action is irreversible.</p>

                    <template slot="footer">
                      <base-button type="primary" @click="deleteUser">{{
                        deleteLoading ? "Deleting User..." : "Delete User"
                      }}</base-button>
                      <base-button
                        type="link"
                        class="ml-auto"
                        @click="modals.modal2 = false"
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
              <div class=""></div>
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
                      @click="nextSubscribed"
                    >
                      <i class="fa fa-angle-right"></i>
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div class="table-responsive" v-else>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(subscription, i) in unsubscribedUsers" :key="i">
                  <td>
                    {{ subscription.id }}
                  </td>
                  <td v-if="subscription.profile">
                    {{
                      `${subscription.profile.first_name} ${subscription.profile.last_name}`
                    }}
                  </td>
                  <td v-else>
                    {{ subscription.name }}
                  </td>
                  <td>{{ subscription.email }}</td>
                  <td v-if="subscription.profile">
                    {{ subscription.profile.phone }}
                  </td>
                  <td>
                    <span class="badge badge-warning">Pending</span>
                  </td>
                  <td>{{ subscription.created_at }}</td>
                  <td>
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
                        @click="setUserId(subscription.id), setRealId(subscription.user_id)"
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
                        <!-- <a class="dropdown-item" href="#">Something else here</a> -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
                  <modal :show.sync="modals.modal1">
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
                          <!-- <el-option
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
                        </el-option> -->
                          <el-option
                            v-for="subscription in subscriptions"
                            class="select-danger"
                            :value="subscription.id"
                            :label="subscription.name"
                            :key="subscription.id"
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
                      <base-button type="primary" @click="approveUser">{{
                        approvalLoading ? "Approving User..." : "Save changes"
                      }}</base-button>
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
              <div class=""></div>
              <!-- <nav aria-label="...">
                <ul class="pagination">
                  <li
                    class="page-item"
                    :class="pagination.currentPage == 1 ? 'disabled' : ''"
                  >
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
                  <li
                    class="page-item"
                    :class="pagination.currentPage == totalUnsubscribed ? 'disabled' : ''"
                  >
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Next"
                      @click="nextUnsubscribed"
                    >
                      <i class="fa fa-angle-right"></i>
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav> -->
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
      pagination: {
        perPage: 20,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
      },
      showSubscriptionUsers: false,
      showUnsubscribedUsers: false,
      approvalLoading: false,
      deleteLoading: false,
      updateLoading: false,
      total: 1,
      userSub: {
        status: 1,
        subscription_package_id: "",
        user_id: "",
        start_date: "",
      },
      userId: "",
      realUserId: "",
      user: "",
      modals: {
        modal1: false,
        modal2: false,
      },
      headingTitle: "Subscriptions List",
      updateUser: {
        first_name: "",
        last_name: "",
        gender: "",
        phone: "",
        // email: "",
      },
    };
  },
  mounted() {
    this.$modal.hide("user_modal");
    this.$modal.show("approve_user_modal");
  },
  computed: {
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.totalSubscribed < highBound) {
        highBound = this.totalSubscribed;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    totalSubscribed() {
      return this.subscriptionUsersTotal
        ? this.subscriptionUsersTotal
        : this.subscriptionUsers.length;
    },
    totalUnsubscribed() {
      return this.unsubscribedUsers.length;
    },
    toUnsubscribed() {
      let highBound = this.fromUnsubscribed + this.pagination.perPage;
      if (this.totalUnsubscribed < highBound) {
        highBound = this.totalUnsubscribed;
      }
      return highBound;
    },
    fromUnsubscribed() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    searchUser() {
      if (this.user === "") {
        return this.users;
      } else {
        return this.users.filter((user) => {
          let fullNameAndEmail = `${user.profile.first_name} ${user.profile.last_name} ${user.email}`;
          return fullNameAndEmail
            .toLowerCase()
            .includes(this.user.toLowerCase());
        });
      }
    },
    ...mapGetters({
      users: "users/getUsers",
      nextPage: "users/getNextPage",
      prevPage: "users/getPrevPage",
      subscriptions: "users/getSubscriptions",
      subscriptionUsers: "users/getSubscriptionUsers",
      unsubscribedUsers: "users/getUnsubscribedUsers",
      subscriptionUsersTotal: "users/getSubscriptionUsersTotal",
      unsubscribedUsersTotal: "users/getUnsubscribedUsersTotal",
    }),
  },
  methods: {
    async updateUserFunc() {
      this.updateLoading = true
      console.log({userid: this.realUserId});
      let url = `/Management/user/users/${this.realUserId}`
      try {
        let response = await this.$axios.patch(url, this.updateUser);
        this.updateLoading = false
        this.$toast.success(`User Updated`)
        this.modals.modal1 = false
        setTimeout(() => {
          this.$toast.clear()
        }, 5000);
      } catch (error) {
        this.$toast.error(`${error.message}`)
        this.modals.modal1 = false

        setTimeout(() => {
          this.$toast.clear()
        }, 5000);
        this.updateLoading = false
      }
    },
    async deleteUser() {
      this.deleteLoading = true
      let url = `/Management/user/destroyForce/${this.realUserId}`
      try {
        let response = await this.$axios.delete(url);
        this.deleteLoading = false
        this.showSubscriptionUsers = false
        this.modals.modal2 = false
        this.$toast.success(`User deleted`)
        setTimeout(() => {
          this.$toast.clear()
        }, 5000);
      } catch (error) {
        this.deleteLoading = false
        this.modals.modal2 = false
        this.$toast.error(`${error.message}`)

        setTimeout(() => {
          this.$toast.clear()
        }, 5000);
      }
    },
    selectedUser(value) {
      this.updateUser.first_name = value.profile.first_name
      this.updateUser.last_name = value.profile.last_name
      this.updateUser.gender = value.profile.gender
      this.updateUser.phone = value.profile.phone
      this.updateUser.email = value.user.email
    },
    async nextSubscribed() {
      console.log({ next: this.nextPage });
      let link = this.nextPage.split("/v1");
      let linkParam = link[1];
      let url = linkParam;
      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "users/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "users/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS_TOTAL",
          response.data.data.total
        );
        // this.headingTitle = sub.name;
        this.showSubscriptionUsers = true;
        this.showUnsubscribedUsers = false;
      } catch (error) {
        console.log({ error });
      }
    },
    async nextUnsubscribed() {
      let link = this.nextPage.split("/v1");
      let linkParam = link[1];
      let url = linkParam;
      console.log({ url });
      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "users/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "users/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS_TOTAL",
          response.data.data.total
        );
        // this.headingTitle = sub.name;
        this.showSubscriptionUsers = true;
        this.showUnsubscribedUsers = false;
      } catch (error) {
        console.log({ error });
        // this.$notify({
        //   type: "error",
        //   message: `${error.message}`,
        // });
      }
    },
    async prev() {
      let link = this.prevPage.split("/v1");
      let linkParam = link[1];
      let url = linkParam;
      console.log({ url });
      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "users/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "users/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS_TOTAL",
          response.data.data.total
        );
        this.headingTitle = sub.name;
        this.showSubscriptionUsers = true;
        this.showUnsubscribedUsers = false;
      } catch (error) {
        console.log({ error });
        // this.$notify({
        //   type: "error",
        //   message: `${error.message}`,
        // });
      }
    },
    setUserId(userId) {
      console.log("Okay ooo");
      console.log(userId);
      this.userId = userId;
    },
    setRealId(userId) {
      console.log("Okay ooo");
      console.log({userId});
      this.realUserId = userId;
    },
    async approveUser() {
      this.approvalLoading = true;
      // let url = `http://209.97.136.114/api/v1/Management/user/subscriptions/${this.userId}`;
      let url = `/Management/user/subscriptions/${this.userId}`;
      this.userSub.user_id = this.userId;

      try {
        console.log({ userSub: this.userSub });
        let response = await this.$axios.put(url, this.userSub);
        this.approvalLoading = false;
        this.$store.dispatch("users/getUsers");
        this.fetchSubscription();
        this.fetchUnsubscribedUsers();
        this.$notify({
          type: "success",
          message: "User Approved",
        });
        this.$store.dispatch("user/getUsers");
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
            message: `Oops... Error Approving User`,
          });
        }
      }
    },
    async fetchSubscriptionUsers(sub) {
      let url = `/Management/user/get-user-subscriptions-using-subscription-package/${sub.id}/${this.pagination.perPage}`;

      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS",
          response.data.data.data
        );
        this.$store.commit(
          "users/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "users/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
        this.$store.commit(
          "users/SET_SUBSCRIPTION_USERS_TOTAL",
          response.data.data.total
        );
        this.headingTitle = sub.name;
        this.showSubscriptionUsers = true;
        this.showUnsubscribedUsers = false;
      } catch (error) {
        this.$notify({
          type: "error",
          message: `${error.message}`,
        });
      }
    },
    async fetchUnsubscribedUsers() {
      let url = `/Management/user/get-user-subscriptions-using-subscription-package/0/20`;

      try {
        let response = await this.$axios.get(url);
        console.log({ unsubscribed: response });
        this.$store.commit("users/SET_UNSUBSCRIBED_USERS", response.data.data);
        // this.$store.commit('users/SET_UNSUBSCRIBED_USERS_TOTAL', response.data.data.total)
        this.headingTitle = "Pending Subscription";
        this.showUnsubscribedUsers = true;
        this.showSubscriptionUsers = false;
      } catch (error) {
        this.$notify({
          type: "error",
          message: `${error.message}`,
        });
      }
    },
    async fetchSubscription() {
      let url = `/Management/subscription/packages`;

      try {
        let response = await this.$axios.get(url);

        this.$store.commit("users/SET_SUBSCRIPTIONS", response.data.data);
        // this.$store.commit('investment/SET_INVESTMENT_USERS_TOTAL', response.data.data.total)
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
