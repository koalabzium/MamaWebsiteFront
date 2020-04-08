import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";

class Navigation extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar sticky="top" bg="light" expand="lg">
          <Navbar.Brand href="/">Biblioteka</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href={"/books"}>Książki</Nav.Link>
            </Nav>
            <Form inline>
              <Button variant="outline-dark" href={"/admin"}>
                Panel adminki
              </Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Navigation;
