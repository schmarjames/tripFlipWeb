import React from 'react';
import { Link } from 'react-router';
import Actions from '../actions';
import Search from './Search.jsx';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
    this.gatherCategories(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.discoveryCategoryFilterList.length > 0 && this.state.categories.length == 0) {
      this.setState({
        categories: this.state.categories.concat(nextProps.discoveryCategoryFilterList)
      });
    } else if (this.state.categories.length == 0) {
      this.gatherCategories(nextProps);
    }

  }

  gatherCategories(currentProps) {
    if (currentProps.user && currentProps.user.token) {
      if (currentProps.discoveryCategoryFilterList.length == 0) {
        // get all categories
        Actions.getCategoryPhotos();
        Actions.getLocationSearchOptions();
      }
    }
  }

  prepareCategoryNav() {
    var navButtons = this.state.categories.map((data, index) => {
      return (
        <li key={index}>
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
    var categoryButtons = (this.state.categories.length > 0) ? this.prepareCategoryNav() : <ul></ul>;
    var searchProps = {
      location : this.props.location,
      searchOptions : this.props.searchOptions,
      galleryFilterList : this.props.galleryFilterList
    }

    if (this.props.user && this.props.user.token) {
      userStateButtons =
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title="My Album" id="basic-nav-dropdown">
              <li>
                <Link to="album" query={{albumFilter : "categories"}}>Categories</Link>
              </li>
              <li>
                <Link to="album" query={{albumFilter : "countries"}}>Countries</Link>
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
      userStateButtons = <Navbar.Collapse>
        <Nav pullRight>
          <NavItem href="#signup">Sign Up</NavItem>
          <NavItem href="#login">Log In</NavItem>
        </Nav>
        </Navbar.Collapse>;
    }

    return (
      <Navbar className={this.props.styles}>
        <Navbar.Header>
          <Link to="marketing" className="title">Develop Artist</Link>
          <Navbar.Toggle />
        </Navbar.Header>
        {userStateButtons}
      </Navbar>

    );
  };
}

export default Navigation;
