import { url } from "../apiURL.json";
import axios from "axios";

const apiEndpoint = url + "books";

export function getBooks() {
  return axios.get(apiEndpoint);
}

// export function getBook(title) {
//     return
// }
