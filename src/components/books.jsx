import React, { Component } from "react";
import axios from "axios";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import BooksTable from "./booksTable";
import LikedBooks from "./likedBooks";
import _ from "lodash";
import Categories from "./categories";

export class BooksView extends Component {
  state = {
    books: [],
    liked: [],
    likedSet: new Set(),
    pageSize: 2,
    currentPage: 1,
    sortColumn: {
      name: "title",
      order: "asc"
    },
    categories: [],
    currentCategory: null
  };

  async componentDidMount() {
    const url = require("../apiURL.json");
    const { data: books } = await axios.get(url.url + "books");
    const { data: categories } = await axios.get(url.url + "categories");
    this.setState({ books });
    this.setState({ categories });
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

  handleSort = column => {
    let sortColumn = this.state.sortColumn;
    if (sortColumn.name === column) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn = { name: column, order: "asc" };
    }
    this.setState({ sortColumn });
  };

  handleFilter = category => {
    console.log(category);
    this.setState({ currentCategory: category });
  };

  render() {
    const {
      books,
      liked,
      likedSet,
      pageSize,
      currentPage,
      sortColumn,
      categories,
      currentCategory
    } = this.state;
    const filtered =
      currentCategory !== null
        ? books.filter(book => book.category === currentCategory)
        : books;
    const sorted = _.orderBy(filtered, [sortColumn.name], [sortColumn.order]);
    const slicedBooks = paginate(sorted, currentPage, pageSize);

    if (books.length === 0)
      return (
        <div>
          <h2>Ładowanie...</h2>
        </div>
      );
    return (
      <React.Fragment>
        <Categories categories={categories} onFilter={this.handleFilter} />

        <BooksTable
          books={slicedBooks}
          likedSet={likedSet}
          history={this.props.history}
          onLike={this.handleLike}
          onDelete={this.handleDelete}
          onSort={this.handleSort}
        />
        <Pagination
          itemsCount={books.length}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />
        <LikedBooks liked={liked} />
      </React.Fragment>
    );
  }
}

export default BooksView;
