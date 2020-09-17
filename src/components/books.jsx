import React, { Component, useRef } from "react";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import BooksTable from "./booksTable";
import _ from "lodash";
import Categories from "./categories";
import { getBooks, deleteBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import UpdateBook from "./updateBook";
import AddBook from "./addBook";
import BorrowBook from "./borrowBook";
import BookDetails from "./bookDetails";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export class BooksView extends Component {
  state = {
    books: [],
    pageSize: 10,
    currentPage: 1,
    sortColumn: {
      name: "title",
      order: "asc",
    },
    categories: [],
    currentCategory: null,
    categories_lookup: new Map(),
    logged: localStorage.getItem("token"),
    editedBook: null,
    borrowedBook: null,
    adding: false,
    loaded: false,
    addingCategory: false,
  };

  async componentDidMount() {
    const books = await getBooks();
    console.log(books);
    this.setState({ loaded: true });
    console.log(books);
    this.setState({ books: books.data });
    const categories = await getCategories();
    const cat = categories.data;
    cat.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    console.log("CAT", cat);
    this.setState({
      categories: cat,
    });

    var lookup = new Map();
    categories.data.map((cat) => lookup.set(cat.id, cat.name));
    this.setState({ categories_lookup: lookup });
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
    this.setState({ currentCategory: category });
  };

  myRef = null;

  render() {
    const {
      adding,
      books,
      pageSize,
      currentPage,
      sortColumn,
      categories,
      currentCategory,
      categories_lookup,
      logged,
      loaded,
      editedBook,
      borrowedBook,
    } = this.state;
    const filtered =
      currentCategory !== null
        ? books.filter((book) => book.category === currentCategory)
        : books;
    const sorted = _.orderBy(filtered, [sortColumn.name], [sortColumn.order]);
    const slicedBooks = paginate(sorted, currentPage, pageSize);

    if (loaded === false)
      return (
        <div>
          <h2>Ładowanie...</h2>
        </div>
      );
    return (
      <React.Fragment>
        {books.length > 0 ? (
          <div>
            {adding ? (
              <AddBook
                ref={(ref) => (this.myRef = ref)}
                onDoneAdd={this.handleAddDone}
              ></AddBook>
            ) : null}

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
              current={categories_lookup.get(currentCategory)}
            />
            {logged && !adding && !editedBook ? (
              <button className="btn btn-warning" onClick={this.handleAdd}>
                Dodaj książkę
              </button>
            ) : null}

            <BooksTable
              books={slicedBooks}
              categories={categories_lookup}
              onDelete={this.confirmDelete}
              onEdit={this.handleEdit}
              onSort={this.handleSort}
              onBorrow={this.handleBorrow}
              logged={logged}
            />
          </div>
        ) : (
          <h4>Brak książek. Marysia na pewno je doda w przyszłości!</h4>
        )}
        <Pagination
          itemsCount={books.length}
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
