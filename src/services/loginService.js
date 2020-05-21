import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "login";

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
