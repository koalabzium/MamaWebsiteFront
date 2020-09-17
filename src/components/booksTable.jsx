import React, { Component } from "react";
import PropTypes from "prop-types";
import { ArrowUpward, DeleteForever, Edit } from "@material-ui/icons/";
import BookDetails from "./bookDetails";

class BooksTable extends Component {
  state = {
    current_book: null,
    to_delete: null,
  };

  // Edytuj tu książkę,

  deleteBorrowing = (book, borrowing_id) => {
    console.log(book, borrowing_id);
  };

  stopPropagationAndCall = (func) => (e) => {
    e.stopPropagation();
    func();
  };

  checkAvailibility = (book) => {
    return book.available <= 0;
  };

  render() {
    const {
      books,
      onEdit,
      onDelete,
      onBorrow,
      onSort,
      categories,
      logged,
    } = this.props;

    const { current_book } = this.state;

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
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                className="clickable"
                onClick={() => {
                  this.setState({ current_book: book });
                }}
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
                      onClick={this.stopPropagationAndCall(() =>
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
                      onClick={this.stopPropagationAndCall(() => onEdit(book))}
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
                      disabled={this.checkAvailibility(book)}
                      onClick={this.stopPropagationAndCall(() =>
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
              </tr>
            ))}
          </tbody>
        </table>
        <BookDetails
          show={current_book && true}
          onHide={() => this.setState({ current_book: null })}
          book={current_book}
        />
      </div>
    );
  }
}

BooksTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default BooksTable;
