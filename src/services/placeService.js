import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "places/";

export function getPlaces() {
  return axios.get(apiEndpoint);
}

export function addPlace(name) {
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

export function deletePlace(id) {
  return axios({
    method: "delete",
    url: apiEndpoint + id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export function updatePlace(id, name) {
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
