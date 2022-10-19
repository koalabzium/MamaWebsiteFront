import React, { Component } from "react";
import Pagination from "./common/pagination";
import BooksTable from "./booksTable";
import Categories from "./categories";
import Places from "./places";
import { getBooks, deleteBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import UpdateBook from "./updateBook";
import AddBook from "./addBook";
import BorrowBook from "./borrowBook";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getReaders } from "../services/readerService";
import { Alert, Spinner } from "react-bootstrap";
import { getPlaces } from "../services/placeService";

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
    places: [],
    currentCategory: null,
    categoriesLookup: new Map(),
    placesLookup: new Map(),
    logged: localStorage.getItem("token"),
    editedBook: null,
    borrowedBook: null,
    adding: false,
    loading: false,
    addingCategory: false,
    searchPhrase: "",
    error: null,
  };

  async reloadBooks(page, categoryId, search, sortColumn) {
    this.setState({ loading: true });
    try {
      const { data: booksRes } = await getBooks({
        page,
        categoryId,
        search,
        sortBy: sortColumn.name,
        order: sortColumn.order,
      });

      const { results = [], totalCount = 0 } = booksRes;

      this.setState({ books: results, loading: false, totalCount: totalCount });
    } catch (e) {
      console.error(e.message);
      this.setState({
        loading: false,
        error: new Error("Nie można pobrać książek :("),
      });
    }
  }

  async componentDidMount() {
    const { currentPage, currentCategory, searchPhrase, sortColumn } =
      this.state;
    this.reloadBooks(currentPage, currentCategory, searchPhrase, sortColumn);
    const { data: cat } = await getCategories();
    const { data: pl } = await getPlaces();
    cat.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    this.setState({
      categories: cat,
      places: pl,
    });

    const readersData = await getReaders();
    const readers = new Map();
    readersData.data.map((r) => readers.set(r.id, r.name));
    this.setState({ readers });
    const lookup = new Map();
    cat.map((cat) => lookup.set(cat.id, cat.name));
    this.setState({ categoriesLookup: lookup });
    const lookup2 = new Map();
    pl.map((pl) => lookup2.set(pl.id, pl.name));
    this.setState({ placesLookup: lookup2 });
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

  handlePageChange = async (page) => {
    this.setState({ currentPage: page });
    const { currentCategory, searchPhrase, sortColumn } = this.state;
    await this.reloadBooks(page, currentCategory, searchPhrase, sortColumn);
  };

  handleSort = async (column) => {
    let { sortColumn, currentPage, currentCategory, searchPhrase } = this.state;
    if (sortColumn.name === column) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn = { name: column, order: "asc" };
    }

    await this.reloadBooks(1, currentCategory, searchPhrase, sortColumn);
    this.setState({ sortColumn, currentPage: 1 });
  };

  handleFilter = async (category) => {
    console.log(category);
    const { searchPhrase, sortColumn } = this.state;
    await this.reloadBooks(1, category, searchPhrase, sortColumn);
    this.setState({ currentCategory: category, currentPage: 1 });
  };

  handleSearchEdit = (event) => {
    console.log(event.target.value);
    this.setState({ searchPhrase: event.target.value });
  };

  handleSearchSubmit = async (e) => {
    e.preventDefault();
    const { category, searchPhrase, sortColumn } = this.state;
    await this.reloadBooks(1, category, searchPhrase, sortColumn);
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
      places,
      currentCategory,
      categoriesLookup,
      placesLookup,
      logged,
      loading,
      editedBook,
      borrowedBook,
      error,
    } = this.state;

    return (
      <React.Fragment>
        <div>
          {adding && <AddBook onDoneAdd={this.handleAddDone} />}

          {editedBook && (
            <UpdateBook
              book={editedBook}
              history={this.props.history}
              onDoneEdit={this.handleEditDone}
            />
          )}

          {borrowedBook && (
            <BorrowBook
              book={borrowedBook}
              history={this.props.history}
              onDoneBorrow={this.handleBorrowDone}
            />
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={"form-element"}>
              <Categories
                categories={categories}
                onFilter={this.handleFilter}
                current={categoriesLookup.get(currentCategory)}
              />
            </div>

            <div className={"form-element"}>
              {currentCategory && (
                <h6>{categoriesLookup.get(currentCategory)}</h6>
              )}
            </div>

            <div>
              {logged && !adding && !editedBook && (
                <button
                  className="btn btn-warning form-element"
                  onClick={this.handleAdd}
                >
                  Dodaj książkę
                </button>
              )}
            </div>

            <div style={{ flexGrow: 1 }} />

            <form
              onSubmit={this.handleSearchSubmit}
              noValidate
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className={"form-element"}>
                <input
                  placeholder="Wyszukaj"
                  name="search"
                  value={this.state.searchPhrase}
                  onChange={this.handleSearchEdit}
                  type=""
                />
              </div>

              <div>
                <button className="btn btn-info form-element">Szukaj</button>
              </div>
            </form>
          </div>

          {error && <Alert variant={"danger"}>{error.message}</Alert>}

          {loading && (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 5 }}
            >
              <Spinner animation="border" />
            </div>
          )}

          <BooksTable
            books={books}
            categories={categoriesLookup}
            places={placesLookup}
            onDelete={this.confirmDelete}
            onEdit={this.handleEdit}
            onSort={this.handleSort}
            onBorrow={this.handleBorrow}
            logged={logged}
            readers={readers}
            loading={loading}
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
