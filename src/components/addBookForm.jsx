import React, { useState, useEffect } from "react";
import { addBook, editBook } from "../services/bookService";
import Dropzone from "react-dropzone";
import Resizer from "react-image-file-resizer";
import Input from "./common/input";
import { getPlaces } from "../services/placeService";
import Select from "react-select";
import { getCategories } from "../services/categoryService";

const sortByName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      "JPEG",
      70,
      0,
      (uri) => resolve(uri),
      "base64"
    );
  });

const emptyForm = {
  title: "",
  author: "",
  description: "",
  quantity: 1,
  link: "",
  location: "",
  id: "",
  categoryId: null,
  placeId: null,
  image: null,
  image_link: "",
  available: undefined,
  originalQuantity: undefined,
};

const AddBookForm = ({ book, onDoneEdit, onDoneAdd }) => {
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState([]);
  const [placesOptions, setPlacesOptions] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  // Populate the form from the book being edited, both on initial mount and
  // whenever a different book is passed in (e.g. clicking "edit" on another
  // book while this form is already open).
  useEffect(() => {
    if (book) {
      const { quantity, available, category, place, ...rest } = book;
      setEditing(true);
      setForm((prev) => ({
        ...prev,
        ...rest,
        quantity,
        available,
        originalQuantity: quantity,
        categoryId: category,
        placeId: place,
      }));
    }
  }, [book]);

  useEffect(() => {
    const loadOptions = async () => {
      const { data: categories } = await getCategories();
      const { data: places } = await getPlaces();
      setOptions(
        categories.sort(sortByName).map((cat) => ({ value: cat.id, label: cat.name }))
      );
      setPlacesOptions(
        places.sort(sortByName).map((pl) => ({ value: pl.id, label: pl.name }))
      );
    };
    loadOptions();
  }, []);

  const validateForm = () => {
    const { title, author, quantity } = form;
    return title === "" || author === "" || quantity === "";
  };

  const handleChange = (e) => {
    // Read the SyntheticEvent's fields synchronously — React 16 pools and
    // nullifies them right after this handler returns, so referencing
    // e.target lazily inside the setState updater below (which can run
    // after that pooling reset) would intermittently throw.
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e) => setForm((prev) => ({ ...prev, categoryId: e.value }));
  const handleSelectPlace = (e) => setForm((prev) => ({ ...prev, placeId: e.value }));

  const handleOnDrop = async (files) => {
    if (files && files.length > 0) {
      const image = await resizeFile(files[0]);
      setForm((prev) => ({ ...prev, image }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      available,
      id,
      image_link,
      originalQuantity,
    } = form;

    const newAvailability = parseInt(available) + parseInt(quantity - originalQuantity);
    let editedBook = {
      title,
      author,
      description,
      quantity,
      link,
      location,
      category: categoryId,
      place: placeId,
      available: newAvailability,
      id,
    };
    const toSaveImage = image_link === "" ? image : image_link;

    if (editing) {
      editedBook = { ...editedBook, image: toSaveImage };
      onDoneEdit(editedBook);
      editBook(editedBook);
    } else {
      addBook({ ...editedBook, image: toSaveImage })
        .then((res) => onDoneAdd(res.data))
        .catch((err) => {
          if (err.response) {
            const { data } = err.response;
            const { message = "Niepoprawne dane" } = data || {};
            setError(new Error(message));
          } else {
            setError(err);
          }
        });
    }
  };

  const {
    title,
    author,
    description,
    quantity,
    link,
    location,
    categoryId,
    placeId,
    image,
    image_link,
    available,
    originalQuantity,
  } = form;
  const minQuantity =
    originalQuantity !== undefined ? originalQuantity - available : 0;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input label="Tytuł" name="title" value={title} onChange={handleChange} type="" />
      <Input
        label="Autor(ka)"
        name="author"
        value={author}
        onChange={handleChange}
        type=""
      />

      <div className="form-group">
        <label>Wybierz kategorię</label>
        <Select
          options={options}
          onChange={handleSelect}
          value={options.find(({ value }) => value === categoryId)}
        />
      </div>

      <div className="form-group">
        <label>Wybierz lokalizację</label>
        <Select
          options={placesOptions}
          onChange={handleSelectPlace}
          value={placesOptions.find(({ value }) => value === placeId)}
        />
      </div>

      <Input label="Odnośnik" name="link" value={link} onChange={handleChange} type="" />
      <div className="form-group">
        <label>Ilość egzemplarzy</label>
        <input
          className="form-control"
          name="quantity"
          value={quantity}
          onChange={handleChange}
          type="number"
          min={parseInt(minQuantity)}
          noValidate
        />
      </div>
      <Input
        label="Wydawnictwo"
        name="location"
        value={location}
        onChange={handleChange}
        type=""
      />

      <div className="form-group">
        <label htmlFor="exampleFormControlTextarea1">Opis książki</label>
        <textarea
          className="form-control"
          rows="3"
          name="description"
          value={description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Zdjęcie okładki</label>
        {image ? (
          <div>
            <div>
              <img src={image} className="rounded" alt="okładka" />
            </div>

            <div>
              <button
                className="btn btn-dark"
                onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                style={{ marginTop: 10 }}
              >
                Zmień zdjęcie
              </button>
            </div>
          </div>
        ) : (
          <Dropzone onDrop={handleOnDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone clickable">
                  Przeciągnij zdjęcie lub kliknij tutaj i wybierz je z plików.
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
        onChange={handleChange}
        type=""
      />

      {validateForm() ? (
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

      <button disabled={validateForm()} type="submit" className="btn btn-primary">
        Zatwierdź
      </button>
    </form>
  );
};

export default AddBookForm;
