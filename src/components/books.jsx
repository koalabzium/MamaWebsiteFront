import React, { Component } from "react";
import Pagination from "./common/pagination";
import BooksTable from "./booksTable";
import _ from "lodash";
import Categories from "./categories";
import { getBooks, deleteBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import UpdateBook from "./updateBook";
import AddBook from "./addBook";
import BorrowBook from "./borrowBook";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getReaders } from "../services/readerService";
import Input from "./common/input";

export class BooksView extends Component {
  state = {
    books: [],
    pageSize: 10,
    totalCount: 0,
    currentPage: 1,
    sortColumn: {
      name: "title",
      order: "asc",
    },
    categories: [],
    currentCategory: null,
    categoriesLookup: new Map(),
    logged: localStorage.getItem("token"),
    editedBook: null,
    borrowedBook: null,
    adding: false,
    loaded: false,
    addingCategory: false,
    searchPhrase: "",
    error: null,
  };

  async reloadBooks(page, categoryId, search) {
    try {
      const { data: booksRes } = await getBooks({
        page,
        categoryId,
        search,
      });

      const { results = [], totalCount = 0 } = booksRes;

      this.setState({ books: results, loaded: true, totalCount: totalCount });
    } catch (e) {
      console.error(e.message);
      this.setState({
        error: new Error("Nie można pobrać książek :("),
      });
    }
  }

  async componentDidMount() {
    const { currentPage, currentCategory, searchPhrase } = this.state;
    this.reloadBooks(currentPage, currentCategory, searchPhrase);
    const categories = await getCategories();
    const cat = categories.data;
    cat.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    this.setState({
      categories: cat,
    });

    const readersData = await getReaders();
    var readers = new Map();
    readersData.data.map((r) => readers.set(r.id, r.name));
    this.setState({ readers });
    var lookup = new Map();
    categories.data.map((cat) => lookup.set(cat.id, cat.name));
    this.setState({ categoriesLookup: lookup });
  }

  confirmDelete = (book) => {
    confirmAlert({
      title: `Usuwanie ${book.title}`,
      message: "Jesteś pewna?",
      buttons: [
        {
          label: "Tak",
          onClick: () => this.handleDelete(book),
        },
      ],
    });
  };

  handleDelete = async (book) => {
    console.log("Deleting", book);
    const books = this.state.books.filter((b) => b.id !== book.id);
    console.log(books);
    this.setState({ books });
    deleteBook(book.id);
  };

  handleEdit = (book) => {
    console.log("Editing");
    this.setState({ adding: false });
    this.setState({ borrowedBook: null });
    this.setState({ editedBook: book });
    window.scrollTo(0, 0);
  };

  handleEditDone = (book) => {
    if (book) {
      let books = [];
      this.state.books.forEach((b) => {
        if (b.id === book.id) {
          books.push(book);
        } else {
          books.push(b);
        }
      });

      this.setState({ books });
    }
    this.setState({ editedBook: null });
  };

  handleAdd = () => {
    this.setState({ adding: true });
    window.scrollTo(0, 0); // this.props.history.push("/new-book");
  };

  handleAddDone = (book) => {
    if (book) {
      let books = this.state.books;
      books.push(book);
      this.setState({ books });
    }

    this.setState({ adding: false });
  };

  handleBorrow = (book) => {
    this.setState({ adding: false });
    this.setState({ editedBook: null });
    this.setState({ borrowedBook: book });
    window.scrollTo(0, 0);
    console.log("handleBorrow", book);
  };

  handleBorrowDone = (book) => {
    if (book) {
      console.log("Wypożyczona");
    }
    this.setState({ borrowedBook: null });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    const { currentCategory, searchPhrase } = this.state;
    this.reloadBooks(page, currentCategory, searchPhrase);
  };

  handleSort = (column) => {
    let sortColumn = this.state.sortColumn;
    if (sortColumn.name === column) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn = { name: column, order: "asc" };
    }
    this.setState({ sortColumn });
  };

  handleFilter = (category) => {
    console.log(category);
    this.reloadBooks(1, category, this.state.searchPhrase);
    this.setState({ currentCategory: category, currentPage: 1 });
  };

  handleSearchEdit = (event) => {
    console.log(event.target.value);
    this.setState({ searchPhrase: event.target.value });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();

    this.reloadBooks(1, this.state.category, this.state.searchPhrase);
  };

  myRef = null;

  render() {
    const {
      adding,
      books,
      readers,
      pageSize,
      currentPage,
      sortColumn,
      categories,
      currentCategory,
      categoriesLookup,
      logged,
      loaded,
      editedBook,
      borrowedBook,
      error,
    } = this.state;
    const filtered = books;
    const sorted = _.orderBy(filtered, [sortColumn.name], [sortColumn.order]);
    const slicedBooks = sorted;

    if (error)
      return (
        <div>
          <h2>{error.message}</h2>
        </div>
      );

    if (loaded === false)
      return (
        <div>
          <h2>Ładowanie...</h2>
        </div>
      );

    return (
      <React.Fragment>
        <div>
          {adding ? <AddBook onDoneAdd={this.handleAddDone}></AddBook> : null}

          {editedBook ? (
            <UpdateBook
              book={editedBook}
              history={this.props.history}
              onDoneEdit={this.handleEditDone}
            />
          ) : null}

          {borrowedBook ? (
            <BorrowBook
              book={borrowedBook}
              history={this.props.history}
              onDoneBorrow={this.handleBorrowDone}
            />
          ) : null}

          <Categories
            categories={categories}
            onFilter={this.handleFilter}
            current={categoriesLookup.get(currentCategory)}
          />
          {logged && !adding && !editedBook ? (
            <button className="btn btn-warning" onClick={this.handleAdd}>
              Dodaj książkę
            </button>
          ) : null}

          <form onSubmit={this.handleSearchSubmit} noValidate>
            <Input
              label="Wyszukaj"
              name="search"
              value={this.state.searchPhrase}
              onChange={this.handleSearchEdit}
              type=""
            />
          </form>

          <BooksTable
            books={slicedBooks}
            categories={categoriesLookup}
            onDelete={this.confirmDelete}
            onEdit={this.handleEdit}
            onSort={this.handleSort}
            onBorrow={this.handleBorrow}
            logged={logged}
            readers={readers}
          />
        </div>

        <Pagination
          itemsCount={this.state.totalCount}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />
        <div ref={(ref) => (this.myRef = ref)}></div>
      </React.Fragment>
    );
  }
}

export default BooksView;
