import React from 'react';
import { Link } from 'react-router'

class Nav extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="nav-bar row">
        <ul role="nav">
          <li><Link to="/about">AdminPage</Link></li>
          <li><Link to="/repos">Another</Link></li>
        </ul>
      </div>
    );
  };
}

export default Nav;
