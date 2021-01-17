import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "readers/";

export function getReaders() {
  return axios.get(apiEndpoint);
}

export function getReader(id) {
  return axios.get(apiEndpoint + id);
}

export function getReadersBorrowings(id) {
  return axios.get(apiEndpoint + id + "/borrowings");
}

export function addReader(name) {
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

export function deleteReader(id) {
  return axios({
    method: "delete",
    url: apiEndpoint + id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export function updateReader(id, name) {
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
