import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Categories = props => {
  const { categories, onFilter } = props;
  return (
    <React.Fragment>
      <Dropdown className="m-3">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Kategorie
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onFilter(null)}>
            Wszystkie
          </Dropdown.Item>
          {categories.map(cat => (
            <Dropdown.Item key={cat.id} onClick={() => onFilter(cat.id)}>
              {cat.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default Categories;
