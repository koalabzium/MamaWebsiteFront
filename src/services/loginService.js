import { url } from "../apiURL.json";
import axios from "axios";

const apiEndpoint = url + "login";

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
