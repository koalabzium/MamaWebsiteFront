import React, { Component } from "react";
import {
  getCategories,
  deleteCategory,
  updateCategory,
  addCategory,
} from "../services/categoryService";

class ManageCategories extends Component {
  state = {
    categories: [],
    editing: false,
    adding: false,
    new_category: "",
    edited_category: "",
  };

  async componentDidMount() {
    const categories = await getCategories();
    console.log(categories.data);
    const categories_data = categories.data.map((cat) => ({
      ...cat,
      edited: false,
    }));
    this.setState({ categories: categories_data });
  }

  handleDelete = async (category) => {
    const categories = this.state.categories.filter(
      (c) => c.id !== category.id
    );
    this.setState({ categories });
    await deleteCategory(category.id);
    console.log("usuwanko");
  };

  handleAdd = async (e) => {
    if (e.key === "Enter") {
      const categories = this.state.categories;
      categories.push({
        id: null,
        name: this.state.new_category,
      });
      this.setState({ categories });
      const name = this.state.new_category;
      this.setState({ new_category: "" });
      await addCategory(name);
    }
  };

  handleEdit = async (e, category) => {
    if (e.key === "Enter") {
      const categories = this.state.categories.map((cat) =>
        cat.id === category.id
          ? { ...cat, name: this.state.edited_category, edited: false }
          : cat
      );
      this.setState({ categories });
      const name = this.state.edited_category;
      this.setState({ edited_category: "" });
      await updateCategory(category.id, name);
    }
  };

  toEdit = (category) => {
    const categories = this.state.categories.map((cat) =>
      cat.id === category.id ? { ...cat, edited: true } : cat
    );
    this.setState({ edited_category: category.name });
    this.setState({ categories });
  };

  handleChange = (e) => {
    this.setState({ new_category: e.target.value });
  };

  handleEditChange = (e) => {
    this.setState({ edited_category: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ padding: 20 }}>
          <div className="card category">
            <div className="card-body">
              <h2>Zarządzaj kategoriami </h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.categories.map((category) => (
                    <tr key={category.id}>
                      {category.edited ? (
                        <input
                          className="form-control"
                          value={this.state.edited_category}
                          onChange={this.handleEditChange}
                          onKeyDown={(e) => this.handleEdit(e, category)}
                          noValidate
                        />
                      ) : (
                        <td onClick={() => this.toEdit(category)}>
                          {category.name}
                        </td>
                      )}

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => this.handleDelete(category)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <input
                      className="form-control"
                      value={this.state.new_category}
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

export default ManageCategories;
