import React, { useEffect, useState } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

const { REACT_APP_API_URL } = process.env;

const BookBorrowings = ({ bookId }) => {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    if (bookId) {
      axios
        .get(`${REACT_APP_API_URL}books/${bookId}/borrowings`)
        .then(({ data }) => {
          console.log("borrowings", data);
          setBorrowings(data);
        });
    }
  }, [bookId]);

  const handleDeleteBorrowing = (bookId) => {
    axios
      .get(`${REACT_APP_API_URL}books/${bookId}/borrowings`)
      .then(({ data }) => {
        console.log("borrowings", data);
        setBorrowings(data);
      });
  };

  return (
    <div>
      <ListGroup>
        {borrowings.map((b) =>
          b.active ? (
            <ListGroupItem style={{ padding: 5 }} variant="success" key={b.id}>
              {b.readerName} : {b.date} : {b.quantity} : {b.readerId}
              <button
                style={{
                  position: "absolute",
                  right: 5,
                  bottom: 1,
                }}
                className="btn btn-outline-danger btn-sm"
                onClick={this.stopPropagationAndCall(() =>
                  handleDeleteBorrowing(b.id)
                )}
              >
                X
              </button>
            </ListGroupItem>
          ) : null
        )}
      </ListGroup>
    </div>
  );
};

export default BookBorrowings;
