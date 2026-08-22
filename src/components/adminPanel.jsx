import React from "react";
import LoginForm from "./loginForm";
import ManageCategories from "./manageCategories";
import ManageReaders from "./manageReaders";
import ManagePlaces from "./managePlaces";
import useAuth from "../hooks/useAuth";

const AdminPanel = () => {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Witaj Marysiu!</h1>
          <button onClick={logout} className="btn btn-primary">
            Wyloguj się
          </button>
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
        </div>
      ) : (
        <LoginForm onLogin={login} />
      )}
    </div>
  );
};

export default AdminPanel;
