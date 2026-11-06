import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import BookFormScreen from "./BookFormScreen";
import BookCover from "./common/bookCover";
import { getBook } from "../services/bookService";
import { getReaders } from "../services/readerService";
import { addBorrowing } from "../services/borrowingService";
import { todayLocal } from "../utils/dates";
import useAuth from "../hooks/useAuth";

// One copy per borrowing — borrowing several copies at once isn't something
// the library does, so the amount is fixed rather than editable.
const QUANTITY = 1;

const errorMessage = (err) =>
  (err.response && err.response.data && (err.response.data.message || err.response.data.error)) ||
  "Nie udało się wypożyczyć książki. Spróbuj ponownie.";

const BorrowBookScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [book, setBook] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [readerOptions, setReaderOptions] = useState([]);
  const [reader, setReader] = useState(null);
  const [date, setDate] = useState(todayLocal);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const backTo = `/books${(location.state && location.state.from) || ""}`;
  const goBack = (state) => navigate(backTo, state ? { state } : undefined);

  useEffect(() => {
    let cancelled = false;
    getBook(id)
      .then(({ data }) => !cancelled && setBook(data))
      .catch(() => !cancelled && setLoadError("Nie można pobrać książki :("));
    getReaders().then(({ data }) => {
      if (cancelled) return;
      setReaderOptions(
        [...data]
          .sort((a, b) => (a.name || "").localeCompare(b.name || "", "pl"))
          .map((r) => ({ value: r.id, label: r.name }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const available = book ? Number(book.available) || 0 : 0;
  const canSubmit = book && reader && date && available >= QUANTITY && !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      await addBorrowing({
        bookId: book.id,
        readerId: reader.value,
        readerName: reader.label,
        date,
        quantity: QUANTITY,
      });
      goBack({
        flash: {
          variant: "success",
          message: `Wypożyczono „${book.title}” — ${reader.label}.`,
        },
      });
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <BookFormScreen title="Wypożyczanie książki" onBack={() => goBack()}>
        <Alert variant="warning">Zaloguj się w panelu adminki, żeby wypożyczać książki.</Alert>
      </BookFormScreen>
    );
  }

  return (
    <BookFormScreen title="Wypożyczanie książki" onBack={() => goBack()}>
      {loadError && <Alert variant="danger">{loadError}</Alert>}
      {!book && !loadError && (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" />
        </div>
      )}

      {book && (
        <form onSubmit={handleSubmit} noValidate className="borrow-form">
          <div className="borrow-form__book">
            <div className="borrow-form__cover">
              <BookCover src={book.image} title={book.title} author={book.author} />
            </div>
            <div>
              {book.author && <div className="book-details__author">{book.author}</div>}
              <h3 className="borrow-form__title">{book.title}</h3>
              <span
                className={`book-details__availability ${
                  available > 0 ? "is-available" : "is-unavailable"
                }`}
              >
                {available > 0
                  ? `Dostępne: ${available} z ${book.quantity}`
                  : "Wszystkie egzemplarze są wypożyczone"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="borrow-reader">Czytelniczka / czytelnik</label>
            <Select
              inputId="borrow-reader"
              options={readerOptions}
              value={reader}
              onChange={setReader}
              placeholder="Wybierz osobę"
              isDisabled={available <= 0}
            />
          </div>

          <div className="form-row">
            <div className="form-group col-sm-6">
              <label htmlFor="borrow-date">Data wypożyczenia</label>
              <input
                id="borrow-date"
                className="form-control"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={available <= 0}
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="borrow-quantity">Ilość</label>
              <input
                id="borrow-quantity"
                className="form-control"
                type="text"
                value={`${QUANTITY} egz.`}
                readOnly
                disabled
              />
            </div>
          </div>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <div className="book-form__footer">
            <button type="button" className="btn btn-outline-secondary" onClick={() => goBack()}>
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
              {saving ? "Wypożyczanie…" : "Wypożycz"}
            </button>
          </div>
        </form>
      )}
    </BookFormScreen>
  );
};

export default BorrowBookScreen;
