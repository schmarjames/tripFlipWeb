import React from 'react';
import { Link } from 'react-router';
import Actions from '../actions';

class Nav extends React.Component {
  constructor(props) {
    super(props);

  }

  logout(e) {
    e.preventDefault();
    Actions.logOutUser();
  }

  render() {
    var userStateButtons = <div></div>;

    if (this.props.token) {
      userStateButtons = <li>
        <a href="#" onClick={this.logout}>Log Out</a>
      </li>;
    } else {
      userStateButtons = <div>
          <li>
            <Link to="signup">Sign Up</Link>
          </li>
          <li>
            <Link to="login">Log In</Link>
          </li>
        </div>;
    }

    return (
      <div className="nav-bar row">
        <ul role="nav">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/repos">Repos</Link></li>
          { userStateButtons }
        </ul>
      </div>
    );
  };
}

export default Nav;
