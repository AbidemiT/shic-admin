export default function ({
  $axios,
  redirect,
  store
}) {
  $axios.onRequest((config) => {
    console.log(config);
    console.log('Making request to ' + config.url)
    if (store.state.profile.authenticated) {
      const token = store['getters']['profile/getAccessToken']
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['Content-Type'] = `application/json`
    }
  })

  $axios.onError(({
    response
  }) => {
    console.log(response)
    // if (
    //   response.data.message.toString().toLowerCase() === 'jwt expired' ||
    //   response.data.message.toString().toLowerCase() === 'invalid token'
    // ) {
    //   redirect('/signin')
    // }
  })

  $axios.onResponse(({
    config,
    data
  }) => {
    // eslint-disable-next-line no-console
    console.log(`Request made from ${config.url} returned`)
  })
}

  