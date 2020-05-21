import React, { Component } from "react";
import AddBookForm from "./addBookForm";

const AddBook = (props) => {
  return (
    <div style={{ padding: 20 }}>
      <div className="card">
        <div className="card-body">
          <h2>
            Dodawanie nowej książki
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={(book) => {
                console.log("QUIT");
                props.onDoneAdd(null);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h2>

          <AddBookForm onDoneAdd={props.onDoneAdd} />
        </div>
      </div>
    </div>
  );
};

export default AddBook;
