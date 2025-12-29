import React from "react";
import PropTypes from "prop-types";

const PAGES_RANGE = 3;

const Pagination = (props) => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount <= 1) {
    return null
  };

  const pagesStart = Math.max(0, currentPage - PAGES_RANGE);
  const pagesEnd = Math.min(currentPage + PAGES_RANGE - 1, pagesCount);
  const pagesToShow = pagesEnd - pagesStart;
  const pages = [...Array(pagesToShow).keys()].map((i) => pagesStart + i + 1);

  return (
    <React.Fragment>
      <nav aria-label="Page navigation example">
        <ul className="pagination">

          <li
            key={'prev'}
            className={
              currentPage > 1 ? "page-item" : "page-item disabled"
            }
          >
            <a className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              Poprzednia
            </a>
          </li>


          {pages.map((page) => (
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


          <li
            key={'next'}
            className={
              currentPage < pagesCount ? "page-item" : "page-item disabled"
            }
          >
            <a className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              Następna
            </a>
          </li>


        </ul>
      </nav>
    </React.Fragment>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
