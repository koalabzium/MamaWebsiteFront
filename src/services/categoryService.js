import { url } from "../apiURL.json";
import axios from "axios";

const apiEndpoint = url + "categories";

export function getCategories() {
  return axios.get(apiEndpoint);
}
