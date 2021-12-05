import service from '../services/users-service';

export const state = () => ({
  usersInvestment: [],
  investments: [],
  investmentUsers: [],
  investmentUsersTotal: 0,
  nextPage: '',
  prevPage: '',
});

export const mutations = {
  SET_USERS_INVESTMENT(state, payload) {
    state.usersInvestment = payload;
  },
  SET_INVESTMENTS(state, payload) {
    state.investments = payload;
  },
  SET_INVESTMENT_USERS(state, payload) {
    state.investmentUsers = payload;
  },
  SET_INVESTMENT_USERS_TOTAL(state, payload) {
    state.investmentUsersTotal = payload;
  },
  SET_NEXT_PAGE: (state,payload) => {
    state.nextPage = payload
  },
  SET_PREV_PAGE: (state,payload) => {
    state.prevPage = payload
  },
};

export const actions = {
  getUsersInvestment({ commit }) {
    return service.getUsersInvestment(this.$axios).then((usersInvestment) => {
      console.log({ usersInvestment });
      commit("SET_USERS_INVESTMENT", usersInvestment);
    });
  },
  async fetchInvestments({commit}) {
    // let url =
    //   "http://209.97.136.114/api/v1/investment/admin/_product";
    let url =
      "/investment/admin/_product";
    // let url = "http://209.97.136.114/api/v1/investment/_product";

    try {
      let response = await this.$axios.get(url);
      console.log({ response });
      this.investments = response.data.data;
      commit('SET_INVESTMENTS', response.data.data)
    } catch (error) {
     console.log({error})
    }
  },
};

export const getters = {
  getUsersinvestment: (state) => state.usersInvestment,
  getInvestments: (state) => state.investments,
  getInvestmentsTotal: state => state.investments.length,
  getCustomInvestments: (state) => {
    let names = [];
    let customInvestment = [];
    state.investments.forEach((element) => {
      names.push(element.name);
      console.log({element});
      state.usersInvestment.filter((investment, i) => {
          console.log({customElement: investment});
        if (investment.investment_product.name == element.name) {
          customInvestment.push({investment: {names: investment.investment_product.name, investments: investment}});
        }
      });
    });

    return customInvestment;
  },
  getInvestmentUsers: state => state.investmentUsers,
  getInvestmentUsersTotal: state => state.investmentUsersTotal,
  getPrevPage: state => state.prevPage,
  getNextPage: state => state.nextPage,
};
