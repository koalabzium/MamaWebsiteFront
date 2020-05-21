import React from "react";
import AddBookForm from "./addBookForm";

const UpdateBook = (props) => {
  return (
    <div style={{ padding: 20 }}>
      <div className="card">
        <div className="card-body">
          <h2>
            Edytowanie "{props.book.title}"
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={(book) => {
                props.onDoneEdit(null);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h2>

          <AddBookForm
            book={props.book}
            history={props.history}
            onDoneEdit={props.onDoneEdit}
          ></AddBookForm>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
