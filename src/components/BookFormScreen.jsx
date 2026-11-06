import React from "react";
import { ArrowBack } from "@material-ui/icons/";

// Shared page chrome for the add and edit book screens.
const BookFormScreen = ({ title, subtitle, onBack, children }) => (
  <div className="book-form-screen">
    <button type="button" className="btn btn-link book-form-screen__back" onClick={onBack}>
      <ArrowBack fontSize="small" /> Wróć do listy
    </button>
    <div className="card book-form-screen__card">
      <div className="card-body">
        <h2 className="book-form-screen__title">{title}</h2>
        {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  </div>
);

export default BookFormScreen;
