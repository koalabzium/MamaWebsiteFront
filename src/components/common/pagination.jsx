import React from "react";
import PropTypes from "prop-types";

// Page numbers to show: always the first and last page, plus `around` pages
// either side of the current one, with "…" where pages are skipped.
// e.g. current 7 of 20 → 1 … 6 7 8 … 20
export const pageList = (current, total, around = 1) => {
  const pages = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= around) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
};

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount <= 1) {
    return null;
  }

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, itemsCount);
  const go = (page) => {
    if (page >= 1 && page <= pagesCount && page !== currentPage) onPageChange(page);
  };

  return (
    <nav className="books-pagination" aria-label="Strony">
      <div className="books-pagination__summary">
        Strona <strong>{currentPage}</strong> z <strong>{pagesCount}</strong>
        <span className="books-pagination__range">
          {" "}
          · książki {firstItem}–{lastItem} z {itemsCount}
        </span>
      </div>

      <ul className="pagination mb-0">
        <li className={`page-item${currentPage > 1 ? "" : " disabled"}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => go(currentPage - 1)}
            aria-label="Poprzednia strona"
          >
            ‹ <span className="books-pagination__label">Poprzednia</span>
          </button>
        </li>

        {pageList(currentPage, pagesCount).map((page, i) =>
          page === "…" ? (
            <li key={`gap-${i}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={page} className={`page-item${page === currentPage ? " active" : ""}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => go(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          )
        )}

        <li className={`page-item${currentPage < pagesCount ? "" : " disabled"}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => go(currentPage + 1)}
            aria-label="Następna strona"
          >
            <span className="books-pagination__label">Następna</span> ›
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
