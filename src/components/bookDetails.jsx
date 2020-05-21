import React from "react";
import Popup from "reactjs-popup";

const BookDetails = (props) => {
  return (
    <div>
      <h2>Szczegóły {props.match.params.title}</h2>
    </div>
  );
};

export default BookDetails;
