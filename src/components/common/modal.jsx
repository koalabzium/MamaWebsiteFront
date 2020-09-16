import React from "react";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

const MyModal = (props) => {
  const { book } = props;
  if (book) {
    console.log(book.borrowing);
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {book.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Img variant="top" src={book.image} />
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {book.author}
              </Card.Subtitle>
              <Card.Text>{book.link}</Card.Text>
            </Card.Body>
            {localStorage.getItem("token") ? (
              <ListGroup className="list-group-flush">
                <ListGroupItem>
                  Dostępne egzemplarze: {book.quantity}
                </ListGroupItem>
                {book.borrowing ? (
                  <ListGroupItem>
                    Wpożyczenia:{" "}
                    {book.borrowing.map((b) => (
                      <div key={b.id}>
                        {b.person} - {b.date} - {b.quantity} -
                      </div>
                    ))}
                  </ListGroupItem>
                ) : (
                  <ListGroupItem>Brak wypożyczeń</ListGroupItem>
                )}
                <ListGroupItem>Lokalizacja: {book.location} </ListGroupItem>
                <ListGroupItem>Opis: {book.description} </ListGroupItem>
              </ListGroup>
            ) : (
              <ListGroup>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>
                    Dostępne egzemplarze: {book.quantity}
                  </ListGroupItem>
                  <ListGroupItem>Opis: {book.description} </ListGroupItem>
                </ListGroup>{" "}
              </ListGroup>
            )}
          </Card>
        </Modal.Body>
      </Modal>
    );
  } else {
    return null;
  }
};

export default MyModal;
