import React from 'react';
import { Link } from 'react-router';
import Actions from '../actions';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotCategories : false
    };
    this.gatherCategories(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.gatherCategories(nextProps);
  }

  gatherCategories(currentProps) {
    if (currentProps.user && currentProps.user.token) {
      if (currentProps.discoveryCategoryFilterList.length == 0 && !this.state.getCategories) {
        // get all categories
        this.setState({getCategories: true});
        Actions.getCategoryPhotos();
      }
    }
  }

  prepareCategoryNav() {
    var navButtons = this.props.discoveryCategoryFilterList.map((data) => {
      return (
        <li>
          <Link to="discovery" query={{categoryId : data.category_id}}>{data.category_name}</Link>
        </li>
      );
    });
    navButtons.unshift((
      <li>
        <Link to="discovery" query={{categoryId : "all"}}>All</Link>
      </li>
    ));
    return (
      <NavDropdown title="Discovery" id="basic-nav-dropdown">
          {navButtons}
      </NavDropdown>
    );
  }

  logout(e) {
    e.preventDefault();
    Actions.logOutUser();
  }

  render() {
    var userStateButtons = <div></div>;
    var categoryButtons = (this.props.discoveryCategoryFilterList &&
      this.props.discoveryCategoryFilterList.length > 0) ? this.prepareCategoryNav() : <ul></ul>;

    if (this.props.user && this.props.user.token) {
      userStateButtons =
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={3} title="My Album" id="basic-nav-dropdown">
              <li>
                <Link to="gallery" query={{albumFilter : "categories"}}>Categories</Link>
              </li>
              <li>
                <Link to="gallery" query={{albumFilter : "locations"}}>Countries</Link>
              </li>
            </NavDropdown>
              {categoryButtons}
              <li>
                <Link to="#" onClick={this.logout}>Log Out</Link>
              </li>
          </Nav>
          <Nav className="profile-info" pullRight>
            <li>
              <span className="profile-pic">
                <img src={this.props.user.profile_pic} />
              </span>
            </li>
            <li>
              <span className="profile-name">
                {this.props.user.name}
              </span>
            </li>
          </Nav>
        </Navbar.Collapse>;
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
          <Navbar.Toggle />
        </Navbar.Header>
        {userStateButtons}
      </Navbar>

    );
  };
}

export default Navigation;
