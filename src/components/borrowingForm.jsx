import React, { Component } from "react";
import Input from "./common/input";
import { editBook } from "../services/bookService";
import { getReaders } from "../services/readerService";
import Select from "react-select";

class BorrowingForm extends Component {
  state = {
    date: "",
    quantity: 1,
    personId: null,
    options: [],
  };

  handleSubmit = (e) => {
    const { date, quantity, personId } = this.state;
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
      personId,
      active: true,
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
    const { data: readers } = await getReaders();
    const options = readers
      .sort(function (a, b) {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      })
      .map((cat) => {
        return { value: cat.id, label: cat.name };
      });
    this.setState({ options });
    //NA TAKIEJ SAMEJ ZASADZIE KIEDYŚ USERS...
    // const { data: categories } = await getCategories();
    // this.setState({ categories });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelect = (e) => {
    this.setState({ personId: e.value });
  };

  render() {
    const { personId, date, quantity, options } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="form-group">
            <label>Wybierz czytelnika_czkę</label>
            <Select options={options} onChange={this.handleSelect} />
          </div>

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
