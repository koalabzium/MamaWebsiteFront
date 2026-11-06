import React, { useState, useEffect } from "react";
import { addBook, editBook } from "../services/bookService";
import Dropzone from "react-dropzone";
import Resizer from "react-image-file-resizer";
import Input from "./common/input";
import { getPlaces } from "../services/placeService";
import Select from "react-select";
import { getCategories } from "../services/categoryService";
import BookCover from "./common/bookCover";

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

const AddBookForm = ({ book, onDoneEdit, onDoneAdd, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState([]);
  const [placesOptions, setPlacesOptions] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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


  const toError = (err) => {
    if (err.response) {
      const { message = "Niepoprawne dane" } = err.response.data || {};
      return new Error(message);
    }
    return err;
  };

  const handleSubmit = async (e) => {
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
    const toSaveImage = image_link === "" ? image : image_link;
    const bookToSave = {
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
      image: toSaveImage,
    };

    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await editBook(bookToSave);
        onDoneEdit(bookToSave);
      } else {
        const res = await addBook(bookToSave);
        onDoneAdd(res.data);
      }
    } catch (err) {
      setError(toError(err));
      setSaving(false);
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
  const invalid = validateForm();
  const previewImage = image_link || image;

  return (
    <form onSubmit={handleSubmit} noValidate className="book-form">
      <div className="row">
        <div className="col-md-8">
          <div className="form-row">
            <div className="col-sm-6">
              <Input label="Tytuł *" name="title" value={title} onChange={handleChange} type="" />
            </div>
            <div className="col-sm-6">
              <Input
                label="Autor(ka) *"
                name="author"
                value={author}
                onChange={handleChange}
                type=""
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-sm-6">
              <label>Kategoria</label>
              <Select
                options={options}
                onChange={handleSelect}
                value={options.find(({ value }) => value === categoryId) || null}
                placeholder="Wybierz kategorię"
              />
            </div>
            <div className="form-group col-sm-6">
              <label>Lokalizacja</label>
              <Select
                options={placesOptions}
                onChange={handleSelectPlace}
                value={placesOptions.find(({ value }) => value === placeId) || null}
                placeholder="Wybierz lokalizację"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="col-sm-8">
              <Input
                label="Wydawnictwo"
                name="location"
                value={location}
                onChange={handleChange}
                type=""
              />
            </div>
            <div className="form-group col-sm-4">
              <label>Ilość egzemplarzy *</label>
              <input
                className="form-control"
                name="quantity"
                value={quantity}
                onChange={handleChange}
                type="number"
                min={parseInt(minQuantity)}
                noValidate
              />
              {editing && minQuantity > 0 && (
                <small className="form-text text-muted">
                  Wypożyczone: {minQuantity}
                </small>
              )}
            </div>
          </div>

          <Input
            label="Strona z książką (link)"
            name="link"
            value={link}
            onChange={handleChange}
            type="url"
          />

          <div className="form-group">
            <label>Opis książki</label>
            <textarea
              className="form-control"
              rows="6"
              name="description"
              value={description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label>Okładka</label>
            <div className="book-form__cover">
              <BookCover src={previewImage} title={title} author={author} />
            </div>
            {image ? (
              <button
                type="button"
                className="btn btn-outline-dark btn-sm btn-block mt-2"
                onClick={() => setForm((prev) => ({ ...prev, image: null }))}
              >
                Usuń zdjęcie
              </button>
            ) : (
              <Dropzone onDrop={handleOnDrop} accept="image/*">
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="mt-2">
                    <input {...getInputProps()} />
                    <div className="dropzone clickable">
                      Przeciągnij zdjęcie lub kliknij i wybierz plik.
                    </div>
                  </div>
                )}
              </Dropzone>
            )}
          </div>

          <Input
            label="Lub wklej link do okładki"
            name="image_link"
            value={image_link}
            onChange={handleChange}
            type="url"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}

      <div className="book-form__footer">
        {invalid && (
          <small className="text-muted mr-auto">Wpisz przynajmniej tytuł i autora.</small>
        )}
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Anuluj
          </button>
        )}
        <button disabled={invalid || saving} type="submit" className="btn btn-primary">
          {saving ? "Zapisywanie…" : editing ? "Zapisz zmiany" : "Dodaj książkę"}
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;
