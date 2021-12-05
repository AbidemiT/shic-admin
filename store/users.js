import service from '../services/users-service';

export const state = () => ({
  list: {},
  user: {},
  users: [],
  usersInvestment: [],
  meta: {},
  url: null,
  nextPage: '',
  prevPage: '',
  subscriptions: [],
  subscriptionUsers: [],
  unsubscribedUsers: [],
  unsubscribedUsersTotal: '',
  subscriptionUsersTotal: '',
});

export const mutations = {
  SET_LIST: (state, list) => {
    state.list = list;
  },
  SET_NEXT_PAGE: (state,payload) => {
    state.nextPage = payload
  },
  SET_PREV_PAGE: (state,payload) => {
    state.prevPage = payload
  },
  SET_SUBSCRIPTIONS: (state, subscriptions) => {
    state.subscriptions = subscriptions;
  },
  SET_UNSUBSCRIBED_USERS: (state, unsubscribedUsers) => {
    state.unsubscribedUsers = unsubscribedUsers;
  },
  SET_UNSUBSCRIBED_USERS_TOTAL: (state, unsubscribedUsers) => {
    state.unsubscribedUsers = unsubscribedUsers;
  },
  SET_SUBSCRIPTION_USERS: (state, subscriptionUsers) => {
    state.subscriptionUsers = subscriptionUsers;
  },
  SET_SUBSCRIPTION_USERS_TOTAL: (state, subscriptionUsersTotal) => {
    state.subscriptionUsersTotal = subscriptionUsersTotal;
  },
  SET_RESOURCE: (state, user) => {
    state.user = user;
  },
  SET_META: (state, meta) => {
    state.meta = meta;
  },
  SET_URL: (state, url) => {
    state.url = url;
  },
  SET_USERS: (state, users) => {
    state.users = users;
  },
  SET_USERS_INVESTMENT: (state, usersInvestment) => {
    state.usersInvestment = usersInvestment;
  }
};

export const actions = {
  list({commit, dispatch}, params) {
    return service.list(params, this.$axios)
      .then(({list, meta}) => {
        commit('SET_LIST', list);
        commit('SET_META', meta);
      });
  },
  getUsers({commit}) {
    console.log("getUsers here");
    return service.getUsers(this.$axios)
      .then((users) => {
        console.log({users});
        commit('SET_USERS', users);
      });
  },
  getUsersInvestment({commit}) {
    return service.getUsersInvestment(this.$axios)
      .then((usersInvestment) => {
        console.log({usersInvestment});
        commit('SET_USERS_INVESTMENT', usersInvestment);
      });
  },

  get({commit, dispatch}, params) {
    return service.get(params, this.$axios)
      .then((user) => { commit('SET_RESOURCE', user); });
  },

  add({commit, dispatch}, params) {
    return service.add(params, this.$axios)
      .then((user) => { commit('SET_RESOURCE', user); });
  },

  update({commit, dispatch}, params) {
    return service.update(params, this.$axios)
      .then((user) => { commit('SET_RESOURCE', user); });
  },

  destroy({commit, dispatch}, params) {
    return service.destroy(params), this.$axios;
  },

  upload({commit, dispatch}, {user, image}) {
    return service.upload(user, image, this.$axios)
      .then((url) => {
        commit('SET_URL', url);
      });
  }
};

export const getters = {
  getSubscriptions: state => state.subscriptions,
  list: state => state.list,
  listTotal: state => state.meta.page.total,
  user: state => state.user,
  getUsers: state => state.users,
  getSubscriptionUsers: state => state.subscriptionUsers,
  getSubscriptionUsersTotal: state => state.subscriptionUsersTotal,
  getUnsubscribedUsers: state => state.unsubscribedUsers,
  getUnsubscribedUsersTotal: state => state.unsubscribedUsersTotal,
  getUsersInvestment: state => state.usersInvestment,
  getPrevPage: state => state.prevPage,
  getNextPage: state => state.nextPage,
  totalUsers: state => state.users.length,
  url: state => state.url
};

