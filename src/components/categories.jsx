import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Categories = ({ categories, onFilter, current }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant={current ? "success" : "outline-success"} id="dropdown-basic">
        {current || "Kategorie"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onFilter(null)}>Wszystkie</Dropdown.Item>
        {categories.map((cat) => (
          <Dropdown.Item key={cat.id} onClick={() => onFilter(cat.id)}>
            {cat.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Categories;
