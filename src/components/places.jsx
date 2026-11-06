import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Places = ({ places, onFilter, current }) => (
  <Dropdown>
    <Dropdown.Toggle variant={current ? "success" : "outline-success"} id="dropdown-basic-places">
      {current || "Lokalizacje"}
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
