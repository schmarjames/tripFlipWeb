import alt from '../alt';
import Actions from '../actions';
import {decorate, bind, datasource} from 'alt-utils/lib/decorators';
import ls from 'local-storage';

@decorate(alt)
class PhotoGalleryStore {
  constructor() {
    this.state = {
      loggedIn : false,
      user : {},
      viewGalleryFilter: 'CATAGORIES',
      currentGalleryList: [],
      viewDiscoveryFilter: 'ALL',
      currentDiscoveryList: [],
      photoCards : undefined
    }
  }

  @bind(Actions.logInUser);
  login(user) {
    if (typeof user === 'object') {
      this.setState({
        loggedIn: true,
        user: Object.assign(this.state.user, user)
      });
      ls.remove('userData');
      ls('userData', user);
    }
  }

  @bind(Actions.logOutUser);
  logout(status) {
    console.log(status);
    if (status) {
      this.setState({
        loggedIn: false,
        user: Object.assign(this.state.user, {})
      });
    }
  }

  @bind(Actions.getUserData);
  getUserData(user) {
    this.setState({
      loggedIn: true,
      user: Object.assign(this.state.user, user)
    });
  }

  @bind(Actions.listMorePhotos);
  getMorePhotos(view, data, newFilter) {
    // missing token!
    if (!data) {
      Actions.logOutUser();
      return;
    }

    if (view == 'gallery') {
      if (newFilter) {
        this.setState({currentGalleryList : data});
        return;
      }
      this.setState({
        currentGalleryList : this.state.currentGalleryList.concat(data)
      });
    }

    if (view == 'discovery') {
      if (newFilter) {
        this.setState({
          currentDiscoveryList : data
        });
        return;
      }
      this.setState({
        currentDiscoveryList : this.state.currentDiscoveryList.concat(data)
      });
    }
  }

  @bind(Actions.likePhoto);
  likePhoto(photoId) {
    // update each list if photo exist
    var index = this.state.currentGalleryList.findIndex((el, idx, array) => {
          if (el.id == photo.id) { return true; }
                return false;
        });
  }

  @bind(Actions.setCurrentViewFilter);
  setViewFilter(data) {
    if (data.currentView == 'gallery') {
      this.setState({viewGalleryFilter: data.filter});
    } else if (data.currentView == 'discovery') {
      this.setState({viewDiscoveryFilter: data.filter});
    }
  }
}

export default alt.createStore(PhotoGalleryStore);
