import React, {useEffect, useState} from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

const {REACT_APP_API_URL} = process.env;

const BookBorrowings = ({bookId}) => {
    const [borrowings, setBorrowings] = useState([]);

    useEffect(() => {
        if (bookId) {
            axios
                .get(`${REACT_APP_API_URL}books/${bookId}/borrowings`)
                .then(({data}) => {
                    console.log("borrowings", data);
                    setBorrowings(data);
                });
        }
    }, [bookId]);

    const handleCancelBorrowing = (borrowing) => {
        axios
            .post(`${REACT_APP_API_URL}borrowings/${borrowing.id}/cancel`, {}, {
                headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(({data}) => {
                console.log(data);
                setBorrowings(prev => prev.filter(({id}) => id !== borrowing.id))
            })
            .catch(err => {
                // TODO: Display to user.
                console.error('Error when cenceling borrowing: ', err.message);
            })
    };

    return (
        <div>
            <ListGroup>
                {borrowings.map((b) =>
                    b.active ? (
                        <ListGroupItem style={{padding: 5}} variant="success" key={b.id}>
                            {b.readerName} : {b.date} : {b.quantity}
                            <button
                                style={{
                                    position: "absolute",
                                    right: 5,
                                    bottom: 1,
                                }}
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelBorrowing(b)}
                            >
                                X
                            </button>
                        </ListGroupItem>
                    ) : null
                )}
            </ListGroup>
        </div>
    );
};

export default BookBorrowings;
