import React, { Component } from "react";
import "./App.css";
import {Route, Routes, Navigate} from "react-router-dom"
import BooksView from "./components/books";
import Navigation from "./components/naviagtion";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";
import UpdateBook from "./components/updateBook";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <main className="container m-3">
          <Routes>
            <Route path={'/books'} exact element={<BooksView/>}/>
            <Route path={'/admin'} element={<AdminPanel/>}/>
            <Route path={'/edit/:title'} element={<UpdateBook/>}/>

            <Route path={'/not-found'} element={<NotFound/>}/>

            <Route path={'/'} element={<Navigate to="/books" />} />
          </Routes>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
