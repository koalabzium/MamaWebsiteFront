import React, { Component } from "react";
import { addBook, editBook } from "../services/bookService";
import Dropzone from "react-dropzone";
import Resizer from "react-image-file-resizer";
import Input from "./common/input";
import { getCategories } from "../services/categoryService";
import Select from "react-select";

class AddBookForm extends Component {
  state = {
    categories: [],
    options: [],
    image: null,
    editedBook: null,
    title: "",
    author: "",
    description: "",
    quantity: 1,
    link: "",
    location: "",
    id: "",
    categoryId: null,
    errors: null,
    editing: false,
    addingCategory: false,
    image_link: "",
    minQuantity: 0,
  };

  resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500,
        500,
        "JPEG",
        70,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  validateForm = () => {
    const { title, author, quantity } = this.state;

    if (title === "" || author === "" || quantity === "") {
      return true;
    }

    return false;
  };

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  handleUrlChange = async (e) => {
    console.log(e.target.value);
    this.toDataURL(e.target.value, (dataUrl) => {
      this.setState({ image: dataUrl });
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelect = (e) => {
    this.setState({ categoryId: e.value });
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
      image_link,
      originalQuantity,
    } = this.state;
    e.preventDefault();
    const newAvailibility =
      parseInt(available) + parseInt(quantity - originalQuantity);
    let editedBook = {
      title,
      author,
      description,
      quantity,
      link,
      location,
      category: categoryId,
      available: newAvailibility,
      id,
    };
    console.log("EDITED", editedBook);
    let to_save_image = image_link;
    if (image_link === "") {
      to_save_image = image;
    }
    if (editing) {
      editedBook = { ...editedBook, image: to_save_image };
      console.log(editedBook);
      this.props.onDoneEdit(editedBook);
      editBook(editedBook).then((res) => {
        console.log("edited, ", res);
      });
      console.log("editing");
    } else {
      console.log("Dodawaaanieee");
      addBook({ ...editedBook, image: to_save_image }).then((res) => {
        console.log(res);
        this.props.onDoneAdd(res.data.message);
      });
    }
  };

  handleOnDrop = async (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const image = await this.resizeFile(currentFile);
      console.log(image);
      this.setState({ image });
      // const myFileItemReader = new FileReader();
      // myFileItemReader.addEventListener("load", () => {
      //   const result = myFileItemReader.result;

      //   this.setState({ image: result });
      // });
      // myFileItemReader.readAsDataURL(currentFile);
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
      const { quantity, available, category, ...rest } = book;
      this.setState({
        ...rest,
        originalQuantity: quantity,
        quantity,
        categoryId: category,
        available,
        minQuantity: quantity - available,
      });
    }
  };

  async componentDidMount() {
    if (this.props.book) {
      this.setState({ editing: true });
      this.modifyStateWithEditedBook(this.props.book);
    }
    const { data: categories } = await getCategories();
    const options = categories
      .sort(function (a, b) {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      })
      .map((cat) => {
        return { value: cat.id, label: cat.name };
      });
    console.log(options);
    this.setState({ options });
    this.setState({ categories });
  }

  render() {
    const {
      categories,
      options,
      available,
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
      minQuantity,
      image_link,
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

          <div className="form-group">
            <label>Wybierz kategorię</label>
            <Select options={options} onChange={this.handleSelect} />
          </div>

          <Input
            label="Odnośnik"
            name="link"
            value={link}
            onChange={this.handleChange}
            type=""
          />
          <div className="form-group">
            <label>Ilość egzemplarzy</label>
            <input
              className="form-control"
              name="quantity"
              value={quantity}
              onChange={this.handleChange}
              type="number"
              min={parseInt(minQuantity)}
              noValidate
            ></input>
          </div>
          <Input
            label="Lokalizacja"
            name="location"
            value={location}
            onChange={this.handleChange}
            type=""
          />

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
            {this.state.image ? (
              <div>
                <div>
                  <img
                    src={this.state.image}
                    className="rounded"
                    alt="okładka"
                  />
                </div>

                <div>
                  <button
                    className="btn btn-dark"
                    onClick={() => this.setState({ image: null })}
                    style={{ marginTop: 10 }}
                  >
                    Zmień zdjęcie
                  </button>
                </div>
              </div>
            ) : (
              <Dropzone onDrop={this.handleOnDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dropzone clickable">
                      Przeciągnij zdjęcie lub kliknij tutaj i wybierz je z
                      plików.
                    </div>
                  </div>
                )}
              </Dropzone>
            )}
          </div>

          <Input
            label="Lub wstaw link do okładki"
            name="image_link"
            value={image_link}
            onChange={this.handleChange}
            type=""
          />

          {this.validateForm() ? (
            <div className="alert alert-danger" role="alert">
              Wpisz przynajmniej Autorkę i Tytuł.{" "}
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
