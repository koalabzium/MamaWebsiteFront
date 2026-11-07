import React from "react";
import PropTypes from "prop-types";
import { ArrowUpward, DeleteForever, Edit } from "@material-ui/icons/";
import BookCover from "./common/bookCover";

const isUnavailable = (book) => book.available <= 0;

const BooksGrid = (props) => {
  const { books, onEdit, onDelete, onBorrow, categories, places, logged, onClick } = props;

  const stopPropagationAndCall = (func) => (e) => {
    e.stopPropagation();
    func();
  };

  return (
    <div className="books-grid">
      {books.map((book) => (
        <div className="book-card clickable" onClick={() => onClick(book)} key={book.id}>
          <div className="book-card__cover">
            <BookCover src={book.image} title={book.title} author={book.author} lazy />
            {isUnavailable(book) && (
              <span className="book-card__badge">Wypożyczona</span>
            )}
          </div>

          <div className="book-card__body">
            <div className="book-card__title" title={book.title}>
              {book.title}
            </div>
            <div className="book-card__author" title={book.author}>
              {book.author}
            </div>
            <div className="book-card__meta">
              {categories.get(book.category) && (
                <span className="book-card__pill">{categories.get(book.category)}</span>
              )}
              {places.get(book.place) && (
                <span className="book-card__pill book-card__pill--muted">
                  {places.get(book.place)}
                </span>
              )}
            </div>
          </div>

          {logged && (
            <div className="book-card__actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn btn-outline-danger btn-sm"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Usuń"
                onClick={stopPropagationAndCall(() => onDelete(book))}
              >
                <DeleteForever />
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Edytuj"
                onClick={stopPropagationAndCall(() => onEdit(book))}
              >
                <Edit />
              </button>
              <button
                className="btn btn-outline-warning btn-sm"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Wypożycz"
                disabled={isUnavailable(book)}
                onClick={stopPropagationAndCall(() => onBorrow(book))}
              >
                <ArrowUpward />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

BooksGrid.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default BooksGrid;
