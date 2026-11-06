import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import AddBookForm from "./addBookForm";
import BookFormScreen from "./BookFormScreen";
import { getBook } from "../services/bookService";
import useAuth from "../hooks/useAuth";

const EditBookScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  // The books list passes its query string (filters/sort/page) along, so
  // going back lands on the same view the edit was started from.
  const backTo = `/books${(location.state && location.state.from) || ""}`;
  const goBack = () => navigate(backTo);

  useEffect(() => {
    let cancelled = false;
    getBook(id)
      .then(({ data }) => !cancelled && setBook(data))
      .catch(() => !cancelled && setError("Nie można pobrać książki :("));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!isLoggedIn) {
    return (
      <BookFormScreen title="Edytowanie książki" onBack={goBack}>
        <Alert variant="warning">Zaloguj się w panelu adminki, żeby edytować książki.</Alert>
      </BookFormScreen>
    );
  }

  return (
    <BookFormScreen
      title="Edytowanie książki"
      subtitle={book ? `${book.title}${book.author ? ` — ${book.author}` : ""}` : null}
      onBack={goBack}
    >
      {error && <Alert variant="danger">{error}</Alert>}
      {!book && !error && (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" />
        </div>
      )}
      {book && <AddBookForm book={book} onDoneEdit={goBack} onCancel={goBack} />}
    </BookFormScreen>
  );
};

export default EditBookScreen;
