import React, { Component } from "react";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import BooksTable from "./booksTable";
import _ from "lodash";
import Categories from "./categories";
import { getBooks, deleteBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import UpdateBook from "./updateBook";
import AddBook from "./addBook";

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
    this.setState({ editedBook: book });
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
    // this.props.history.push("/new-book");
  };

  handleAddDone = (book) => {
    if (book) {
      let books = this.state.books;
      books.push(book);
      this.setState({ books });
    }

    this.setState({ adding: false });
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
            <Categories
              categories={categories}
              onFilter={this.handleFilter}
              current={categories_lookup.get(currentCategory)}
            />

            <BooksTable
              books={slicedBooks}
              categories={categories_lookup}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
              onSort={this.handleSort}
              logged={logged}
            />
          </div>
        ) : (
          <h4>Brak książek. Marysia na pewno je doda w przyszłości!</h4>
        )}
        {adding ? <AddBook onDoneAdd={this.handleAddDone}></AddBook> : null}

        {editedBook ? (
          <UpdateBook
            book={editedBook}
            history={this.props.history}
            onDoneEdit={this.handleEditDone}
          />
        ) : null}
        <Pagination
          itemsCount={books.length}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />

        {logged && !adding && !editedBook ? (
          <button className="btn btn-warning" onClick={this.handleAdd}>
            Dodaj książkę
          </button>
        ) : null}
      </React.Fragment>
    );
  }
}

export default BooksView;
