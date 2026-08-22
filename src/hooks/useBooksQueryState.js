import { useSearchParams } from "react-router-dom";

const DEFAULT_SORT_BY = "title";
const DEFAULT_ORDER = "asc";

// Single source of truth for everything the books list screen filters/sorts/
// paginates by, kept in the URL query string so a filtered/sorted/paginated
// view (and the currently-open book detail modal) is refresh-safe and
// shareable via a plain link.
const useBooksQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || null,
    place: searchParams.get("place") || null,
    sortBy: searchParams.get("sortBy") || DEFAULT_SORT_BY,
    order: searchParams.get("order") || DEFAULT_ORDER,
    page: parseInt(searchParams.get("page") || "1", 10),
    bookId: searchParams.get("bookId") || null,
  };

  // Merges a partial update into the existing params in one setSearchParams
  // call, so e.g. opening the book-detail modal (bookId) never clobbers an
  // active search/filter/sort/page, and changing a filter can set page back
  // to 1 in the same update instead of a separate call that could race with
  // it (the source of the old page-desync bug).
  const setQuery = (partial) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(partial).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  };

  return { ...query, setQuery };
};

export default useBooksQueryState;
