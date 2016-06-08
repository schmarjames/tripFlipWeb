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
  }

  setMainBackground() {
    var pathName = this.props.location.pathname.replace('/', ''),
        unRestrictedPaths = ['', 'marketing', 'login', 'signup'],
        background = {
          background : (unRestrictedPaths.indexOf(pathName) > -1) ? 'url(images/greece.jpg) no-repeat' : '#ffffff'
        };

    return background;
  }

  setNavSyles() {
    var pathName = this.props.location.pathname.replace('/', ''),
        unRestrictedPaths = ['', 'marketing', 'login', 'signup'];
    return (unRestrictedPaths.indexOf(pathName) > -1) ? 'marketing' : 'in-app';
  }

  static getStores() {
    return [PhotoGalleryStore];
  }

  static getPropsFromStores() {
    return PhotoGalleryStore.getState();
  }

  render() {
    console.log(this.props);

    var background = this.setMainBackground();
    var navProps = {
      styles : this.setNavSyles()
    };
    if (this.props.user) {
      navProps = {
        user : this.props.user,
        discoveryCategoryFilterList : this.props.discoveryCategoryFilterList,
        location : this.props.location,
        searchOptions : this.props.searchOptions,
        galleryFilterList : this.props.galleryFilterList,
        styles : this.setNavSyles()
      };
    }
    return (
      <div className="mainWrap" style={background}>
        <Navigation {...navProps}/>
        {this.props.children}
      </div>
    );
  }
}

export default App;
