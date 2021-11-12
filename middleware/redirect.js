export default function ({
  store,
  redirect
}) {
  // If the user is not authenticated
  if (!store.state.profile.authenticated) {
    return redirect("/");
  }

  if(store.state.profile.admin.roles.length != 2 || store.state.profile.admin.roles[1].name != "Super_Admin" ) {
    return redirect("/")
  }
}