import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_URL + "borrowings/";

export function editBorrowing(data) {
  return axios({
    method: "put",
    url: apiEndpoint + data.id,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    data,
  });
}

export function returnBook(borrowingId) {
  const data = {
    active: false,
  };
  return axios({
    method: "put",
    url: apiEndpoint + borrowingId,
    headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
    data,
  });
}

export function addBorrowing(data) {
  console.log("w serwisie: ", data);
  return axios({
    method: "post",
    url: apiEndpoint,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data,
  });
}

export function handleCancelBorrowing(borrowing) {
  return axios
    .post(
      `${apiEndpoint}/${borrowing.id}/cancel`,
      {},
      {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      // TODO: Display to user.
      console.error("Error when cenceling borrowing: ", err.message);
    });
}
