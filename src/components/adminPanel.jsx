import React, { Component } from "react";
import LoginForm from "./loginForm";
import ManageCategories from "./manageCategories";
import ManageReaders from "./manageReaders";

class AdminPanel extends Component {
  state = {
    logged_in: false,
  };

  componentDidMount() {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      this.setState({ logged_in: true });
    } else {
      this.setState({ logged_in: false });
    }
  }

  handleLogin = () => {
    this.setState({ logged_in: true });
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: false });
  };

  render() {
    return (
      <div>
        {this.state.logged_in ? (
          <div>
            <h1>Witaj Marysiu!</h1>
            <button onClick={this.handleLogout} className="btn btn-primary">
              Wyloguj się
            </button>
            <div className="row">
              <div className="col">
                <ManageCategories />
              </div>
              <div className="col">
                <ManageReaders />
              </div>
            </div>
          </div>
        ) : (
          <LoginForm
            history={this.props.history}
            handleLogin={this.handleLogin}
          />
        )}
      </div>
    );
  }
}

export default AdminPanel;
