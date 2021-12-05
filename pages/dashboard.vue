<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <!-- <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Default</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb></route-breadcrumb>
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" type="neutral">New</base-button>
          <base-button size="sm" type="neutral">Filters</base-button>
        </div> -->
      </div>

      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card
            title="Users"
            type="gradient-red"
            :sub-title="String(totalUsers)"
            icon="ni ni-single-02"
          >
          </stats-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <stats-card
            title="Investments"
            type="gradient-red"
            :sub-title="String(totalInvestments)"
            icon="ni ni-single-02"
          >
          </stats-card>
        </div>
      </div>
    </base-header>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
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
                <tr v-for="(investment, i) in investments" :key="i">
                  <td>
                    {{ i + 1 }}
                  </td>
                  <td >
                    {{ `${investment.name}` }}
                  </td>
                  <td>{{ investment.active_investments_count }}</td>
                  <td>₦ {{ Number(investment.maximum_amount).toLocaleString() }}</td>
                  
                  <td>₦ {{ (Number(investment.maximum_amount) - Number(investment.leftover_amount)).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// Charts
import * as chartConfigs from "@/components/argon-core/Charts/config";
import LineChart from "@/components/argon-core/Charts/LineChart";
import BarChart from "@/components/argon-core/Charts/BarChart";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import StatsCard from "@/components/argon-core/Cards/StatsCard";
import SocialTrafficTable from "@/components/pages/dashboard/SocialTrafficTable.vue";
import LightTable from "@/components/pages/dashboard/LightTable.vue";
import {mapGetters} from "vuex"

export default {
  middleware: 'redirect',
  layout: "DashboardLayout",
  components: {
    LineChart,
    BarChart,
    RouteBreadCrumb,
    StatsCard,
    LightTable,
    SocialTrafficTable,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      totalUsers: 'users/totalUsers',
      investments: 'investment/getInvestments',
      totalInvestments: 'investment/getInvestmentsTotal',
    }),
  },
  methods: {
    async fetchSubscription() {
      let url  = `/Management/subscription/packages`

      try {
        let response = await this.$axios.get(url)

        this.$store.commit('users/SET_SUBSCRIPTIONS', response.data.data)
        // this.$store.commit('investment/SET_INVESTMENT_USERS_TOTAL', response.data.data.total)
      } catch (error) {
        this.$notify({
          type: "error",
          message: `${error.message}`,
        });
      }
    },
  },
  mounted() {
    this.fetchSubscription()
    this.$store.dispatch('investment/fetchInvestments');
    this.$store.dispatch('investment/getUsersInvestment');
  },
};
</script>
<style>
</style>
