import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    key: 'shicAdminkey',
    paths: ["users", "profile", 'investment', 'lessons']
  })(store)
}
