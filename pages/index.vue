<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <notifications></notifications>
        <div class="header-body text-center mb-7">
          <div class="text-center" style="margin-bottom: 5px">
            <h1 class="text-white">
              Smart Halal Investor Club Admin
            </h1>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--9 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>

              <form class="needs-validation" @submit.prevent="handleSubmit()">
                <base-input
                  alternative
                  class="mb-3"
                  name="Email"
                  prepend-icon="ni ni-email-83"
                  placeholder="Email"
                  v-model="user.email"
                  required
                >
                </base-input>
                

                <base-input
                  alternative
                  class="mb-3"
                  name="Password"
                  prepend-icon="ni ni-lock-circle-open"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                  required
                >
                </base-input>
                

                <div class="text-center">
                  <base-button type="primary" native-type="submit" class="my-4"
                    >{{loading ? 'Signing In....' : 'Sign in'}}</base-button
                  >
                </div>
              </form>
            </div>
          </div>
          <!-- <div class="row mt-3">
            <div class="col-6">
              <router-link to="/password/reset" class="text-light"
                ><small>Forgot password?</small></router-link
              >
            </div>
            <div class="col-6 text-right">
              <router-link to="/register" class="text-light"
                ><small>Create new account</small></router-link
              >
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ValidationError from "~/components/ValidationError.vue";

export default {
  layout: "AuthLayout",
  // mixins: [formMixin],
  components: { ValidationError },
  // middleware({ store, redirect }) {
  //   // If the user is authenticated
  //   if (store.$auth.loggedIn) {
  //     return redirect("/dashboard");
  //   }
  // },
  data() {
    return {
      loading: false,
      user: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      console.log({user: this.user});
      // let url = 'http://209.97.136.114/api/v1/auth/login'
      let url = 'https://apiv1.smarthalalinvestorclub.com/api/v1/auth/login'

      try {
        let response =  await this.$axios.post(url, this.user);
        this.loading = false
        console.log({response});
        this.$store.commit('profile/SET_IS_AUTHENTICATED', true)
        this.$store.commit('profile/SET_ADMIN', response.data.data.user)
        this.$store.commit('profile/SET_ACCESS_TOKEN', response.data.data.access_token)
        localStorage.setItem('token', response.data.data.access_token)
        this.$router.push("/dashboard");
        this.$store.dispatch('users/getUsersInvestment');
        this.$store.dispatch('users/getUsers');
      } catch (error) {
        console.log({error});
        this.loading = false
        if (error.response) {
          this.$notify({
            type: "danger",
            message: `${error.response.data.error}`,
          });
        }
      }
    },
  },
};
</script>
