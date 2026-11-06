import React, { useState, useEffect } from "react";
import { MenuBook } from "@material-ui/icons/";

// Book cover with a built-in placeholder, used both when a book has no image
// at all and when its image URL fails to load (dead external links are
// common for covers pasted in as "link do okładki").
const BookCover = ({ src, title, author, className = "", lazy = false }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className={`book-cover book-cover--placeholder ${className}`} aria-label={title}>
        <MenuBook className="book-cover__icon" />
        {title && <div className="book-cover__title">{title}</div>}
        {author && <div className="book-cover__author">{author}</div>}
      </div>
    );
  }

  return (
    <img
      className={`book-cover ${className}`}
      src={src}
      alt={title}
      loading={lazy ? "lazy" : undefined}
      onError={() => setFailed(true)}
    />
  );
};

export default BookCover;
