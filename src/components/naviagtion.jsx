import React from "react";
import { Navbar, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = () => (
  <Navbar sticky="top" bg="light" expand="lg">
    <Navbar.Brand as={Link} to="/">
      Biblioteka
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Form inline>
        <Button as={Link} variant="outline-dark" to="/admin">
          Panel adminki
        </Button>
      </Form>
    </Navbar.Collapse>
  </Navbar>
);

export default Navigation;
