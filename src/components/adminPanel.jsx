import React, { Component } from "react";
import LoginForm from "./loginForm";
import AddBookForm from "./addBookForm";

class AdminPanel extends Component {
  state = {
    logged_in: false,
  };

  handleLogin = () => {
    this.setState({ logged_in: true });
  };

  render() {
    return <AddBookForm />;
    // if (!this.state.logged_in) return <LoginForm login={this.handleLogin} />;
    // else {
    //   return (
    //     <React.Fragment>
    //       <h1>Witaj</h1>
    //     </React.Fragment>
    //   );
    // }
  }
}

export default AdminPanel;
