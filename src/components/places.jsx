import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Places = ({ places, onFilter }) => (
  <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic-places">
      Lokalizacje
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item onClick={() => onFilter(null)}>Wszystkie</Dropdown.Item>
      {places.map((place) => (
        <Dropdown.Item key={place.id} onClick={() => onFilter(place.id)}>
          {place.name}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default Places;
