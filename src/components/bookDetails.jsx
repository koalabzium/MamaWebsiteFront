import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OpenInNew, Edit, ArrowUpward, Close, Room } from "@material-ui/icons/";
import BookBorrowings from "./bookDetails/BookBorrowings";
import BookCover from "./common/bookCover";
import { getBooks } from "../services/bookService";
import useAuth from "../hooks/useAuth";

// Links are typed in by hand, so they're often blank or missing a protocol
// ("www.example.pl"), which the browser would resolve as a relative path
// inside this app. Returns null when there's nothing usable to link to.
const normalizeLink = (link) => {
  const trimmed = (link || "").trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const DESCRIPTION_PREVIEW = 420;
const sameAuthor = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

// Other books by the same author, for the "Więcej od: …" row. The books API
// only has a title-or-author substring search, so narrow its results down to
// an exact author match.
const useBooksByAuthor = (book) => {
  const [books, setBooks] = useState([]);
  const author = book && book.author;
  const id = book && book.id;

  useEffect(() => {
    setBooks([]);
    if (!author) return;
    let cancelled = false;
    getBooks({ search: author, sortBy: "title", order: "asc" })
      .then(({ data }) => {
        if (cancelled) return;
        setBooks((data.results || []).filter((b) => b.id !== id && sameAuthor(b.author, author)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [author, id]);

  return books;
};

const BookDetails = ({
  book,
  places,
  categories,
  onEdit,
  onBorrow,
  onBorrowingsChanged,
  onBrowse,
  onSelectBook,
  onHide,
  ...modalProps
}) => {
  const { isLoggedIn } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const moreByAuthor = useBooksByAuthor(book);
  const bookId = book && book.id;

  useEffect(() => setExpanded(false), [bookId]);

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
  const description = (book.description || "").trim();
  const longDescription = description.length > DESCRIPTION_PREVIEW;
  const shownDescription =
    longDescription && !expanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW).replace(/\s+\S*$/, "")}…`
      : description;

  // Clicking author/category/location browses the catalogue by it.
  const browse = (partial) => onBrowse && onBrowse(partial);

  return (
    <Modal
      {...modalProps}
      onHide={onHide}
      size="lg"
      aria-labelledby="book-details-title"
      centered
      enforceFocus={false}
      className="book-details"
    >
      <div className="book-details__hero">
        {book.image && (
          <div
            className="book-details__hero-bg"
            style={{ backgroundImage: `url("${book.image}")` }}
            aria-hidden="true"
          />
        )}
        <button type="button" className="book-details__close" onClick={onHide} aria-label="Zamknij">
          <Close />
        </button>

        <div className="book-details__hero-inner">
          <div className="book-details__cover">
            <BookCover src={book.image} title={book.title} author={book.author} />
          </div>

          <div className="book-details__headline">
            {categoryName && (
              <button
                type="button"
                className="book-details__category"
                onClick={() => browse({ category: book.category })}
                title="Pokaż książki z tej kategorii"
              >
                {categoryName}
              </button>
            )}
            <h2 id="book-details-title" className="book-details__title">
              {book.title}
            </h2>
            {book.author && (
              <button
                type="button"
                className="book-details__author"
                onClick={() => browse({ q: book.author })}
                title="Pokaż wszystkie książki tej autorki / autora"
              >
                {book.author}
              </button>
            )}
            {publisher && <div className="book-details__publisher">{publisher}</div>}

            <div
              className={`book-details__status ${available > 0 ? "is-available" : "is-unavailable"}`}
            >
              <div className="book-details__status-line">
                <span className="book-details__status-dot" />
                <strong>{available > 0 ? "Dostępna" : "Wypożyczona"}</strong>
                <span className="book-details__status-count">
                  {available > 0
                    ? `${available} z ${quantity} egz. na miejscu`
                    : `wszystkie egzemplarze (${quantity}) są wypożyczone`}
                </span>
              </div>
              {placeName && (
                <button
                  type="button"
                  className="book-details__place"
                  onClick={() => browse({ place: book.place })}
                  title="Pokaż książki z tej lokalizacji"
                >
                  <Room fontSize="inherit" /> {placeName}
                </button>
              )}
            </div>

            <div className="book-details__actions">
              {isLoggedIn && onBorrow && available > 0 && (
                <button className="btn btn-warning btn-sm" onClick={() => onBorrow(book)}>
                  <ArrowUpward fontSize="inherit" /> Wypożycz
                </button>
              )}
              {link && (
                <a
                  className="btn btn-outline-dark btn-sm"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Strona z książką <OpenInNew fontSize="inherit" />
                </a>
              )}
              {isLoggedIn && onEdit && (
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onEdit(book)}>
                  <Edit fontSize="inherit" /> Edytuj
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal.Body className="book-details__body">
        {description && (
          <section className="book-details__section">
            <h3 className="book-details__section-title">Opis</h3>
            <p className="book-details__description">{shownDescription}</p>
            {longDescription && (
              <button
                type="button"
                className="btn btn-link btn-sm p-0"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Pokaż mniej" : "Czytaj dalej"}
              </button>
            )}
          </section>
        )}

        <section className="book-details__section">
          <h3 className="book-details__section-title">Szczegóły</h3>
          <dl className="book-details__facts">
            <dt>Tytuł</dt>
            <dd>{book.title}</dd>
            {book.author && (
              <>
                <dt>Autor(ka)</dt>
                <dd>{book.author}</dd>
              </>
            )}
            {publisher && (
              <>
                <dt>Wydawnictwo</dt>
                <dd>{publisher}</dd>
              </>
            )}
            {categoryName && (
              <>
                <dt>Kategoria</dt>
                <dd>{categoryName}</dd>
              </>
            )}
            {placeName && (
              <>
                <dt>Lokalizacja</dt>
                <dd>{placeName}</dd>
              </>
            )}
            <dt>Egzemplarze</dt>
            <dd>
              {quantity} (dostępne: {available})
            </dd>
          </dl>
        </section>

        {moreByAuthor.length > 0 && (
          <section className="book-details__section">
            <h3 className="book-details__section-title">Więcej od: {book.author}</h3>
            <div className="book-details__more">
              {moreByAuthor.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  className="book-details__more-item"
                  onClick={() => onSelectBook && onSelectBook(b)}
                  title={b.title}
                >
                  <div className="book-details__more-cover">
                    <BookCover src={b.image} title={b.title} lazy />
                  </div>
                  <span className="book-details__more-title">{b.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {isLoggedIn && (
          <section className="book-details__section">
            <h3 className="book-details__section-title">Wypożyczenia</h3>
            <BookBorrowings bookId={book.id} onChanged={onBorrowingsChanged} />
          </section>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookDetails;
