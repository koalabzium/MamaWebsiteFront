import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import "react-confirm-alert/src/react-confirm-alert.css";
import BookBorrowings from "./bookDetails/BookBorrowings";
import { handleCancelBorrowing } from "../services/borrowingService";

class BorrowingsModal extends Component {
  render() {
    const { borrowings, onCancelBorrowing } = this.props;

    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={borrowings != null}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            POZDRO Z VANCOUVER
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(borrowings || [])
            .filter((b) => b.active)
            .map((b) => (
              <div>
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
  }
}

export default BorrowingsModal;
