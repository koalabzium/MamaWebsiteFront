import React from "react";
import BorrowingForm from "./borrowingForm";

const BorrowBook = (props) => {
  return (
    <div style={{ padding: 20 }}>
      <div className="card">
        <div className="card-body">
          <h2>
            Wypożyczanie "{props.book.title}"
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={(book) => {
                props.onDoneBorrow(null);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h2>

          <BorrowingForm
            book={props.book}
            history={props.history}
            onDoneBorrow={props.onDoneBorrow}
          />
        </div>
      </div>
    </div>
  );
};

export default BorrowBook;
