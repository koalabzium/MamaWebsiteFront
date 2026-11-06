import React, { useState } from "react";
import { AssignmentReturn } from "@material-ui/icons/";
import { confirmEndBorrowing } from "./common/confirmAction";

// Compact list of borrowings with an "end borrowing" action behind a
// confirmation dialog. `show` picks what each row is labelled with: the
// reader (on a book's details) or the book (on a reader's list).
const BorrowingsList = ({ borrowings, onEnd, show = "reader" }) => {
  const [pendingId, setPendingId] = useState(null);

  const handleEnd = (b) =>
    confirmEndBorrowing(b, async () => {
      setPendingId(b.id);
      try {
        await onEnd(b);
      } finally {
        setPendingId(null);
      }
    });

  return (
    <ul className="borrowings-list">
      {borrowings.map((b) => (
        <li key={b.id} className="borrowings-list__item">
          <div className="borrowings-list__main">
            <div className="borrowings-list__name">
              {show === "book" ? b.bookTitle : b.readerName}
            </div>
            <div className="borrowings-list__meta">
              {show === "book" && b.bookAuthor ? `${b.bookAuthor} · ` : ""}
              {b.date || "brak daty"}
              {b.quantity > 1 ? ` · ${b.quantity} egz.` : ""}
            </div>
          </div>
          {b.active && onEnd && (
            <button
              className="btn btn-outline-danger btn-sm borrowings-list__end"
              onClick={() => handleEnd(b)}
              disabled={pendingId === b.id}
              title="Zakończ wypożyczenie (zwrot)"
            >
              <AssignmentReturn fontSize="small" /> {pendingId === b.id ? "…" : "Zwrot"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default BorrowingsList;
