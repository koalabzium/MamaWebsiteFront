import React, { Component } from "react";
import { addBook, editBook } from "../services/bookService";
import Dropzone from "react-dropzone";
import Resizer from "react-image-file-resizer";
import Input from "./common/input";
import { getPlaces } from "../services/placeService";
import Select from "react-select";
import { getCategories } from "../services/categoryService";

class AddBookForm extends Component {
  state = {
    categories: [],
    places: [],
    options: [],
    placesOptions: [],
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
    placeId: null,
    error: null,
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

  handleSelectPlace = (e) => {
    this.setState({ placeId: e.value });
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
      placeId,
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
      place: placeId,
      available: newAvailibility,
      id,
    };
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
      addBook({ ...editedBook, image: to_save_image })
        .then((res) => {
          console.log(res);
          this.props.onDoneAdd(res.data.message);
        })
        .catch((err) => {
          console.warn(err.message);

          if (err.response) {
            const { data } = err.response;
            const { message = "Niepoprawne dane" } = data || {};
            this.setState({ error: new Error(message) });
          } else {
            this.setState({ error: err });
          }
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
      const { quantity, available, category, place, ...rest } = book;
      this.setState({
        ...rest,
        originalQuantity: quantity,
        quantity,
        categoryId: category,
        placeId: place,
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
    const { data: places } = await getPlaces();
    const options = categories
      .sort(function (a, b) {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      })
      .map((cat) => {
        return { value: cat.id, label: cat.name };
      });
    const placesOptions = places
      .sort(function (a, b) {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      })
      .map((pl) => {
        return { value: pl.id, label: pl.name };
      });
    console.log(options);
    this.setState({ options });
    this.setState({ categories });
    this.setState({ places });
    this.setState({ placesOptions });
  }

  render() {
    const {
      options,
      placesOptions,
      title,
      author,
      description,
      quantity,
      link,
      location,
      categoryId,
      placeId,
      minQuantity,
      image_link,
      error,
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
            <Select
              options={options}
              onChange={this.handleSelect}
              value={options.find(({ value }) => value === categoryId)}
            />
          </div>

          <div className="form-group">
            <label>Wybierz lokalizację</label>
            <Select
              options={placesOptions}
              onChange={this.handleSelectPlace}
              value={placesOptions.find(({ value }) => value === placeId)}
            />
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
            />
          </div>
          <Input
            label="Wydawnictwo"
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
            />
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

          {error && (
            <div className="alert alert-danger" role="alert">
              {error.message}
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
