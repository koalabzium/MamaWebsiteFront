import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "categories/";

export function getCategories() {
  return axios.get(apiEndpoint);
}

export function addCategory(name) {
  return axios({
    method: "post",
    url: apiEndpoint,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      name,
    },
  });
}

export function deleteCategory(id) {
  return axios({
    method: "delete",
    url: apiEndpoint + id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export function updateCategory(id, name) {
  return axios({
    method: "put",
    url: apiEndpoint + id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    data: {
      id,
      name,
    },
  });
}
