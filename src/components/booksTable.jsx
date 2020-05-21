import React, { Component } from "react";
import PropTypes from "prop-types";
import MyModal from "./common/modal";

class BooksTable extends Component {
  state = {
    current_book: null,
  };

  stopPropagationAndCall = (func) => (e) => {
    e.stopPropagation();
    func();
  };

  render() {
    const { books, onEdit, onDelete, onSort, categories, logged } = this.props;

    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="clickable" onClick={() => onSort("title")}>
                Tytuł
              </th>
              <th className="clickable" onClick={() => onSort("author")}>
                Autor(ka)
              </th>
              <th>Kategoria</th>
              <th>Dostępność</th>
              {this.state.logged ? <th></th> : null}
              {this.state.logged ? <th></th> : null}
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
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{categories.get(book.category)}</td>
                {book.available > 0 ? <td>tak</td> : <td>nie</td>}

                {logged ? (
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={this.stopPropagationAndCall(() =>
                        onDelete(book)
                      )}
                    >
                      X
                    </button>
                  </td>
                ) : null}
                {logged ? (
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={this.stopPropagationAndCall(() => onEdit(book))}
                    >
                      Edytuj
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        <MyModal
          show={this.state.current_book && true}
          onHide={() => this.setState({ current_book: null })}
          book={this.state.current_book}
        />
      </div>
    );
  }
}

BooksTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default BooksTable;
