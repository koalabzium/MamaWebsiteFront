import React, { Component } from "react";
import axios from "axios";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import BooksTable from "./booksTable";

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
        <BooksTable
          slicedBooks={slicedBooks}
          likedSet={likedSet}
          onLike={this.handleLike}
          onDelete={this.handleDelete}
        />
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
