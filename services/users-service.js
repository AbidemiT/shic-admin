import qs from 'qs';
import Jsona from 'jsona';

const url = process.env.NUXT_APP_BASE_URL;
const jsona = new Jsona();

function list(params, axios) {
  const options = {
    params: params,
    paramsSerializer: function (params) {
      return qs.stringify(params, {encode: false});
    }
  };

  return axios.get(`${url}/users`, options)
    .then(response => {
      return {
        list: jsona.deserialize(response.data),
        meta: response.data.meta
      };
    });
}

function get(id, axios) {
  return axios.get(`${url}/users/${id}`)
    .then(response => {
      let user = jsona.deserialize(response.data);
      delete user.links;
      return user;
    });
}

async function getUsers(axios) {
  // let response = await axios.get(`http://209.97.136.114/api/v1/Management/user/users`)
  let response = await axios.get(`/Management/user/users`)
  console.log({response});
  let users = response.data.data
  return users;
}
async function getUsersInvestment(axios) {
  // let response = await axios.get(`http://209.97.136.114/api/v1/investment/investments`)
  let response = await axios.get(`/investment/investments`)
  console.log({responseUserInvestment: response});
  let usersInvestment = response.data.data
  return usersInvestment;
}

function add(user, axios) {
  const payload = jsona.serialize({
    stuff: user,
    includeNames: null
  });

  return axios.post(`${url}/users`, payload, options)
    .then(response => {
      return jsona.deserialize(response.data);
    });
}

function update(user, axios) {
  const payload = jsona.serialize({
    stuff: user,
    includeNames: []
  });

  return axios.patch(`${url}/users/${user.id}`, payload)
    .then(response => {
      return jsona.deserialize(response.data);
    });
}

function destroy(id, axios) {
  return axios.delete(`${url}/users/${id}`, options);
}

function upload(user, image, nuxt_axios) {
  const payload = new FormData();
  payload.append('attachment', image);

  let axios = nuxt_axios.create()
  delete axios.defaults.headers.common['content-type']
  delete axios.defaults.headers.post['content-type']

  return axios({
    method: 'POST',
    url: `/uploads/users/${user.id}/profile-image`,
    data: payload,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
    }) .then(response => {
        return response.data.url;
      });
}

export default {
  list,
  get,
  getUsers,
  getUsersInvestment,
  add,
  update,
  destroy,
  upload
};

