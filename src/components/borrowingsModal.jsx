import React from "react";
import Modal from "react-bootstrap/Modal";
import "react-confirm-alert/src/react-confirm-alert.css";

const BorrowingsModal = ({ borrowings, onCancelBorrowing, onHide }) => (
  <Modal
    onHide={onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    show={borrowings != null}
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Wypożyczenia
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {(borrowings || [])
        .filter((b) => b.active)
        .map((b) => (
          <div key={b.id}>
            <span>
              {b.bookTitle} - {b.date}
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onCancelBorrowing(b)}
            >
              X
            </button>
          </div>
        ))}
    </Modal.Body>
  </Modal>
);

export default BorrowingsModal;
