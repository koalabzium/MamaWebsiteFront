import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Categories = (props) => {
  const { categories, onFilter, current } = props;
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col">
            <Dropdown className="m-3">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Kategorie
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onFilter(null)}>
                  Wszystkie
                </Dropdown.Item>
                {categories.map((cat) => (
                  <Dropdown.Item key={cat.id} onClick={() => onFilter(cat.id)}>
                    {cat.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col">
            <div className="alert alert-light" role="alert">
              {current}
            </div>
          </div>
          <div className="col-8">
            <h6></h6>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Categories;
