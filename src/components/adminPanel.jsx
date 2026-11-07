import React from "react";
import { NavLink } from "react-router-dom";
import LoginForm from "./loginForm";
import ManageCategories from "./manageCategories";
import ManageReaders from "./manageReaders";
import ManagePlaces from "./managePlaces";
import AdminBorrowings from "./adminBorrowings";
import useAuth from "../hooks/useAuth";

// One tab per admin section. Borrowings is the default (/admin) since it's
// the day-to-day screen; the others are occasional setup.
const SECTIONS = [
  { key: "borrowings", path: "/admin", label: "Wypożyczenia", Component: AdminBorrowings },
  { key: "readers", path: "/admin/readers", label: "Czytelnicy", Component: ManageReaders },
  { key: "categories", path: "/admin/categories", label: "Kategorie", Component: ManageCategories },
  { key: "places", path: "/admin/places", label: "Lokalizacje", Component: ManagePlaces },
];

const tabClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

const AdminPanel = ({ section = "borrowings" }) => {
  const { isLoggedIn, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <LoginForm onLogin={login} />;
  }

  const { Component } = SECTIONS.find((s) => s.key === section) || SECTIONS[0];

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1>Witaj Marysiu!</h1>
        <button onClick={logout} className="btn btn-outline-primary btn-sm">
          Wyloguj się
        </button>
      </div>

      <ul className="nav nav-tabs admin-panel__tabs mb-3">
        {SECTIONS.map(({ key, path, label }) => (
          <li className="nav-item" key={key}>
            <NavLink end to={path} className={tabClass}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <Component />
    </div>
  );
};

export default AdminPanel;
