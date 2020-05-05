import React, { Component } from "react";
import axios from "axios";
import ImageUpload from "./common/imageUpload";
import Input from "./common/input";

class AddBookForm extends Component {
  state = {
    categories: [],
    image: null,
    editedBook: null,
    title: "",
    author: "",
    description: "",
    quantity: 1,
    link: "",
    location: "",
    categoryId: "",
  };

  //UWAGA pamiętaj, żeby przy edytowaniu zrobić faktycznie edytowanie...

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("DODAWANKO2");
    //sprawadz czy dobry obrazek
    // this.props.history.push(`/books`);
  };

  handlePictureCrop = (image) => {
    this.setState({ image });
  };

  handleAddCategory = () => {
    console.log("Dodawanie kategorii");
  };

  modifyStateWithEditedBook = (book) => {
    this.setState({ title: book.title });
    this.setState({ author: book.author });
    this.setState({ categoryId: book.category });
    this.setState({ link: book.link });
    this.setState({ location: book.location });
    this.setState({ description: book.description });
    this.setState({ quantity: book.quantity });
    this.setState({ image: "data:image/jpeg;base64," + book.image });
  };

  async componentDidMount() {
    const url = require("../apiURL.json");
    const { data: categories } = await axios.get(url.url + "categories");
    this.setState({ categories });
    if (this.props.bookTitle) {
      try {
        const editedBook = await axios.get(
          url.url + "books/" + this.props.bookTitle
        );

        if (!editedBook) {
          console.log("null");
          return this.props.history.replace("/not-found");
        } else {
          this.modifyStateWithEditedBook(editedBook.data);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Nie ma bookID");
    }
  }

  render() {
    const { categories } = this.state;
    return (
      <React.Fragment>
        <form class="needs-validation" novalidate onSubmit={this.handleSubmit}>
          <Input
            label="Tytuł"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Autor(ka)"
            name="author"
            value={this.state.author}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Link"
            name="link"
            value={this.state.link}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Lokalizacja"
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Ilość egzemplarzy"
            name="quantity"
            value={this.state.quantity}
            onChange={this.handleChange}
            type="number"
          />
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">
              Wybierz kategorię lub{" "}
              <button className="clickable" onClick={this.handleAddCategory}>
                dodaj nową.
              </button>
            </label>
            <select
              value={this.state.category}
              name="category"
              onChange={this.handleChange}
              className="form-control"
              id="exampleFormControlSelect1"
            >
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Opis książki</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Zdjęcie okładki</label>

            <ImageUpload
              submitCrop={this.handlePictureCrop}
              image={this.state.image}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Dodaj
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default AddBookForm;
