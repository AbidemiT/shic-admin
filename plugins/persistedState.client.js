import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    key: 'shicAdminkey',
    paths: ["user", "profile", 'investment']
  })(store)
}
