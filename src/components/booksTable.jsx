import React from "react";
import PropTypes from "prop-types";
import { ArrowUpward, DeleteForever, Edit } from "@material-ui/icons/";

const BooksTable = (props) => {

  const stopPropagationAndCall = (func) => (e) => {
    e.stopPropagation();
    func();
  };

  const checkAvailibility = (book) => {
    return book.available <= 0;
  };


  const {
    books,
    onEdit,
    onDelete,
    onBorrow,
    onSort,
    categories,
    places,
    logged,
    onClick
  } = props;

  return (
    <div className="table-responsive">
      <table className="table table-hover books-table">
        <thead>
          <tr>
            {logged ? <th>Akcje</th> : null}
            <th className="clickable" onClick={() => onSort("title")}>
              Tytuł
            </th>

            <th className="clickable" onClick={() => onSort("author")}>
              Autor(ka)
            </th>
            <th>Kategoria</th>
            <th>Dostępnych</th>
            <th className="clickable" onClick={() => onSort("place")}>
              Lokalizacja
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              className="clickable"
              onClick={() => onClick(book)}
              key={book.id}
            >
              {logged ? (
                <td data-label="Akcje" className="actions-cell">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Usuń"
                    disabled={false}
                    onClick={stopPropagationAndCall(() =>
                      onDelete(book)
                    )}
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
                    disabled={checkAvailibility(book)}
                    onClick={stopPropagationAndCall(() =>
                      onBorrow(book)
                    )}
                  >
                    <ArrowUpward />
                  </button>
                </td>
              ) : null}
              <td data-label="Tytuł">{book.title}</td>
              <td data-label="Autor(ka)">{book.author}</td>
              <td data-label="Kategoria">{categories.get(book.category)}</td>
              <td data-label="Dostępnych">{book.available}</td>
              <td data-label="Lokalizacja">{places.get(book.place)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

BooksTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default BooksTable;
