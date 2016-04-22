import React from 'react';
import Actions from '../actions';
import connectToStores from 'alt-utils/lib/connectToStores';
import PhotoGalleryStore from '../stores/PhotoGalleryStore';
import Navigation from './Nav.jsx';

@connectToStores
class App extends React.Component {
  constructor() {
    super();
    Actions.getUserData();

    /*Actions.listMorePhotos('explorer',{
        "urlType" : "randomcollection",
        "data" : {
          "views" : []
        }
    } , true);*/
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    console.log(this.props);
    var navProps = {};
    if (this.props.user) {
      navProps = this.props.user;
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
