import React from "react";
import { NavLink } from "react-router-dom";
import LoginForm from "./loginForm";
import ManageCategories from "./manageCategories";
import ManageReaders from "./manageReaders";
import ManagePlaces from "./managePlaces";
import AdminBorrowings from "./adminBorrowings";
import useAuth from "../hooks/useAuth";

const tabClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

// section: "settings" (categories/readers/places) or "borrowings".
const AdminPanel = ({ section = "settings" }) => {
  const { isLoggedIn, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1>Witaj Marysiu!</h1>
        <button onClick={logout} className="btn btn-outline-primary btn-sm">
          Wyloguj się
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <NavLink end to="/admin" className={tabClass}>
            Ustawienia
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/borrowings" className={tabClass}>
            Wypożyczenia
          </NavLink>
        </li>
      </ul>

      {section === "borrowings" ? (
        <AdminBorrowings />
      ) : (
        <div className="row">
          <div className="col">
            <ManageCategories />
          </div>
          <div className="col">
            <ManageReaders />
          </div>
          <div className="col">
            <ManagePlaces />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
