import React, { Component } from "react";
import { addBook, editBook } from "../services/bookService";
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
    id: "",
    categoryId: "1599287492509648",
    errors: null,
    editing: false,
    addingCategory: false,
  };

  validateForm = () => {
    const {
      image,
      title,
      author,
      description,
      quantity,
      link,
      editing,
    } = this.state;

    //CZY ZDJĘCIE ODPOWIEDZNICH ROZMIARÓW?

    if (
      // (image === null && editing === false) || // image is optional
      title === "" ||
      author === "" ||
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
      editing,
      available,
      id,
    } = this.state;
    e.preventDefault();
    const editedBook = {
      title,
      author,
      description,
      quantity,
      link,
      location,
      category: categoryId,
      available,
      id,
    };
    if (editing) {
      this.props.onDoneEdit({ ...editedBook, image });
      editBook(editedBook).then((res) => {
        console.log("edited, ", res);
      });
      console.log("editing");
    } else {
      console.log("Dodawaaanieee");
      addBook({ ...editedBook, image }).then((res) => {
        console.log(res);
        this.props.onDoneAdd(res.data.message);
      });
    }
  };

  handlePictureCrop = (image) => {
    this.setState({ image });
  };

  handleAddCategory = () => {
    this.setState({ addingCategory: true });
    console.log("Dodawanie kategorii");
  };

  componentWillReceiveProps(nextProps) {
    this.modifyStateWithEditedBook(nextProps.book);
  }

  modifyStateWithEditedBook = (book) => {
    if (book) {
      this.setState({ title: book.title });
      this.setState({ author: book.author });
      this.setState({ categoryId: book.category });
      this.setState({ link: book.link });
      this.setState({ location: book.location });
      this.setState({ description: book.description });
      this.setState({ quantity: book.quantity });
      this.setState({ image: book.image });
      this.setState({ id: book.id });
      this.setState({ available: book.available });
    }
  };

  async componentDidMount() {
    if (this.props.book) {
      this.setState({ editing: true });
      this.modifyStateWithEditedBook(this.props.book);
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
      editing,
      addingCategory,
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
            label="Odnośnik"
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
            <label htmlFor="exampleFormControlSelect1">Wybierz kategorię</label>
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
          {editing ? null : (
            <div className="form-group">
              <label>Zdjęcie okładki</label>

              <ImageUpload submitCrop={this.handlePictureCrop} image={image} />
            </div>
          )}

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
            Zatwierdź
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default AddBookForm;
