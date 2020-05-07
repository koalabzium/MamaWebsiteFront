import React from "react";

const Input = (props) => {
  const { label, name, value, onChange, type } = props;
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        noValidate
      ></input>
    </div>
  );
};

export default Input;
