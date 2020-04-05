import React, { Component } from "react";

class LoginForm extends Component {
  state = {
    account: {
      username: "",
      password: "",
    },

    errors: null,
  };

  validate = () => {
    const { account } = this.state;
    const errors = [];
    if (account.username === "") {
      errors.push("Nazwa użytkowniczki jest wymagana.");
    }

    if (account.password === "") {
      errors.push("Hasło jest wymagane.");
    }

    return errors.length === 0 ? null : errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    if (errors != null) {
      this.setState({ errors });
      return;
    }
    this.props.login();
  };

  handleChange = (e) => {
    const account = { ...this.state.account };
    account[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ account });
  };

  render() {
    const { account, errors } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto form p-4">
              <h1>Zaloguj się</h1>
              <form
                className="justify-content-center"
                onSubmit={this.handleSubmit}
              >
                {errors && (
                  <div className="alert alert-danger">
                    {errors.map((error) => (
                      <h6 key={error}>{error}</h6>
                    ))}
                  </div>
                )}
                <div className="form-group">
                  <label>Nazwa użytkowniczki</label>
                  <input
                    onChange={this.handleChange}
                    value={account.username}
                    autoFocus
                    name="username"
                    className="form-control"
                    placeholder="Podaj nazwę użytkowniczki"
                  ></input>
                </div>
                <div className="form-group">
                  <label>Hasło</label>
                  <input
                    onChange={this.handleChange}
                    value={account.password}
                    type="password"
                    name="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Podaj hasło"
                  ></input>
                </div>
                <button type="submit" className="btn btn-primary">
                  Loguj
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginForm;
