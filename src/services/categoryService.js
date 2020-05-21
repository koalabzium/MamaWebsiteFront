import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "categories";

export function getCategories() {
  return axios.get(apiEndpoint);
}
