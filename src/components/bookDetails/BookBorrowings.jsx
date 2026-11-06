import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { getBooksBorrowings } from "../../services/bookService";
import { handleCancelBorrowing } from "../../services/borrowingService";
import BorrowingsList from "../borrowingsList";

const BookBorrowings = ({ bookId, onChanged }) => {
  const [borrowings, setBorrowings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!bookId) return;
    setLoaded(false);
    getBooksBorrowings(bookId).then(({ data }) => {
      setBorrowings(data);
      setLoaded(true);
    });
  }, [bookId]);

  const onEnd = async (borrowing) => {
    try {
      await handleCancelBorrowing(borrowing);
      setBorrowings((prev) => prev.filter(({ id }) => id !== borrowing.id));
      setStatus({ variant: "success", message: `Zakończono wypożyczenie — ${borrowing.readerName}.` });
      if (onChanged) onChanged();
    } catch (err) {
      setStatus({ variant: "danger", message: "Nie udało się zakończyć wypożyczenia." });
    }
  };

  const active = borrowings.filter((b) => b.active);

  return (
    <div>
      {status && (
        <Alert variant={status.variant} onClose={() => setStatus(null)} dismissible className="py-2">
          {status.message}
        </Alert>
      )}
      {loaded && active.length === 0 ? (
        <div className="text-muted small">Brak aktywnych wypożyczeń.</div>
      ) : (
        <BorrowingsList borrowings={active} onEnd={onEnd} show="reader" />
      )}
    </div>
  );
};

export default BookBorrowings;
