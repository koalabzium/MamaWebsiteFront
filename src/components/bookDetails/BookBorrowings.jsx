import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { getBooksBorrowings } from "../../services/bookService";
import { handleCancelBorrowing } from "../../services/borrowingService";

const BookBorrowings = ({ bookId }) => {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    if (bookId) {
      getBooksBorrowings(bookId).then(({ data }) => setBorrowings(data));
    }
  }, [bookId]);

  const onCancelBorrowing = (borrowing) => {
    handleCancelBorrowing(borrowing)
      .then(() => {
        setBorrowings((prev) => prev.filter(({ id }) => id !== borrowing.id));
      })
      .catch((err) => {
        // TODO: Display to user.
        console.error("Error when cenceling borrowing: ", err.message);
      });
  };

  return (
    <div>
      <ListGroup>
        {borrowings.map((b) =>
          b.active ? (
            <ListGroupItem style={{ padding: 5 }} variant="success" key={b.id}>
              {b.readerName} : {b.date} : {b.quantity}
              <button
                style={{
                  position: "absolute",
                  right: 5,
                  bottom: 1,
                }}
                className="btn btn-outline-danger btn-sm"
                onClick={() => onCancelBorrowing(b)}
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
