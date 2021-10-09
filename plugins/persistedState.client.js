import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    key: 'shicAdminkey',
    paths: ["user", "profile"]
  })(store)
}
