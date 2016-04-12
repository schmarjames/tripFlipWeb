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
  listMorePhotos(data) {
    // missing token!
    if (!data.photos) {
      Actions.logOutUser();
      return;
    }

    if (data.view == 'gallery') {
      if (data.filter) {
        this.setState({currentGalleryList : data.photos});
        return;
      }
      this.setState({
        currentGalleryList : this.state.currentGalleryList.concat(data.photos)
      });
    }

    if (data.view == 'discovery') {
      if (data.filter) {
        this.setState({currentDiscoveryList : data.photos});
        return;
      }
      this.setState({
        currentDiscoveryList : this.state.currentDiscoveryList.concat(data.photos)
      });
    }
  }

  @bind(Actions.likePhoto);
  likePhoto(photoId) {
    var self = this,
        lists = ['currentGalleryList', 'currentDiscoveryList'];

    lists.forEach((list) => {
      var index = this.state[list].findIndex((el, idx, array) => {
            if (el.id == photo.id) { return true; }
                  return false;
          }),
          listCopy = JSON.parse(JSON.strigify(this.state[list]));

      if (listCopy[index].likedByUser) {
        listCopy[index].likes--;
        listCopy[index].likedByUser = false;
      } else {
        listCopy[index].likes++;
        listCopy[index].likedByUser = true;
      }

      self.setState({[list]: listCopy});
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
