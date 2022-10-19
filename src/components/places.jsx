import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Places = ({ places, onFilter }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Lokalizacje
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onFilter(null)}>Wszystkie</Dropdown.Item>
        {places.map((pl) => (
          <Dropdown.Item key={pl.id} onClick={() => onFilter(pl.id)}>
            {pl.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Places;
