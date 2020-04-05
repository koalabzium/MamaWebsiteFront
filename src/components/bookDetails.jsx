import React, { Component } from "react";

const BookDetails = props => {
  return <h2>Szczegóły {props.match.params.title}</h2>;
};

export default BookDetails;
