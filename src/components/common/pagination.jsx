import React, { Component } from "react";
import PropTypes from "prop-types";

const Pagination = props => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;
  const pagesCount = itemsCount / pageSize;
  if (pagesCount <= 1) return null;
  const pages = [...Array(pagesCount).keys()].map(i => i + 1);
  return (
    <React.Fragment>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {pages.map(page => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <a className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </React.Fragment>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
