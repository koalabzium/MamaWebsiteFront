import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "books/";

export function getBooks() {
  return axios.get(apiEndpoint);
}

export function getBook(id) {
  return axios.get(apiEndpoint + id);
}

export function deleteBook(id) {
  return axios({
    method: "delete",
    url: apiEndpoint + id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export function editBook(data) {
  return axios({
    method: "put",
    url: apiEndpoint + data.id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    data,
  });
}

export function addBook(data) {
  return axios({
    method: "post",
    url: apiEndpoint,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data,
  });
}
