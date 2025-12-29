import React from "react";
import AddBookForm from "./addBookForm";
import { useNavigate } from "react-router-dom";

const AddBookScreen = () => {

  const navigate = useNavigate();

  const onClose = () => {
    navigate("/books");
  };

  const onDone = (book) => {
    navigate(`/books?bookId=${book.id}`);
  };

  return (
    <div className="m-1">
      <div className="card">
        <div className="card-body">
          <h2>
            Dodawanie nowej książki
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h2>

          <AddBookForm
            onDoneAdd={onDone} />
        </div>
      </div>
    </div>
  );
};

export default AddBookScreen;
