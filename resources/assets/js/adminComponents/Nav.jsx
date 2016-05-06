import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Navigation extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Admin Section</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavDropdown eventKey={3} title="Photo Sort Tables" id="basic-nav-dropdown">
            <li>
              <Link to="admin/accepts">Accepts</Link>
            </li>
            <li>
              <Link to="admin/rejects">Rejects</Link>
            </li>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  };
}

export default Navigation;
