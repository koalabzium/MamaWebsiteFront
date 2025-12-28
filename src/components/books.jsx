import React, { useState, useEffect } from "react";
import Pagination from "./common/pagination";
import BooksTable from "./booksTable";
import Categories from "./categories";
import { getBooks, deleteBook, getBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import UpdateBook from "./updateBook";
import AddBook from "./addBook";
import BorrowBook from "./borrowBook";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getReaders } from "../services/readerService";
import { Alert, Spinner } from "react-bootstrap";
import { getPlaces } from "../services/placeService";
import BookDetails from "./bookDetails";
import { useSearchParams, useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const BooksView = (props) => {

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({
    name: "title",
    order: "asc",
  });
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoriesLookup, setCategoriesLookup] = useState(new Map());
  const [placesLookup, setPlacesLookup] = useState(new Map());
  const [editedBook, setEditedBook] = useState(null);
  const [borrowedBook, setBorrowedBook] = useState(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [error, setError] = useState(null);
  const [readers, setReaders] = useState(new Map());
  const [currentBook, setCurrentBook] = useState(null);

  const logged = localStorage.getItem("token");

  const [search, setSearch] = useSearchParams()
  const navigate = useNavigate();

  const bookId = search.get("bookId")

  useEffect(() => {
    if (!bookId) {
      setCurrentBook(null);
    } else {
      const fetchCurrentBook = async () => {
        const { data: bookRes } = await getBook(bookId);
        setCurrentBook(bookRes);
      };

      fetchCurrentBook();
    }
  }, [bookId])

  const reloadBooks = async (page, categoryId, search, sortColumn) => {
    setLoading(true);
    try {
      const { data: booksRes } = await getBooks({
        page,
        categoryId,
        search,
        sortBy: sortColumn.name,
        order: sortColumn.order,
      });

      const { results = [], totalCount = 0 } = booksRes;

      setBooks(results);
      setLoading(false);
      setTotalCount(totalCount);
    } catch (e) {
      console.error(e.message);

      setLoading(false);
      setError(new Error("Nie można pobrać książek :("));
    }
  }

  const fetchAllData = async () => {
    reloadBooks(currentPage, currentCategory, searchPhrase, sortColumn);
    const { data: cat } = await getCategories();
    const { data: pl } = await getPlaces();
    cat.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    setCategories(cat);
    setPlaces(pl);

    const readersData = await getReaders();
    const readers = new Map();
    readersData.data.map((r) => readers.set(r.id, r.name));

    setReaders(readers)

    const lookup = new Map();
    cat.map((cat) => lookup.set(cat.id, cat.name));

    setCategoriesLookup(lookup);


    const lookup2 = new Map();
    pl.map((pl) => lookup2.set(pl.id, pl.name));

    setPlacesLookup(lookup2);
  }

  useEffect(() => {
    fetchAllData();
  }, [])

  const confirmDelete = (book) => {
    confirmAlert({
      title: `Usuwanie ${book.title}`,
      message: "Jesteś pewna?",
      buttons: [
        {
          label: "Tak",
          onClick: () => handleDelete(book),
        },
      ],
    });
  };

  const handleDelete = async (book) => {
    console.log("Deleting", book);
    const books = books.filter((b) => b.id !== book.id);
    console.log(books);
    setBooks(books);
    deleteBook(book.id);
  };

  const handleEdit = (book) => {
    console.log("Editing");

    setAdding(false);
    setBorrowedBook(null);
    setEditedBook(book);
    window.scrollTo(0, 0);
  };

  const handleEditDone = (book) => {
    if (book) {
      let tmpBooks = [];
      books.forEach((b) => {
        if (b.id === book.id) {
          tmpBooks.push(book);
        } else {
          tmpBooks.push(b);
        }
      });

      setBooks(tmpBooks);
    }
    setEditedBook(null)
  };

  const handleAdd = () => {
    setAdding(true);
    window.scrollTo(0, 0); // props.history.push("/new-book");
  };

  const handleAddDone = (book) => {
    if (book) {
      setBooks([...books, book]);
    }

    setAdding(false);
  };

  const handleBorrow = (book) => {
    setAdding(false);
    setEditedBook(false);
    setBorrowedBook(book);
    window.scrollTo(0, 0);
    console.log("handleBorrow", book);
  };

  const handleBorrowDone = (book) => {
    if (book) {
      console.log("Wypożyczona");
    }

    setBorrowedBook(null);
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    await reloadBooks(page, currentCategory, searchPhrase, sortColumn);
  };

  const handleSort = async (column) => {
    let tmpSort = sortColumn;
    if (tmpSort.name === column) {
      tmpSort.order = tmpSort.order === "asc" ? "desc" : "asc";
    } else {
      tmpSort = { name: column, order: "asc" };
    }

    await reloadBooks(1, currentCategory, searchPhrase, tmpSort);

    setSortColumn(tmpSort);
    setCurrentPage(1);
  };

  const handleFilter = async (category) => {
    console.log(category);
    await reloadBooks(1, category, searchPhrase, sortColumn);
    setCurrentCategory(category);
    setCurrentPage(1);
  };

  const handleSearchEdit = (event) => {
    console.log(event.target.value);
    setSearchPhrase(event.target.value)
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await reloadBooks(1, currentCategory, searchPhrase, sortColumn);
  };

  const hideSelectedBook = () => {
    search.delete("bookId")

    navigate({ search: search.toString() })
  }

  return (
    <React.Fragment>
      <div>
        {adding && <AddBook onDoneAdd={handleAddDone} />}

        {editedBook && (
          <UpdateBook
            book={editedBook}
            history={props.history}
            onDoneEdit={handleEditDone}
          />
        )}

        {borrowedBook && (
          <BorrowBook
            book={borrowedBook}
            history={props.history}
            onDoneBorrow={handleBorrowDone}
          />
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={"form-element"}>
            <Categories
              categories={categories}
              onFilter={handleFilter}
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
                onClick={handleAdd}
              >
                Dodaj książkę
              </button>
            )}
          </div>

          <div style={{ flexGrow: 1 }} />

          <form
            onSubmit={handleSearchSubmit}
            noValidate
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className={"form-element"}>
              <input
                placeholder="Wyszukaj"
                name="search"
                value={searchPhrase}
                onChange={handleSearchEdit}
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
          onDelete={confirmDelete}
          onEdit={handleEdit}
          onSort={handleSort}
          onBorrow={handleBorrow}
          onClick={book => setSearch({ bookId: book.id })}
          logged={logged}
          readers={readers}
          loading={loading}
        />
      </div>

      <Pagination
        itemsCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      <BookDetails
        show={!!currentBook}
        onHide={hideSelectedBook}
        book={currentBook}
        places={placesLookup}
      />
    </React.Fragment>
  );
}

export default BooksView;
