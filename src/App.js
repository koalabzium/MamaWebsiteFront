import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import BooksView from "./components/books";
import AddBookScreen from "./components/AddBookScreen";
import Navigation from "./components/naviagtion";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";

const App = () => (
  <React.Fragment>
    <Navigation />
    <main className="m-1">
      <Routes>
        <Route path={"/books"} exact element={<BooksView />} />
        <Route path={"/books/add"} exact element={<AddBookScreen />} />
        <Route path={"/admin"} element={<AdminPanel />} />

        <Route path={"/not-found"} element={<NotFound />} />
        <Route path={"*"} element={<NotFound />} />

        <Route path={"/"} element={<Navigate to="/books" />} />
      </Routes>
    </main>
  </React.Fragment>
);

export default App;
