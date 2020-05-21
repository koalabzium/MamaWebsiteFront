import React, { Component } from "react";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";
import BooksView from "./components/books";
import Navigation from "./components/naviagtion";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";
import BookDetails from "./components/bookDetails";
import AddBook from "./components/addBook";
import UpdateBook from "./components/updateBook";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <main className="container m-3">
          <Switch>
            <Route
              // path={`https://koalabzium.github.io/MamaWebsiteFront/books/:title`}
              path={`/books/:title`}
              component={BookDetails}
            ></Route>
            <Route
              // path={`https://koalabzium.github.io/MamaWebsiteFront/books`}
              path={`/books`}
              exact
              component={BooksView}
            ></Route>
            <Route path={`/admin`} component={AdminPanel}></Route>
            <Route path={`/edit/:title`} component={UpdateBook}></Route>

            <Route path={`/not-found`} component={NotFound}></Route>
            <Redirect from={`/`} exact to={`/books`} />
            <Redirect to={`/not-found`} />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
