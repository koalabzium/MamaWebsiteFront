import React, { Component } from "react";
import axios from "axios";

class AddBookForm extends Component {
  state = {
    categories: [],
  };

  handleAdd = (e) => {
    e.preventDefault();
    console.log("DODAWANKO");
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
            <label htmlFor="exampleFormControlSelect1">Example select</label>
            <select className="form-control" id="exampleFormControlSelect1">
              {categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
              <option>Dodaj kategorię...</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Opis książki</label>
            <textarea className="form-control" rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Zdjęcie okładki</label>
            <input type="file" className="form-control-file"></input>
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
