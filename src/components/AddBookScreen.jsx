import React from "react";
import { useNavigate } from "react-router-dom";
import AddBookForm from "./addBookForm";
import BookFormScreen from "./BookFormScreen";

const AddBookScreen = () => {
  const navigate = useNavigate();

  const onClose = () => navigate("/books");

  const onDone = (book) => {
    // Same primitive useBooksQueryState builds on (URLSearchParams), so both
    // ways of landing on a book's detail modal stay consistent.
    navigate(`/books?${new URLSearchParams({ bookId: book.id }).toString()}`);
  };

  return (
    <BookFormScreen title="Dodawanie nowej książki" onBack={onClose}>
      <AddBookForm onDoneAdd={onDone} onCancel={onClose} />
    </BookFormScreen>
  );
};

export default AddBookScreen;
