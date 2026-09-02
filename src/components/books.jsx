import React, { useState, useEffect } from "react";
import Pagination from "./common/pagination";
import BooksTable from "./booksTable";
import Categories from "./categories";
import Places from "./places";
import { getBooks, deleteBook, getBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import UpdateBook from "./updateBook";
import BorrowBook from "./borrowBook";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alert, Spinner } from "react-bootstrap";
import { getPlaces } from "../services/placeService";
import BookDetails from "./bookDetails";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useBooksQueryState from "../hooks/useBooksQueryState";

const PAGE_SIZE = 10;
const sortByName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

const BooksView = () => {
  const { isLoggedIn: logged } = useAuth();
  const navigate = useNavigate();
  const { q, category, place, sortBy, order, page, bookId, setQuery } =
    useBooksQueryState();

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [categoriesLookup, setCategoriesLookup] = useState(new Map());
  const [placesLookup, setPlacesLookup] = useState(new Map());
  const [editedBook, setEditedBook] = useState(null);
  const [borrowedBook, setBorrowedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);

  // The search box keeps its own draft value — only submitting the form
  // pushes it into the URL (and thus triggers a fetch), matching the
  // original "type then press Enter/Szukaj" UX rather than searching on
  // every keystroke.
  const [searchInput, setSearchInput] = useState(q);

  // Reference data (categories/places dropdowns, lookups by id) — fetched
  // once, independent of the filtered/sorted/paginated book list itself.
  useEffect(() => {
    const loadReferenceData = async () => {
      const { data: cats } = await getCategories();
      const { data: pls } = await getPlaces();
      const sortedCats = [...cats].sort(sortByName);
      const sortedPlaces = [...pls].sort(sortByName);

      setCategories(sortedCats);
      setPlaces(sortedPlaces);
      setCategoriesLookup(new Map(sortedCats.map((c) => [c.id, c.name])));
      setPlacesLookup(new Map(sortedPlaces.map((p) => [p.id, p.name])));
    };
    loadReferenceData();
  }, []);

  // The book list itself — re-fetches whenever any part of the URL-backed
  // query state changes. This is the single place page/filter/sort/search
  // turn into an actual request, replacing the old
  // reloadBooks(page, categoryId, search, sortColumn) call threaded
  // manually through every handler.
  useEffect(() => {
    let cancelled = false;
    const reload = async () => {
      setLoading(true);
      try {
        const { data: booksRes } = await getBooks({
          page,
          categoryId: category,
          placeId: place,
          search: q,
          sortBy,
          order,
        });
        if (cancelled) return;
        const { results = [], totalCount: count = 0 } = booksRes;
        setBooks(results);
        setTotalCount(count);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        console.error(e.message);
        setError(new Error("Nie można pobrać książek :("));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    reload();
    return () => {
      cancelled = true;
    };
  }, [page, category, place, q, sortBy, order]);

  // The selected book detail modal — URL-backed via bookId, so it survives
  // a refresh and can be linked to directly.
  useEffect(() => {
    if (!bookId) {
      setCurrentBook(null);
      return;
    }
    let cancelled = false;
    getBook(bookId).then(({ data }) => {
      if (!cancelled) setCurrentBook(data);
    });
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const hideSelectedBook = () => setQuery({ bookId: null });

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
    const remainingBooks = books.filter((b) => b.id !== book.id);
    setBooks(remainingBooks);
    deleteBook(book.id);
  };

  const handleEdit = (book) => {
    setBorrowedBook(null);
    setEditedBook(book);
    window.scrollTo(0, 0);
  };

  const handleEditDone = (book) => {
    if (book) {
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
    }
    setEditedBook(null);
  };

  const handleAdd = () => navigate("/books/add");

  const handleBorrow = (book) => {
    setEditedBook(null);
    setBorrowedBook(book);
    window.scrollTo(0, 0);
  };

  const handleBorrowDone = () => setBorrowedBook(null);

  const handlePageChange = (newPage) => setQuery({ page: newPage });

  const handleSort = (column) => {
    const newOrder = sortBy === column && order === "asc" ? "desc" : "asc";
    setQuery({ sortBy: column, order: newOrder, page: 1 });
  };

  const handleFilter = (categoryId) => setQuery({ category: categoryId, page: 1 });
  const handlePlaceFilter = (placeId) => setQuery({ place: placeId, page: 1 });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery({ q: searchInput, page: 1 });
  };

  return (
    <React.Fragment>
      <div>
        {editedBook && <UpdateBook book={editedBook} onDoneEdit={handleEditDone} />}

        {borrowedBook && (
          <BorrowBook book={borrowedBook} onDoneBorrow={handleBorrowDone} />
        )}

        <div className="books-toolbar">
          <div className={"form-element"}>
            <Categories
              categories={categories}
              onFilter={handleFilter}
              current={categoriesLookup.get(category)}
            />
          </div>

          <div className={"form-element"}>
            <Places places={places} onFilter={handlePlaceFilter} />
          </div>

          <div className={"form-element"}>
            {category && <h6 className="mb-0">{categoriesLookup.get(category)}</h6>}
            {place && <h6 className="mb-0">{placesLookup.get(place)}</h6>}
          </div>

          {logged && !editedBook && (
            <div className={"form-element"}>
              <button className="btn btn-warning" onClick={handleAdd}>
                Dodaj książkę
              </button>
            </div>
          )}

          <form
            onSubmit={handleSearchSubmit}
            noValidate
            className="books-toolbar__search"
          >
            <div className={"form-element books-toolbar__search-input"}>
              <input
                placeholder="Wyszukaj"
                name="search"
                className="form-control"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type=""
              />
            </div>

            <div className={"form-element"}>
              <button className="btn btn-info">Szukaj</button>
            </div>
          </form>
        </div>

        {error && <Alert variant={"danger"}>{error.message}</Alert>}

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 5 }}>
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
          onClick={(book) => setQuery({ bookId: book.id })}
          logged={logged}
        />
      </div>

      <Pagination
        itemsCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        currentPage={page}
      />

      <BookDetails
        show={!!currentBook}
        onHide={hideSelectedBook}
        book={currentBook}
        places={placesLookup}
      />
    </React.Fragment>
  );
};

export default BooksView;
