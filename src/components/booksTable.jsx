import React, { Component } from "react";
import Like from "./common/like";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

class BooksTable extends Component {
  state = {
    redirect: false,
  };

  render() {
    const {
      books,
      likedSet,
      onLike,
      onDelete,
      onSort,
      history,
      categories,
    } = this.props;

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th />
              <th className="clickable" onClick={() => onSort("title")}>
                Tytuł
              </th>
              <th className="clickable" onClick={() => onSort("author")}>
                Autor(ka)
              </th>
              <th>Kategoria</th>
              <th>Okładka</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                className="clickable"
                onClick={() =>
                  history.push(`${process.env.PUBLIC_URL}/books/${book.title}`)
                }
                key={book.title}
              >
                <td>
                  <Like
                    liked={likedSet.has(book.title)}
                    onClickToggle={() => onLike(book)}
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{categories.get(book.category)}</td>
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
  }
}

BooksTable.propTypes = {
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BooksTable;
