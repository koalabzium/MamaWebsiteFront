import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Alert } from "react-bootstrap";
import BorrowingsList from "./borrowingsList";

const BorrowingsModal = ({ borrowings, onCancelBorrowing, onHide, title = "Wypożyczenia" }) => {
  const [status, setStatus] = useState(null);
  const show = borrowings != null;

  useEffect(() => {
    if (!show) setStatus(null);
  }, [show]);

  const onEnd = async (b) => {
    try {
      await onCancelBorrowing(b);
      setStatus({ variant: "success", message: `Zakończono wypożyczenie „${b.bookTitle}”.` });
    } catch (err) {
      setStatus({ variant: "danger", message: "Nie udało się zakończyć wypożyczenia." });
    }
  };

  const active = (borrowings || []).filter((b) => b.active);

  return (
    <Modal onHide={onHide} aria-labelledby="borrowings-modal-title" centered show={show} enforceFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title id="borrowings-modal-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status && (
          <Alert variant={status.variant} onClose={() => setStatus(null)} dismissible className="py-2">
            {status.message}
          </Alert>
        )}
        {active.length === 0 ? (
          <div className="text-muted">Brak aktywnych wypożyczeń.</div>
        ) : (
          <BorrowingsList borrowings={active} onEnd={onEnd} show="book" />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BorrowingsModal;
