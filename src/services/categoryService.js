import axios from "axios";

const apiEndpoint = process.env.API_URL + "categories";

export function getCategories() {
  return axios.get(apiEndpoint);
}
