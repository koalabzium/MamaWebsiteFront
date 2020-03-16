import React, { Component } from "react";
import "./App.css";
import BooksView from "./components/books";
import Navigation from "./components/naviagtion";

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navigation />
        <main className="container m-3">
          <BooksView />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
