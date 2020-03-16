import React, { Component } from "react";
import axios from "axios";
import Like from "./common/like";

export class BooksView extends Component {
  state = {
    books: [],
    liked: [],
    likedSet: new Set()
  };

  async componentDidMount() {
    const { data: books } = await axios.get(
      "https://us-central1-mamusialibrary.cloudfunctions.net/app/books"
    );
    this.setState({ books });
    const liked =
      localStorage.getItem("likedBooks") === null
        ? []
        : JSON.parse(localStorage.getItem("likedBooks"));
    let likedSet = new Set();
    liked.map(book => likedSet.add(book.title));
    this.setState({ liked, likedSet });
  }

  handleDelete = book => {
    console.log("Deleting" + book);
  };

  handleLike = book => {
    let liked = this.state.liked;
    let likedSet = this.state.likedSet;

    if (likedSet.has(book.title)) {
      liked = liked.filter(b => b.title != book.title);
      likedSet.delete(book.title);
    } else {
      liked.push(book);
      likedSet.add(book.title);
    }

    this.setState({ liked, likedSet });
    localStorage.setItem("likedBooks", JSON.stringify(liked));
  };

  render() {
    if (this.state.books.length === 0)
      return (
        <div>
          <h2>Ładowanie...</h2>
        </div>
      );
    return (
      <React.Fragment>
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Tytuł</th>
              <th>Autor(ka)</th>
              <th>Link</th>
              <th>Okładka</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.books.map(book => (
              <tr key={book.title}>
                <td>
                  <Like
                    liked={this.state.likedSet.has(book.title)}
                    onClickToggle={() => this.handleLike(book)}
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.link}</td>
                <td>
                  <img src={`data:image/jpeg;base64,${book.image}`} />
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(book)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Twoje polubione książki: </h3>
        <ul>
          {this.state.liked.map(book => (
            <li key={book.title}>{book.title}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default BooksView;
