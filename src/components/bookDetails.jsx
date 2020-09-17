import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { confirmAlert } from "react-confirm-alert";
import { editBook } from "../services/bookService";
import "react-confirm-alert/src/react-confirm-alert.css";

class BookDetails extends Component {
  state = {
    book: this.props.book,
  };

  confirmDeleteBorrowing = (book, borrowingId) => {
    this.handleDeleteBorrowing(book, borrowingId);
    // confirmAlert({
    //   title: "",
    //   message: "Na pewno chcesz usunąć?",
    //   buttons: [
    //     {
    //       label: "Tak",
    //       onClick: () => this.handleDeleteBorrowing(book, borrowingId),
    //     },
    //   ],
    // });
  };

  handleDeleteBorrowing = (book, borrowing) => {
    console.log("Do usunięcia: ", borrowing);
    let borrowingList = book.borrowing.filter((b) => b.id !== borrowing.id);
    const available = book.available + borrowing.quantity;
    const newBook = {
      ...book,
      borrowing: borrowingList,
      available,
    };
    editBook(newBook).then(() => {
      window.location.reload(false);
    });
  };

  stopPropagationAndCall = (func) => (e) => {
    e.stopPropagation();
    func();
  };

  render() {
    const { book } = this.props;

    if (book) {
      console.log("JESTEŚ? ", this.state.book);
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
                          <ListGroupItem>
                            Lokalizacja: {book.location}
                          </ListGroupItem>
                          <ListGroupItem>
                            Ilość egzemplarzy: {book.quantity}
                          </ListGroupItem>
                          <ListGroupItem>
                            {" "}
                            Wypożyczenia:
                            {book.borrowing.length > 0 ? (
                              <ListGroup>
                                {book.borrowing.map((b) => (
                                  <ListGroupItem
                                    style={{ padding: 5 }}
                                    variant="success"
                                    key={b.id}
                                  >
                                    {b.person} : {b.date} : {b.quantity}
                                    <button
                                      style={{
                                        position: "absolute",
                                        right: 5,
                                        bottom: 1,
                                      }}
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={this.stopPropagationAndCall(() =>
                                        this.handleDeleteBorrowing(book, b)
                                      )}
                                    >
                                      X
                                    </button>
                                  </ListGroupItem>
                                ))}
                              </ListGroup>
                            ) : null}
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
