import React from "react";

const Input = (props) => {
  return (
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" placeholder="Password"></input>
      </div>
    </div>
  );
};

export default Input;
