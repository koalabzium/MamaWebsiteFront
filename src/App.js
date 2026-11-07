import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import BooksView from "./components/books";
import AddBookScreen from "./components/AddBookScreen";
import EditBookScreen from "./components/EditBookScreen";
import BorrowBookScreen from "./components/BorrowBookScreen";
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
        <Route path={"/books/:id/edit"} element={<EditBookScreen />} />
        <Route path={"/books/:id/borrow"} element={<BorrowBookScreen />} />
        <Route path={"/admin"} element={<AdminPanel />} />
        {/* Old link to the borrowings tab, which is now the /admin default. */}
        <Route path={"/admin/borrowings"} element={<Navigate to="/admin" replace />} />
        <Route path={"/admin/readers"} element={<AdminPanel section="readers" />} />
        <Route path={"/admin/categories"} element={<AdminPanel section="categories" />} />
        <Route path={"/admin/places"} element={<AdminPanel section="places" />} />

        <Route path={"/not-found"} element={<NotFound />} />
        <Route path={"*"} element={<NotFound />} />

        <Route path={"/"} element={<Navigate to="/books" />} />
      </Routes>
    </main>
  </React.Fragment>
);

export default App;
