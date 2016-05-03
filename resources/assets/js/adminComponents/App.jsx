import React from 'react';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import AdminStore from '../stores/AdminStore';
import Navigation from './Nav.jsx';

@connectToStores
class App extends React.Component {
  constructor() {
    super();
    Actions.getAUserData();
  }

  static getStores() {
    return [AdminStore];
  }

  static getPropsFromStores() {
    return AdminStore.getState();
  }

  render() {
    console.log(this.props);
    var navProps = {};
    if (this.props.user) {
      navProps = {
        user : this.props.user
      };
    }
    return (
      <div>
        <Navigation {...navProps}/>
        {this.props.children}
      </div>
    );
  }
}

export default App;
