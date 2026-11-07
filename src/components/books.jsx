import React, { useState, useEffect } from "react";
import Pagination from "./common/pagination";
import BooksGrid from "./booksGrid";
import Categories from "./categories";
import Places from "./places";
import { Add, Close } from "@material-ui/icons/";
import { getBooks, deleteBook, getBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alert, Spinner, Dropdown } from "react-bootstrap";
import { getPlaces } from "../services/placeService";
import BookDetails from "./bookDetails";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useBooksQueryState from "../hooks/useBooksQueryState";

// Books per page we ask the API for. Must stay a multiple of both grid
// column counts (2 on phones, 6 wider — see .books-grid) so pages end on a
// full row. The API echoes the size it actually
// used (pageSize); an older API without that field always paged by 10.
const PAGE_SIZE = 24;
const LEGACY_PAGE_SIZE = 10;
const sortByName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

const SORT_OPTIONS = [
  { column: "title", label: "Tytuł" },
  { column: "author", label: "Autor(ka)" },
  { column: "place", label: "Lokalizacja" },
];

const BooksView = () => {
  const { isLoggedIn: logged } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { q, category, place, sortBy, order, page, bookId, setQuery } =
    useBooksQueryState();

  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [categoriesLookup, setCategoriesLookup] = useState(new Map());
  const [placesLookup, setPlacesLookup] = useState(new Map());
  // One-off message handed over via navigation state (e.g. "book borrowed"
  // from the borrow screen).
  const [flash, setFlash] = useState(() => (location.state && location.state.flash) || null);
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
          pageSize: PAGE_SIZE,
          sortBy,
          order,
        });
        if (cancelled) return;
        const { results = [], totalCount: count = 0 } = booksRes;
        setBooks(results);
        setTotalCount(count);
        setPageSize(booksRes.pageSize || LEGACY_PAGE_SIZE);
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

  // Drop the flash from history state right away so a refresh or
  // back-navigation doesn't show it again, and hide it after a while.
  useEffect(() => {
    if (location.state && location.state.flash) {
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 6000);
    return () => clearTimeout(t);
  }, [flash]);

  const reloadCurrentBook = () => {
    if (!bookId) return;
    getBook(bookId).then(({ data }) => setCurrentBook(data));
  };

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

  // Hand the current list query (minus the open modal) to the edit/borrow
  // screens so "back"/"save" returns to the same filtered/sorted page.
  const goToBookScreen = (book, screen) => {
    const params = new URLSearchParams(location.search);
    params.delete("bookId");
    const from = params.toString();
    navigate(`/books/${book.id}/${screen}`, { state: { from: from ? `?${from}` : "" } });
  };

  const handleEdit = (book) => goToBookScreen(book, "edit");
  const handleBorrow = (book) => goToBookScreen(book, "borrow");

  const handleAdd = () => navigate("/books/add");


  const handlePageChange = (newPage) => {
    setQuery({ page: newPage });
    window.scrollTo(0, 0);
  };

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

  // From the book modal: show the catalogue for an author / category /
  // location, replacing the current filters and closing the modal.
  const handleBrowse = (partial) => {
    setSearchInput(partial.q || "");
    setQuery({ q: null, category: null, place: null, ...partial, page: 1, bookId: null });
    window.scrollTo(0, 0);
  };

  const clearSearch = () => {
    setSearchInput("");
    setQuery({ q: null, page: 1 });
  };

  const activeFilters = [
    category && {
      key: "category",
      label: `Kategoria: ${categoriesLookup.get(category) || "…"}`,
      clear: () => handleFilter(null),
    },
    place && {
      key: "place",
      label: `Lokalizacja: ${placesLookup.get(place) || "…"}`,
      clear: () => handlePlaceFilter(null),
    },
    q && { key: "q", label: `Szukasz: „${q}”`, clear: clearSearch },
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSearchInput("");
    setQuery({ category: null, place: null, q: null, page: 1 });
  };

  return (
    <React.Fragment>
      <div>
        <div className="books-header">
          <h1 className="books-header__title">
            Książki
            {!loading && <span className="books-header__count">{totalCount}</span>}
          </h1>
          {logged && (
            <button className="btn btn-warning books-header__add" onClick={handleAdd}>
              <Add fontSize="small" /> Dodaj książkę
            </button>
          )}
        </div>

        {flash && (
          <Alert
            variant={flash.variant || "success"}
            onClose={() => setFlash(null)}
            dismissible
            className="mx-1 mt-2 mb-0"
          >
            {flash.message}
          </Alert>
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
            <Places
              places={places}
              onFilter={handlePlaceFilter}
              current={placesLookup.get(place)}
            />
          </div>

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

          <div className={"form-element"}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                Sortuj: {SORT_OPTIONS.find((o) => o.column === sortBy)?.label}{" "}
                {order === "asc" ? "↑" : "↓"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {SORT_OPTIONS.map(({ column, label }) => (
                  <Dropdown.Item key={column} onClick={() => handleSort(column)}>
                    {label} {sortBy === column && (order === "asc" ? "↑" : "↓")}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="active-filters">
            {activeFilters.map(({ key, label, clear }) => (
              <span className="active-filters__chip" key={key}>
                {label}
                <button type="button" aria-label="Usuń filtr" onClick={clear}>
                  <Close fontSize="inherit" />
                </button>
              </span>
            ))}
            {activeFilters.length > 1 && (
              <button type="button" className="btn btn-link btn-sm" onClick={clearAllFilters}>
                Wyczyść wszystkie
              </button>
            )}
          </div>
        )}

        {error && <Alert variant={"danger"}>{error.message}</Alert>}

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 5 }}>
            <Spinner animation="border" />
          </div>
        )}

        <BooksGrid
          books={books}
          categories={categoriesLookup}
          places={placesLookup}
          onDelete={confirmDelete}
          onEdit={handleEdit}
          onBorrow={handleBorrow}
          onClick={(book) => setQuery({ bookId: book.id })}
          logged={logged}
        />
      </div>

      <Pagination
        itemsCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        currentPage={page}
      />

      <BookDetails
        show={!!currentBook}
        onHide={hideSelectedBook}
        book={currentBook}
        places={placesLookup}
        categories={categoriesLookup}
        onEdit={handleEdit}
        onBorrow={handleBorrow}
        onBorrowingsChanged={reloadCurrentBook}
        onBrowse={handleBrowse}
        onSelectBook={(book) => setQuery({ bookId: book.id })}
      />
    </React.Fragment>
  );
};

export default BooksView;
