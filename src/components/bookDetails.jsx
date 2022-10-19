import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import "react-confirm-alert/src/react-confirm-alert.css";
import BookBorrowings from "./bookDetails/BookBorrowings";

class BookDetails extends Component {
  state = {
    book: this.props.book,
    activeBorrows: [],
    prevBorrows: [],
  };

  render() {
    const { book, places } = this.props;

    if (book) {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {book.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="container">
                <div className="row">
                  <div className="col-sm">
                    <img
                      src={book.image}
                      width="300"
                      height="400"
                      style={{ objectFit: "contain", marginBottom: 15 }}
                    />
                  </div>
                  <div className="col-sm">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>
                        <h2>{book.title}</h2>
                      </span>
                      <span>
                        <h4 style={{ color: "#585858" }}>{book.author}</h4>
                      </span>
                      <span>
                        <a href={book.link}>Strona z książką</a>
                      </span>
                      {localStorage.getItem("token") ? (
                        <ListGroup>
                          <ListGroupItem>{book.location}</ListGroupItem>
                          <ListGroupItem>
                            Lokalizacja: {places.get(book.place)}
                          </ListGroupItem>
                          <ListGroupItem>
                            Ilość egzemplarzy: {book.quantity}
                          </ListGroupItem>
                          <ListGroupItem>
                            {" "}
                            Wypożyczenia:
                            <BookBorrowings bookId={book.id} />
                          </ListGroupItem>
                        </ListGroup>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ margin: 20 }}>
                <span>{book.description}</span>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default BookDetails;
