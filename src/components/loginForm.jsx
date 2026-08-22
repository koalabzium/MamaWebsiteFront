import React, { useState } from "react";
import { login } from "../services/loginService";

const validate = (account) => {
  const errors = [];
  if (account.username === "") {
    errors.push("Nazwa użytkowniczki jest wymagana.");
  }
  if (account.password === "") {
    errors.push("Hasło jest wymagane.");
  }
  return errors.length === 0 ? null : errors;
};

const LoginForm = ({ onLogin }) => {
  const [account, setAccount] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    setAccount({ ...account, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(account);
    if (validationErrors != null) {
      setErrors(validationErrors);
      return;
    }
    try {
      const {
        data: { signedToken },
      } = await login(account.username, account.password);
      setErrors(null);
      onLogin(signedToken);
    } catch (e) {
      setErrors(["Zły login lub hasło :("]);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto form p-4">
          <h1>Zaloguj się</h1>
          <form className="justify-content-center" onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                onChange={handleChange}
                value={account.password}
                type="password"
                name="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Podaj hasło"
              ></input>
            </div>
            <button type="submit" className="btn btn-primary">
              Zaloguj
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
