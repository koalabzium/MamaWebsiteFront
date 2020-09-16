import React, { Component } from "react";
import Input from "./common/input";
import { editBook } from "../services/bookService";

class BorrowingForm extends Component {
  state = {
    date: "",
    quantity: 1,
    person: "",
  };

  handleSubmit = (e) => {
    const { date, quantity, person } = this.state;
    const { book } = this.props;
    e.preventDefault();
    console.log("book na poczatku", book);
    let borrowingList = book.borrowing;
    console.log("lista bez nowego", borrowingList);
    const copiesLeft = book.available - quantity;
    const newBorrowing = {
      id: Date.now(),
      date,
      quantity,
      person,
    };
    borrowingList.push(newBorrowing);
    console.log("lista po push", borrowingList);
    const editedBook = {
      ...book,
      borrowing: borrowingList,
      available: copiesLeft,
    };
    console.log("ksiazka po edycji: ", editedBook);
    editBook(editedBook).then((res) => {
      console.log("edited, ", res);
    });
    this.props.onDoneBorrow(editedBook);
  };
  async componentDidMount() {
    this.setState({ book: this.props.book });
    //NA TAKIEJ SAMEJ ZASADZIE KIEDYŚ USERS...
    // const { data: categories } = await getCategories();
    // this.setState({ categories });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { person, date, quantity, book } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} noValidate>
          <Input
            label="Wypożyczający_a"
            name="person"
            value={person}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Data"
            name="date"
            value={date}
            onChange={this.handleChange}
            type="date"
          />
          <div className="form-group">
            <label>Wypożyczana ilość</label>
            <input
              className="form-control"
              name="quantity"
              value={quantity}
              onChange={this.handleChange}
              type="number"
              max={this.props.book.available}
              min={1}
              noValidate
            ></input>
          </div>

          <button type="submit" className="btn btn-primary">
            Zatwierdź
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default BorrowingForm;
