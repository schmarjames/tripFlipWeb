import React from 'react';
import Actions from '../actions';
import Nav from './Nav.jsx';
import {RouteHandler} from 'react-router';

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [
        'hi there how are you',
        'what is that'
      ]
    }
    Actions.getUserData();
  }

/*  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }*/

  render() {

    return (
      <div>
        <Nav />
        {this.props.children}
      </div>
    );
  }
}

export default Admin;
