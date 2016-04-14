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
      photoAlbumSummary : [],
      viewGalleryFilter: 'CATAGORIES',
      galleryFilterList: [
        'CATAGORIES',
        'LOCATIONS',
        'SPECIFIC_CATAGORIES',
        'SPECIFIC_LOCATIONS'
      },
      currentGalleryList: [],
      viewDiscoveryFilter: 'all',
      discoveryCategoryFilterList: [],
      currentDiscoveryList: [],
      photoCards : []
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

    if (data.view == 'explorer') {
      if (data.filter) {
        this.setState({photoCards : data.photos});
        return;
      }
      this.setState({
        photoCards : this.state.photoCards.concat(data.photos)
      });
    }
  }

  @bind(Actions.getCategoryPhotos);
  getCategoryPhotos(data) {
    if (!data) {
      Actions.logOutUser();
      return;
    }

    this.setState({
      discoveryCategoryFilterList : this.state.discoveryCategoryFilterList.concat(data)
    });

  }

  @bind(Actions.getUserAlbumPhotos);
  getUserAlbumPhotos(data) {
    if (!data) {
      Actions.logOutUser();
      return;
    }

    this.setState({
      photoAlbumSummary : this.state.photoAlbumSummary.concat(data)
    });
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
    var match,
        newFilter;
    if (data.currentView == 'gallery') {
      match = this.state.galleryFilterList.filter((galleryViewEntry) => {
        if (galleryViewEntry == data.filter) return galleryViewEntry;
      })[0];

      newFilter = (match) ? data.filter : 'CATAGORIES';
      this.setState({viewGalleryFilter: data.filter});
    } else if (data.currentView == 'discovery') {
      match = this.state.discoveryCategoryFilterList.filter((categoryEntry) => {
        if (categoryEntry.category_name == data.filter) return categoryEntry;
      })[0];

      newFilter = (match) ? data.filter : 'all';
      this.setState({viewDiscoveryFilter: newFilter});
    }
  }
}

export default alt.createStore(PhotoGalleryStore);
