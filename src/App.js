import React, { Component } from "react";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";
import BooksView from "./components/books";
import Navigation from "./components/naviagtion";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";
import BookDetails from "./components/bookDetails";

class App extends Component {
  state = {};
  render() {
    console.log("Pupa pupa", process.env.PUBLIC_URL);
    return (
      <React.Fragment>
        <Navigation />
        <main className="container m-3">
          <Switch>
            <Route
              path={process.env.PUBLIC_URL + "/books/:title"}
              component={BookDetails}
            ></Route>
            <Route
              path={process.env.PUBLIC_URL + "/books"}
              exact
              component={BooksView}
            ></Route>
            <Route
              path={process.env.PUBLIC_URL + "/admin"}
              component={AdminPanel}
            ></Route>
            {/* <Route path={process.env.PUBLIC_URL + "/not-found"} component={NotFound}></Route> */}
            <Redirect
              from={process.env.PUBLIC_URL + "/"}
              exact
              to={process.env.PUBLIC_URL / +"books"}
            />
            {/* <Redirect to={process.env.PUBLIC_URL + "/not-found"} /> */}
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
