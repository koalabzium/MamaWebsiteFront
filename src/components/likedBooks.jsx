import React from "react";

const LikedBooks = props => {
  const { liked } = props;

  return (
    <React.Fragment>
      <h3>Twoje polubione książki: </h3>
      <ul>
        {liked.map(book => (
          <li key={book.title}>{book.title}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default LikedBooks;
