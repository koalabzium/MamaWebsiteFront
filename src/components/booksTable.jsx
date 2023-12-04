import React from "react";
import PropTypes from "prop-types";
import { ArrowUpward, DeleteForever, Edit } from "@material-ui/icons/";

const BooksTable = (props) => {
  const deleteBorrowing = (book, borrowing_id) => {
    console.log(book, borrowing_id);
  };

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
      <table className="table table-hover">
        <thead>
          <tr>
            {logged ? <th></th> : null}
            {logged ? <th></th> : null}
            {logged ? <th></th> : null}
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
                <td>
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
                </td>
              ) : null}
              {logged ? (
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Edytuj"
                    onClick={stopPropagationAndCall(() => onEdit(book))}
                  >
                    <Edit />
                  </button>
                </td>
              ) : null}
              {logged ? (
                <td>
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
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{categories.get(book.category)}</td>
              <td>{book.available}</td>
              <td>{places.get(book.place)}</td>
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
