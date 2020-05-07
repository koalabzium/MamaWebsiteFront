import React, { Component } from "react";
import axios from "axios";
import ImageUpload from "./common/imageUpload";
import Input from "./common/input";
import { getCategories } from "../services/categoryService";

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
    categoryId: "1584616466602349",
    errors: null,
  };

  //UWAGA pamiętaj, żeby przy edytowaniu zrobić faktycznie edytowanie...

  validateForm = () => {
    const { image, title, author, description, quantity, link } = this.state;

    //CZY ZDJĘCIE ODPOWIEDZNICH ROZMIARÓW?

    if (
      image === null ||
      title === "" ||
      author === "" ||
      description === "" ||
      quantity === "" ||
      link === ""
    ) {
      return true;
    }

    return false;
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    const {
      image,
      title,
      author,
      description,
      quantity,
      link,
      location,
      categoryId,
    } = this.state;
    e.preventDefault();
    const url = require("../apiURL.json");
    const post_url = url.url + "books";
    axios({
      method: "post",
      url: post_url,
      headers: {},
      data: {
        image,
        title,
        author,
        description,
        quantity,
        link,
        location,
        category: categoryId,
      },
    }).then((res) => {
      console.log(res);
    });

    this.props.history.push(`/books`);
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
    if (this.props.bookTitle) {
      try {
        const editedBook = await axios.get(
          url.url + "books/" + this.props.bookTitle
        );

        if (!editedBook) {
          return this.props.history.replace("/not-found");
        } else {
          this.modifyStateWithEditedBook(editedBook.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const { data: categories } = await getCategories();
    this.setState({ categories });
  }

  render() {
    const {
      categories,
      image,
      title,
      author,
      description,
      quantity,
      link,
      location,
      categoryId,
    } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} noValidate>
          <Input
            label="Tytuł"
            name="title"
            value={title}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Autor(ka)"
            name="author"
            value={author}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Link"
            name="link"
            value={link}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Lokalizacja"
            name="location"
            value={location}
            onChange={this.handleChange}
            type=""
          />
          <Input
            label="Ilość egzemplarzy"
            name="quantity"
            value={quantity}
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
              value={categoryId}
              name="categoryId"
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
              value={description}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Zdjęcie okładki</label>

            <ImageUpload submitCrop={this.handlePictureCrop} image={image} />
          </div>
          {this.validateForm() ? (
            <div className="alert alert-danger" role="alert">
              Wypełnij wszystkie pola i przytnij zdjęcie, przed zaakceptowaniem
              książki.{" "}
            </div>
          ) : (
            <div className="alert alert-success" role="alert">
              Gotowe :)
            </div>
          )}
          <button
            disabled={this.validateForm()}
            type="submit"
            className="btn btn-primary"
          >
            Dodaj
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default AddBookForm;
