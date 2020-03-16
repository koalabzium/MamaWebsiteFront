import React, { Component } from "react";
import axios from "axios";
import Like from "./common/like";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";

export class BooksView extends Component {
  state = {
    books: [],
    liked: [],
    likedSet: new Set(),
    pageSize: 1,
    currentPage: 1
  };

  async componentDidMount() {
    const url = require("../apiURL.json");
    const { data: books } = await axios.get(url.url);
    this.setState({ books });
    const liked =
      localStorage.getItem("likedBooks") === null
        ? []
        : JSON.parse(localStorage.getItem("likedBooks"));
    let likedSet = new Set();
    liked.map(book => likedSet.add(book.title));
    this.setState({ liked, likedSet });
  }

  handleDelete = book => {
    console.log("Deleting" + book);
  };

  handleLike = book => {
    let liked = this.state.liked;
    let likedSet = this.state.likedSet;

    if (likedSet.has(book.title)) {
      liked = liked.filter(b => b.title !== book.title);
      likedSet.delete(book.title);
    } else {
      liked.push(book);
      likedSet.add(book.title);
    }

    this.setState({ liked, likedSet });
    localStorage.setItem("likedBooks", JSON.stringify(liked));
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  render() {
    const { books, liked, likedSet, pageSize, currentPage } = this.state;
    const slicedBooks = paginate(books, currentPage, pageSize);
    if (books.length === 0)
      return (
        <div>
          <h2>Ładowanie...</h2>
        </div>
      );
    return (
      <React.Fragment>
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Tytuł</th>
              <th>Autor(ka)</th>
              <th>Link</th>
              <th>Okładka</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {slicedBooks.map(book => (
              <tr key={book.title}>
                <td>
                  <Like
                    liked={likedSet.has(book.title)}
                    onClickToggle={() => this.handleLike(book)}
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
                    onClick={() => this.handleDelete(book)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsCount={books.length}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />
        <h3>Twoje polubione książki: </h3>
        <ul>
          {liked.map(book => (
            <li key={book.title}>{book.title}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default BooksView;
