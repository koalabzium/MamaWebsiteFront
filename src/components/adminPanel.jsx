import React, { Component } from "react";
// import LoginForm from "./loginForm";
import AddBookForm from "./addBookForm";
import LoginForm from "./loginForm";

class AdminPanel extends Component {
  state = {
    logged_in: false,
  };

  handleLogin = () => {
    this.setState({ logged_in: true });
  };

  render() {
    return (
      <div>
        {this.state.logged_in ? (
          <AddBookForm
            bookTitle="Duma i uprzedzenie"
            history={this.props.history}
          />
        ) : (
          <LoginForm />
        )}
      </div>
    );
  }
}

export default AdminPanel;
