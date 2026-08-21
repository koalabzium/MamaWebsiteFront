import React, { Component } from "react";
import { Navbar, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class Navigation extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar sticky="top" bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">
            Biblioteka
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <Nav className="mr-auto">
              <Nav.Link
                // href={`https://koalabzium.github.io/MamaWebsiteFront/books`}
                href={`/books`}
              >
                Książki
              </Nav.Link>
            </Nav> */}
            <Form inline>
              <Button as={Link} variant="outline-dark" to="/admin">
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
