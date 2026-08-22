import React from "react";
import AddBookForm from "./addBookForm";

const UpdateBookScreen = ({ book, onDoneEdit }) => (
  <div style={{ padding: 20 }}>
    <div className="card">
      <div className="card-body">
        <h2>
          Edytowanie "{book.title}"
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => onDoneEdit(null)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </h2>

        <AddBookForm book={book} onDoneEdit={onDoneEdit} />
      </div>
    </div>
  </div>
);

export default UpdateBookScreen;
