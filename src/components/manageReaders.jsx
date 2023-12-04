import React, { Component } from "react";
import {
  getReaders,
  deleteReader,
  updateReader,
  addReader,
  getReadersBorrowings,
} from "../services/readerService";
import BorrowingsModal from "./borrowingsModal";
import { handleCancelBorrowing } from "../services/borrowingService";
import { MenuBook } from "@material-ui/icons/";

class ManageReaders extends Component {
  state = {
    readers: [],
    editing: false,
    adding: false,
    new_reader: "",
    edited_reader: "",
    borrowings: null,
  };

  async componentDidMount() {
    const readers = await getReaders();
    const readers_data = readers.data.map((cat) => ({
      ...cat,
      edited: false,
    }));
    readers_data.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    this.setState({ readers: readers_data });
  }

  handleDelete = async (reader) => {
    const readers = this.state.readers.filter((c) => c.id !== reader.id);
    this.setState({ readers });
    await deleteReader(reader.id);
    console.log("usuwanko");
  };

  handleOpenBorrowingDetails = async (reader) => {
    const borrowings = await getReadersBorrowings(reader.id);
    console.log(borrowings.data);
    this.setState({ borrowings: borrowings.data });
  };

  onCancelBorrowing = (toDelete) => {
    handleCancelBorrowing(toDelete).then(() => {
      this.setState({
        borrowings: this.state.borrowings.filter((b) => b !== toDelete),
      });
    });
  };

  handleAdd = async (e) => {
    if (e.key === "Enter") {
      const readers = this.state.readers;
      readers.push({
        id: null,
        name: this.state.new_reader,
      });
      this.setState({ readers });
      const name = this.state.new_reader;
      this.setState({ new_reader: "" });
      await addReader(name);
    }
  };

  handleEdit = async (e, reader) => {
    if (e.key === "Enter") {
      const readers = this.state.readers.map((cat) =>
        cat.id === reader.id
          ? { ...cat, name: this.state.edited_reader, edited: false }
          : cat
      );
      this.setState({ readers });
      const name = this.state.edited_reader;
      this.setState({ edited_reader: "" });
      await updateReader(reader.id, name);
    }
  };

  toEdit = (reader) => {
    const readers = this.state.readers.map((cat) =>
      cat.id === reader.id ? { ...cat, edited: true } : cat
    );
    this.setState({ edited_reader: reader.name });
    this.setState({ readers });
  };

  handleChange = (e) => {
    this.setState({ new_reader: e.target.value });
  };

  handleEditChange = (e) => {
    this.setState({ edited_reader: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ padding: 20 }}>
          <div className="card category">
            <div className="card-body">
              <h2>Czytelniczki i czytelnicy </h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.readers.map((reader) => (
                    <tr key={reader.id}>
                      {reader.edited ? (
                        <input
                          className="form-control"
                          value={this.state.edited_reader}
                          onChange={this.handleEditChange}
                          onKeyDown={(e) => this.handleEdit(e, reader)}
                          noValidate
                        />
                      ) : (
                        <td onClick={() => this.toEdit(reader)}>
                          {reader.name}
                        </td>
                      )}

                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => this.handleDelete(reader)}
                        >
                          X
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            this.handleOpenBorrowingDetails(reader)
                          }
                        >
                          <MenuBook />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <input
                      className="form-control"
                      value={this.state.new_reader}
                      onChange={this.handleChange}
                      onKeyDown={this.handleAdd}
                      placeholder="Nowa czytelniczka..."
                      noValidate
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <BorrowingsModal
          borrowings={this.state.borrowings}
          onCancelBorrowing={this.onCancelBorrowing}
          onHide={() => this.setState({ borrowings: null })}
        />
      </React.Fragment>
    );
  }
}

export default ManageReaders;
