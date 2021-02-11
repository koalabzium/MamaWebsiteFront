import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Categories = ({categories, onFilter}) => {
    return (
        <Dropdown>
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
    );
};

export default Categories;
