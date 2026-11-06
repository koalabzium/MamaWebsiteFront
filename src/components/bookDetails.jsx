import React from "react";
import Modal from "react-bootstrap/Modal";
import { OpenInNew, Edit } from "@material-ui/icons/";
import BookBorrowings from "./bookDetails/BookBorrowings";
import BookCover from "./common/bookCover";
import useAuth from "../hooks/useAuth";

// Links are typed in by hand, so they're often blank or missing a protocol
// ("www.example.pl"), which the browser would resolve as a relative path
// inside this app. Returns null when there's nothing usable to link to.
const normalizeLink = (link) => {
  const trimmed = (link || "").trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const BookDetails = ({ book, places, categories, onEdit, ...modalProps }) => {
  const { isLoggedIn } = useAuth();

  if (!book) {
    return null;
  }

  const link = normalizeLink(book.link);
  const placeName = places.get(book.place);
  const categoryName = categories && categories.get(book.category);
  // The DB field is called "location", but it has always held the publisher.
  const publisher = (book.location || "").trim();
  const available = Number(book.available) || 0;
  const quantity = Number(book.quantity) || 0;

  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="book-details-title"
      centered
      className="book-details"
    >
      <Modal.Header closeButton className="book-details__header" />
      <Modal.Body className="book-details__body">
        <div className="book-details__layout">
          <div className="book-details__cover">
            <BookCover src={book.image} title={book.title} author={book.author} />
          </div>

          <div className="book-details__info">
            {book.author && <div className="book-details__author">{book.author}</div>}
            <h2 id="book-details-title" className="book-details__title">
              {book.title}
            </h2>

            <span
              className={`book-details__availability ${
                available > 0 ? "is-available" : "is-unavailable"
              }`}
            >
              {available > 0
                ? `Dostępne: ${available} z ${quantity}`
                : `Wszystkie egzemplarze wypożyczone (${quantity})`}
            </span>

            <dl className="book-details__facts">
              {placeName && (
                <>
                  <dt>Lokalizacja</dt>
                  <dd>{placeName}</dd>
                </>
              )}
              {categoryName && (
                <>
                  <dt>Kategoria</dt>
                  <dd>{categoryName}</dd>
                </>
              )}
              {publisher && (
                <>
                  <dt>Wydawnictwo</dt>
                  <dd>{publisher}</dd>
                </>
              )}
            </dl>

            <div className="book-details__actions">
              {link && (
                <a
                  className="btn btn-outline-info btn-sm"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Strona z książką <OpenInNew fontSize="inherit" />
                </a>
              )}
              {isLoggedIn && onEdit && (
                <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(book)}>
                  <Edit fontSize="inherit" /> Edytuj
                </button>
              )}
            </div>
          </div>
        </div>

        {book.description && <p className="book-details__description">{book.description}</p>}

        {isLoggedIn && (
          <div className="book-details__borrowings">
            <h6>Wypożyczenia</h6>
            <BookBorrowings bookId={book.id} />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookDetails;
