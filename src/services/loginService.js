import axios from "axios";

const apiEndpoint = process.env.API_URL + "login";

export function login(name, password) {
  return axios({
    method: "post",
    url: apiEndpoint,
    headers: {},
    data: {
      name,
      password,
    },
  });
}
