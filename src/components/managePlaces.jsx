import React, { Component } from "react";
import {
  getPlaces,
  deletePlace,
  updatePlace,
  addPlace,
} from "../services/placeService";

class ManagePlaces extends Component {
  state = {
    places: [],
    editing: false,
    adding: false,
    new_place: "",
    edited_place: "",
  };

  async componentDidMount() {
    const places = await getPlaces();
    const places_data = places.data.map((cat) => ({
      ...cat,
      edited: false,
    }));
    places_data.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    this.setState({ places: places_data });
  }

  handleDelete = async (place) => {
    const places = this.state.places.filter((c) => c.id !== place.id);
    this.setState({ places });
    await deletePlace(place.id);
    console.log("usuwanko");
  };

  handleAdd = async (e) => {
    if (e.key === "Enter") {
      const places = this.state.places;
      places.push({
        id: null,
        name: this.state.new_place,
      });
      this.setState({ places });
      const name = this.state.new_place;
      this.setState({ new_place: "" });
      await addPlace(name);
    }
  };

  handleEdit = async (e, place) => {
    if (e.key === "Enter") {
      const places = this.state.places.map((cat) =>
        cat.id === place.id
          ? { ...cat, name: this.state.edited_place, edited: false }
          : cat
      );
      this.setState({ places });
      const name = this.state.edited_place;
      this.setState({ edited_place: "" });
      await updatePlace(place.id, name);
    }
  };

  toEdit = (place) => {
    const places = this.state.places.map((cat) =>
      cat.id === place.id ? { ...cat, edited: true } : cat
    );
    this.setState({ edited_place: place.name });
    this.setState({ places });
  };

  handleChange = (e) => {
    this.setState({ new_place: e.target.value });
  };

  handleEditChange = (e) => {
    this.setState({ edited_place: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ padding: 20 }}>
          <div className="card place">
            <div className="card-body">
              <h2>Zarządzaj lokalizacjami </h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.places.map((place) => (
                    <tr key={place.id}>
                      {place.edited ? (
                        <input
                          className="form-control"
                          value={this.state.edited_place}
                          onChange={this.handleEditChange}
                          onKeyDown={(e) => this.handleEdit(e, place)}
                          noValidate
                        />
                      ) : (
                        <td onClick={() => this.toEdit(place)}>{place.name}</td>
                      )}

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => this.handleDelete(place)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <input
                      className="form-control"
                      value={this.state.new_place}
                      onChange={this.handleChange}
                      onKeyDown={this.handleAdd}
                      placeholder="Nowa kategoria..."
                      noValidate
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ManagePlaces;
