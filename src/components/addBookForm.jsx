import React, { Component } from "react";
import axios from "axios";
import ImageUpload from "./common/imageUpload";

class AddBookForm extends Component {
  state = {
    categories: [],
    image: null,
  };

  handleAdd = (e) => {
    e.preventDefault();
    console.log("DODAWANKO2");
  };

  handlePictureCrop = (image) => {
    this.setState({ image });
  };

  handleAddCategory = () => {
    console.log("Dodawanie kategorii");
  };

  async componentDidMount() {
    const url = require("../apiURL.json");
    const { data: categories } = await axios.get(url.url + "categories");
    this.setState({ categories });
  }

  render() {
    const { categories } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleAdd}>
          <div className="form-group">
            <label>Tytuł</label>
            <input className="form-control"></input>
          </div>
          <div className="form-group">
            <label>Autor(ka)</label>
            <input className="form-control"></input>
          </div>
          <div className="form-group">
            <label>Link</label>
            <input className="form-control"></input>
          </div>
          <div className="form-group">
            <label>Lokalizacja</label>
            <input className="form-control"></input>
          </div>
          <div className="form-group">
            <label>Ilość egzemplarzy</label>
            <input className="form-control"></input>
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Wybierz kategorię</label>
            <select className="form-control" id="exampleFormControlSelect1">
              {categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
              <option className="clickable" onClick={this.handleAddCategory}>
                <a href="www.google.com">Dodaj kategorię...</a>
              </option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Opis książki</label>
            <textarea className="form-control" rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Zdjęcie okładki</label>

            <ImageUpload submitCrop={this.handlePictureCrop} />
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
