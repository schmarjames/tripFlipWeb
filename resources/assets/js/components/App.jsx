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

  setMainBackground() {
    var pathName = this.props.location.pathname.replace('/', ''),
        unRestrictedPaths = ['', 'marketing', 'login', 'signup'],
        background = {
          background : (unRestrictedPaths.indexOf(pathName) > -1) ? 'url(images/bar01.jpg) no-repeat' : '#ffffff',
          backgroundSize: 'cover'
        };

        console.log(background);
    return background;
  }

  setNavSyles() {
    var pathName = this.props.location.pathname.replace('/', ''),
        unRestrictedPaths = ['', 'marketing', 'login', 'signup'];

    if (unRestrictedPaths.indexOf(pathName) > -1) {
      return {
        background : 'rgba(0, 0, 0, 0.4)',
        color: '#ffffff',
        borderBottom: '1px solid #333',
      }
    } else {
      return {
        background : '#e7e7e7',
        color: '#000',
        borderBottom: '0px'
      }
    }
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
