import React from "react";
import Like from "./common/like";
import PropTypes from "prop-types";

const BooksTable = props => {
  const { books, likedSet, onLike, onDelete, onSort } = props;

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th />
            <th onClick={() => onSort("title")}>Tytuł</th>
            <th onClick={() => onSort("author")}>Autor(ka)</th>
            <th>Link</th>
            <th>Okładka</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.title}>
              <td>
                <Like
                  liked={likedSet.has(book.title)}
                  onClickToggle={() => onLike(book)}
                />
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.link}</td>
              <td>
                <img src={`data:image/jpeg;base64,${book.image}`} />
              </td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(book)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

BooksTable.propTypes = {
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BooksTable;
