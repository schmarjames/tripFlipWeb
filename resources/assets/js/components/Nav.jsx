import React from 'react';
import { Link } from 'react-router';
import Actions from '../actions';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import LinkContainer from 'react-router-bootstrap';

class Navigation extends React.Component {
  constructor(props) {
    super(props);

  }

  logout(e) {
    e.preventDefault();
    Actions.logOutUser();
  }

  render() {
    var userStateButtons = <div></div>;
console.log(Navbar);
    if (this.props.token) {
      userStateButtons = <li>
        <a href="#" onClick={this.logout}>Log Out</a>
      </li>;
    } else {
      userStateButtons = <Nav>
        <NavItem href="#signup">Sign Up</NavItem>
        <NavItem href="#login">Log In</NavItem>
        </Nav>;
    }

    return (
      <Navbar>
        <Navbar.Header>
          Reacting
        </Navbar.Header>
        <Nav>
           {userStateButtons}
        </Nav>
      </Navbar>

    );
  };
}

export default Navigation;
