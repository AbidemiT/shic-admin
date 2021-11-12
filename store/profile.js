import service from '../services/profile-service';

export const state = () => ({
  admin: null,
  role: null,
  authenticated: false,
  accessToken: ''
});

export const mutations = {
  SET_ADMIN: (state, admin) => {
    state.admin = admin;
  },
  SET_IS_AUTHENTICATED: (state, authenticated) => {
    state.authenticated = authenticated;
  },
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken;
  },
  SET_ROLE: (state, role) => {
    state.role = role;
  },
};

export const actions = {
  me({commit, dispatch}, params) {
    return service.get(params, this.$axios)
      .then((profile) => {
        commit('SET_RESOURCE', profile.list);
      });
  },

  update({commit, dispatch}, params) {
    return service.update(params, this.$axios)
      .then((profile) => {
        commit('SET_RESOURCE', profile);
      });
  },
};

export const getters = {
  me: state => state.me,
  getAccessToken: state => state.accessToken,
  getARole: state => state.role,
};
